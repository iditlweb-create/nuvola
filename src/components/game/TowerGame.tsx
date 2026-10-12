"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
 * מגדל נובולה — one-tap stacking game (spec: "המשחק: מגדל נובולה").
 * Canvas draws only graphics; every piece of text is DOM (Polin / Leon).
 * ------------------------------------------------------------------------- */

type Flavor = "pistachio" | "raspberry" | "mango" | "chocolate" | "vanilla" | "mint" | "gold";
type Phase = "intro" | "playing" | "paused" | "over";

type Ball = { x: number; w: number; bottom: number; flavor: Flavor };
type Drip = { x: number; y: number; w: number; vy: number; life: number; color: string };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

const LW = 400; // logical width of the play field
const BASE_W = 150; // first scoop / cone mouth width
const BALL_RATIO = 0.806; // visible ball height / width (from the sprites)
const NEST = 0.38; // how much a scoop sinks into the one below (fraction of its height)
const GRAVITY = 2600;
const MAX_TIME = 90; // seconds
const FLAVORS: Flavor[] = ["pistachio", "raspberry", "mango", "chocolate", "vanilla", "mint"];

const REWARDS = [
  { min: 30, title: "נכנסת לטבלת המובילים השבועית", detail: "ועוד כדור שני במתנה" },
  { min: 20, title: "כדור שני במתנה", detail: "בכל אחד משלושת הסניפים" },
  { min: 10, title: "תוספת חינם", detail: "על כל כדור בסניף" },
];

const LEADERS = [
  { name: "נועה מפלורנטין", score: 47 },
  { name: "אבי ר.", score: 41 },
  { name: "מגדל של שירה", score: 38 },
  { name: "דניאל מחיפה", score: 33 },
];

function track(event: string, data?: Record<string, unknown>) {
  // Measurement events from the spec: start, end + score, coupon saved, share.
  console.info("[nuvola:event]", event, data ?? {});
}

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function TowerGame({
  mode = "full",
  autoStart = false,
  onEnd,
}: {
  mode?: "full" | "teaser";
  autoStart?: boolean;
  onEnd?: () => void;
}) {
  const teaser = mode === "teaser";
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [ballCount, setBallCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [muted, setMuted] = useState(true);
  const [flash, setFlash] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const phaseRef = useRef<Phase>("intro");
  // Kept in a ref so a new callback from the parent never restarts the game loop
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);
  const mutedRef = useRef(true);
  const reducedRef = useRef(false);

  // All mutable game state lives here (not React state) so the loop stays at 60fps.
  const g = useRef({
    balls: [] as Ball[],
    cur: { x: LW / 2, w: BASE_W, bottom: 0, flavor: "pistachio" as Flavor, dir: 1, falling: false, vy: 0, missed: false, rot: 0 },
    drips: [] as Drip[],
    sparks: [] as Spark[],
    speed: 150,
    camY: 0,
    t: 0,
    elapsed: 0,
    score: 0,
    combo: 0,
    lastGold: -10,
    endAt: 0,
    H: 640,
    scale: 1,
    colors: {} as Record<Flavor, string>,
    imgs: {} as Record<string, HTMLImageElement>,
  });

  const setPhaseBoth = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  /* ---------- sound (off by default, per spec) ---------- */
  const audioRef = useRef<AudioContext | null>(null);
  const blip = useCallback((freq: number, dur = 0.08) => {
    if (mutedRef.current) return;
    audioRef.current ??= new AudioContext();
    const ctx = audioRef.current;
    const o = ctx.createOscillator();
    const v = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    v.gain.setValueAtTime(0.12, ctx.currentTime);
    v.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(v).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  }, []);

  /* ---------- helpers ---------- */
  const topOfTower = () => {
    const s = g.current;
    const last = s.balls[s.balls.length - 1];
    return last ? last.bottom - last.w * BALL_RATIO : 0; // world y, negative is up
  };

  const nextBall = useCallback(() => {
    const s = g.current;
    const last = s.balls[s.balls.length - 1];
    const w = last ? last.w : BASE_W;
    const gold = s.balls.length >= 4 && s.balls.length - s.lastGold > 4 && Math.random() < 0.14;
    if (gold) s.lastGold = s.balls.length;
    const fromStart = Math.random() < 0.5;
    s.cur = {
      x: fromStart ? w / 2 + 12 : LW - w / 2 - 12,
      w,
      bottom: topOfTower() - 110,
      flavor: gold ? "gold" : FLAVORS[Math.floor(Math.random() * FLAVORS.length)],
      dir: fromStart ? 1 : -1,
      falling: false,
      vy: 0,
      missed: false,
      rot: 0,
    };
    s.speed = Math.min(430, 150 + s.balls.length * 10);
  }, []);

  const resetWorld = useCallback(() => {
    const s = g.current;
    s.balls = [];
    s.drips = [];
    s.sparks = [];
    s.score = 0;
    s.combo = 0;
    s.elapsed = 0;
    s.lastGold = -10;
    s.camY = -(s.H - 30 - BASE_W * 1.04);
    nextBall();
  }, [nextBall]);

  const endGame = useCallback(
    (reason: "miss" | "time") => {
      const s = g.current;
      if (phaseRef.current === "over") return;
      setPhaseBoth("over");
      blip(180, 0.3);
      track("game_end", { score: s.score, balls: s.balls.length, reason, seconds: Math.round(s.elapsed) });
      onEndRef.current?.();
    },
    [blip, setPhaseBoth],
  );

  const start = useCallback(() => {
    resetWorld();
    setScore(0);
    setCombo(0);
    setBallCount(0);
    setTimeLeft(MAX_TIME);
    setCoupon(null);
    setFormError(null);
    setPhaseBoth("playing");
    track("game_start", { mode });
    canvasRef.current?.focus({ preventScroll: true });
  }, [mode, resetWorld, setPhaseBoth]);

  // Started from the home page button: skip the intro card and go straight into the round
  useEffect(() => {
    if (!autoStart) return;
    const id = setTimeout(start, 60);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drop = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    const c = g.current.cur;
    if (c.falling || c.missed) return;
    c.falling = true;
    c.vy = 0;
  }, []);

  const resolveLanding = useCallback(() => {
    const s = g.current;
    const c = s.cur;
    const prev = s.balls[s.balls.length - 1] ?? { x: LW / 2, w: BASE_W };
    const l = Math.max(prev.x - prev.w / 2, c.x - c.w / 2);
    const r = Math.min(prev.x + prev.w / 2, c.x + c.w / 2);
    const overlap = r - l;

    if (overlap < 14) {
      c.missed = true; // keeps falling off the tower
      c.falling = true;
      s.endAt = s.t + 0.9;
      return;
    }

    const perfect = Math.abs(c.x - prev.x) <= Math.max(3, c.w * 0.05);
    let x = c.x;
    let w = c.w;
    if (perfect) {
      x = prev.x;
      s.combo += 1;
      blip(660 + s.combo * 60);
      if (!reducedRef.current) {
        for (let i = 0; i < 14; i++) {
          const a = (Math.PI * 2 * i) / 14;
          s.sparks.push({ x, y: c.bottom - c.w * BALL_RATIO * 0.5, vx: Math.cos(a) * 160, vy: Math.sin(a) * 160, life: 0.6 });
        }
      }
    } else {
      s.combo = 0;
      w = overlap;
      x = (l + r) / 2;
      // The part that sticks out melts and drips away.
      const cutW = c.w - overlap;
      const cutX = c.x < prev.x ? c.x - c.w / 2 + cutW / 2 : c.x + c.w / 2 - cutW / 2;
      s.drips.push({ x: cutX, y: c.bottom - c.w * BALL_RATIO * 0.4, w: cutW, vy: 0, life: 1.2, color: s.colors[c.flavor] });
      blip(440);
    }

    const pts = (c.flavor === "gold" ? 5 : 1) * (perfect ? 2 : 1);
    s.score += pts;
    setScore(s.score);
    setCombo(s.combo);
    setFlash(perfect ? (c.flavor === "gold" ? `זהב מושלם! +${pts}` : `מושלם! +${pts}`) : c.flavor === "gold" ? `כדור זהב +${pts}` : null);
    s.balls.push({ x, w, bottom: c.bottom, flavor: c.flavor });
    setBallCount(s.balls.length);
    nextBall();
  }, [blip, nextBall]);

  /* ---------- setup: images, colors, resize, loop ---------- */
  useEffect(() => {
    const s = g.current;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pal = {
      pistachio: cssVar("--color-pistachio"),
      cherry: cssVar("--color-cherry"),
      mango: cssVar("--color-mango"),
      chocolate: cssVar("--color-chocolate"),
      cream: cssVar("--color-cream"),
      cloud: cssVar("--color-cloud"),
    };
    s.colors = {
      pistachio: pal.pistachio,
      raspberry: pal.cherry,
      mango: pal.mango,
      chocolate: pal.chocolate,
      vanilla: pal.cream,
      mint: pal.pistachio,
      gold: pal.mango,
    };

    for (const name of [...FLAVORS.map((f) => `ball-${f}`), "ball-gold", "cone", "cloud"]) {
      const img = new Image();
      img.src = `/images/game-${name}.webp`;
      s.imgs[name] = img;
    }

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const resize = () => {
      const rect = wrapRef.current!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      s.scale = (rect.width / LW) * dpr;
      s.H = rect.height / (rect.width / LW);
      if (phaseRef.current === "intro") s.camY = -(s.H - 30 - BASE_W * 1.04);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current!);
    resize();
    resetWorld();

    const drawSprite = (key: string, cx: number, bottom: number, w: number, rot = 0) => {
      // Ball sprites: 512px canvas, visible shape 448 wide, bottom edge at ~436px.
      const img = s.imgs[key];
      if (!img?.complete) return;
      const k = w / 448;
      const size = 512 * k;
      ctx.save();
      ctx.translate(cx, bottom);
      if (rot) ctx.rotate(rot);
      ctx.drawImage(img, -size / 2, -436 * k, size, size);
      ctx.restore();
    };

    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const playing = phaseRef.current === "playing";
      const over = phaseRef.current === "over";
      if (playing || over) s.t += dt;

      /* ---- update ---- */
      if (playing) {
        s.elapsed += dt;
        const left = Math.max(0, MAX_TIME - s.elapsed);
        setTimeLeft((p) => (Math.ceil(left) !== p ? Math.ceil(left) : p));
        if (left <= 0) endGame("time");

        const c = s.cur;
        if (!c.falling) {
          c.x += c.dir * s.speed * dt;
          const minX = c.w / 2 + 8;
          const maxX = LW - c.w / 2 - 8;
          if (c.x < minX) {
            c.x = minX;
            c.dir = 1;
          }
          if (c.x > maxX) {
            c.x = maxX;
            c.dir = -1;
          }
        } else {
          c.vy += GRAVITY * dt;
          c.bottom += c.vy * dt;
          if (c.missed) {
            c.rot += dt * 3 * (c.x < LW / 2 ? -1 : 1);
            if (s.t >= s.endAt) endGame("miss");
          } else {
            const prev = s.balls[s.balls.length - 1];
            const landing = prev ? prev.bottom - prev.w * BALL_RATIO * (1 - NEST) : c.w * BALL_RATIO * 0.22;
            if (c.bottom >= landing) {
              c.bottom = landing;
              resolveLanding();
            }
          }
        }
      }
      for (const d of s.drips) {
        d.vy += GRAVITY * 0.5 * dt;
        d.y += d.vy * dt;
        d.life -= dt;
      }
      s.drips = s.drips.filter((d) => d.life > 0);
      for (const p of s.sparks) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      }
      s.sparks = s.sparks.filter((p) => p.life > 0);

      // Camera follows the tower so the moving scoop sits ~28% from the top.
      const floorCam = -(s.H - 30 - BASE_W * 1.04);
      const want = Math.min(floorCam, s.cur.bottom - s.cur.w * BALL_RATIO - s.H * 0.28);
      s.camY += (want - s.camY) * Math.min(1, dt * 4);

      /* ---- draw ---- */
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = pal.cloud;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(s.scale, 0, 0, s.scale, 0, 0);

      // Parallax clouds
      const cloud = s.imgs.cloud;
      if (cloud?.complete) {
        ctx.globalAlpha = 0.85;
        for (let i = 0; i < 6; i++) {
          const drift = reducedRef.current ? 0 : s.t * (8 + i * 3);
          const x = ((i * 137 + drift) % (LW + 200)) - 100;
          const y = ((i * 211 - s.camY * 0.3) % (s.H + 160)) - 80;
          const w = 90 + (i % 3) * 40;
          ctx.drawImage(cloud, x, y, w, w);
        }
        ctx.globalAlpha = 1;
      }

      ctx.save();
      ctx.translate(0, -s.camY);

      // Cone: its mouth is world y = 0
      const cone = s.imgs.cone;
      if (cone?.complete) {
        const k = (BASE_W * 1.02) / 430;
        ctx.drawImage(cone, LW / 2 - 256 * k, -40 * k, 512 * k, 512 * k);
      }

      // Tower (with a gentle sway that grows with height)
      const n = s.balls.length;
      const swayAmp = reducedRef.current ? 0 : Math.min(16, n * 0.7);
      s.balls.forEach((b, i) => {
        const sway = n ? Math.sin(s.t * 1.7) * swayAmp * Math.pow((i + 1) / n, 1.6) : 0;
        drawSprite(`ball-${b.flavor}`, b.x + sway, b.bottom, b.w);
      });

      // Drips (melting overhang)
      for (const d of s.drips) {
        ctx.globalAlpha = Math.max(0, d.life / 1.2);
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.w / 2, Math.max(6, d.w * 0.35), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(d.x, d.y + d.w * 0.35, Math.max(3, d.w * 0.12), Math.max(6, d.w * 0.3), 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Moving / falling scoop
      if (phaseRef.current !== "intro") {
        const c = s.cur;
        if (!c.falling && playing) {
          ctx.strokeStyle = pal.chocolate;
          ctx.globalAlpha = 0.18;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.moveTo(c.x, c.bottom + 6);
          ctx.lineTo(c.x, topOfTower() + 4);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }
        drawSprite(`ball-${c.flavor}`, c.x, c.bottom, c.w, c.rot);
      }

      // Sparkles on perfect hits
      ctx.fillStyle = pal.mango;
      for (const p of s.sparks) {
        ctx.globalAlpha = Math.max(0, p.life / 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (document.hidden && phaseRef.current === "playing") setPhaseBoth("paused");
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [endGame, resetWorld, resolveLanding, setPhaseBoth]);

  // Flash messages fade out on their own
  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 900);
    return () => clearTimeout(id);
  }, [flash, score]);

  /* ---------- keyboard: Space / Enter drop, P / Escape pause ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, button, a, textarea")) return;
      // On the home page the teaser only listens while it has focus, so Space still scrolls the page.
      if (teaser && !wrapRef.current?.contains(document.activeElement)) return;
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (phaseRef.current === "playing") drop();
        else if (phaseRef.current === "paused") setPhaseBoth("playing");
      } else if (e.code === "KeyP" || e.code === "Escape") {
        if (phaseRef.current === "playing") setPhaseBoth("paused");
        else if (phaseRef.current === "paused") setPhaseBoth("playing");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drop, setPhaseBoth, teaser]);

  const reward = REWARDS.find((r) => score >= r.min);

  const onCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").replace(/[\s-]/g, "");
    if (!name) return setFormError("נשמח לדעת איך לקרוא לך");
    if (!/^05\d{8}$/.test(phone)) return setFormError("מספר נייד בפורמט 05X-XXXXXXX");
    if (!fd.get("terms")) return setFormError("כדי לשמור קופון צריך לאשר את תקנון המשחק");
    setFormError(null);
    const code = `NUV-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setCoupon(code);
    track("coupon_saved", { score, marketing: Boolean(fd.get("marketing")) });
  };

  const onShare = async () => {
    const text = `בניתי מגדל של ${score} נקודות במגדל נובולה. נראה אותך!`;
    track("share", { score });
    if (navigator.share) {
      try {
        await navigator.share({ title: "מגדל נובולה", text, url: location.href });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard?.writeText(`${text} ${location.href}`);
      setFlash("הקישור הועתק");
    }
  };

  return (
    <div className={teaser ? "" : "grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"}>
      <div>
        {/* HUD */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <dl className="flex gap-5">
            <div>
              <dt className="text-sm">ניקוד</dt>
              <dd className="font-display text-3xl font-black tabular-nums" aria-live="polite">
                {score}
              </dd>
            </div>
            <div>
              <dt className="text-sm">קומבו</dt>
              <dd className="font-display text-3xl font-black tabular-nums">{combo > 1 ? `×${combo}` : "–"}</dd>
            </div>
            <div>
              <dt className="text-sm">זמן</dt>
              <dd className="font-display text-3xl font-black tabular-nums">{timeLeft}</dd>
            </div>
          </dl>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPhaseBoth(phase === "paused" ? "playing" : "paused")}
              disabled={phase !== "playing" && phase !== "paused"}
              className="whitespace-nowrap rounded-full border-2 border-chocolate px-3 py-1.5 text-sm font-extrabold disabled:opacity-30 sm:px-4 sm:text-base"
            >
              {phase === "paused" ? "המשך" : "השהיה"}
            </button>
            <button
              type="button"
              aria-pressed={!muted}
              onClick={() => {
                mutedRef.current = !muted;
                setMuted(!muted);
              }}
              className="whitespace-nowrap rounded-full border-2 border-chocolate px-3 py-1.5 text-sm font-extrabold sm:px-4 sm:text-base"
            >
              {muted ? "צליל כבוי" : "צליל פועל"}
            </button>
          </div>
        </div>

        {/* Play field */}
        <div
          ref={wrapRef}
          className={`relative mx-auto aspect-[2/3] w-full overflow-hidden rounded-[2rem] bg-cloud ${teaser ? "max-h-[70svh] max-w-[24rem]" : "max-h-[78svh] max-w-[30rem]"}`}
        >
          <canvas
            ref={canvasRef}
            tabIndex={0}
            role="img"
            aria-label="שדה המשחק: כדור גלידה זז מעל המגדל. הקשה, רווח או Enter מפילים אותו."
            className="absolute inset-0 h-full w-full cursor-pointer touch-manipulation"
            onPointerDown={(e) => {
              e.preventDefault();
              drop();
            }}
          />

          {flash && (
            <p className="pointer-events-none absolute inset-x-0 top-6 text-center font-display text-3xl font-black text-cherry" role="status">
              {flash}
            </p>
          )}

          {phase === "intro" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-cream/80 p-8 text-center">
              <h2 className="text-[clamp(2.2rem,6vw,3.2rem)]">מגדל נובולה</h2>
              <p className="max-w-xs">
                כדור גלידה זז מעל הגביע. מקישים כדי להפיל אותו. מה שבולט מחוץ למגדל נמס, ופגיעה מדויקת שומרת על הגודל ומכפילה את הניקוד.
              </p>
              <p className="text-sm">מפילים בהקשה, ברווח או באנטר. להשהיה: המקש <kbd className="font-extrabold">P</kbd></p>
              <button type="button" onClick={start} className="rounded-full bg-cherry px-8 py-3 font-extrabold text-white">
                בואו נבנה
              </button>
            </div>
          )}

          {phase === "paused" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-cream/85 p-8 text-center">
              <h2 className="text-4xl">הפסקת גלידה</h2>
              <button type="button" onClick={() => setPhaseBoth("playing")} className="rounded-full bg-cherry px-8 py-3 font-extrabold text-white">
                ממשיכים
              </button>
            </div>
          )}

          {phase === "over" && (
            <div className="absolute inset-0 overflow-y-auto bg-cream/95 p-6 text-center">
              <h2 className="mt-2 text-4xl">{score} נקודות</h2>
              <p className="mt-1">
                {score < 5 ? "גם מגדל פיזה התחיל עקום." : `${ballCount} כדורים במגדל`}
              </p>

              {reward ? (
                <div className="mx-auto mt-4 max-w-xs rounded-2xl bg-mango p-4">
                  <p className="font-display text-2xl font-black">{reward.title}</p>
                  <p className="text-sm">{reward.detail}</p>
                </div>
              ) : (
                <p className="mx-auto mt-4 max-w-xs text-sm">עוד {10 - score} נקודות לתוספת חינם.{teaser ? "" : " עוד סיבוב?"}</p>
              )}

              {teaser && (
                <div className="mx-auto mt-5 max-w-xs">
                  <p className="text-sm">כאן בעמוד הבית יש סיבוב אחד. לעוד סיבובים, לשמירת הקופון ולטבלת המובילים:</p>
                  <Link href="/game" className="mt-4 inline-flex rounded-full bg-cherry px-7 py-3 font-extrabold text-white">
                    למשחק המלא
                  </Link>
                </div>
              )}

              {!teaser && reward && !coupon && (
                <form onSubmit={onCoupon} className="mx-auto mt-5 flex max-w-xs flex-col gap-3 text-start" noValidate>
                  <p className="font-extrabold">שמרי את הקופון</p>
                  <label className="flex flex-col gap-1 text-sm">
                    שם
                    <input name="name" autoComplete="given-name" className="rounded-full border-2 border-chocolate bg-white px-4 py-2" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    טלפון נייד
                    <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className="rounded-full border-2 border-chocolate bg-white px-4 py-2 text-end" />
                  </label>
                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" name="terms" className="mt-1 size-4 accent-cherry" />
                    <span>קראתי ואני מסכימה ל<a href="#" className="underline">תקנון המשחק</a></span>
                  </label>
                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" name="marketing" className="mt-1 size-4 accent-cherry" />
                    <span>אשמח לקבל עדכונים ודיוור שיווקי מנובולה</span>
                  </label>
                  {formError && (
                    <p role="alert" className="text-sm font-extrabold text-cherry">
                      {formError}
                    </p>
                  )}
                  <button type="submit" className="rounded-full bg-cherry px-6 py-3 font-extrabold text-white">
                    שליחת הקופון ב-SMS
                  </button>
                </form>
              )}

              {coupon && (
                <div className="mx-auto mt-5 max-w-xs rounded-2xl border-2 border-dashed border-chocolate p-4">
                  <p className="text-sm">הקופון שלך</p>
                  <p dir="ltr" className="font-display text-3xl font-black tracking-widest">
                    {coupon}
                  </p>
                  <p className="mt-2 text-xs">בתוקף 14 יום, קופון אחד לטלפון בשבוע. בדמו הזה לא נשלח SMS ולא נשמר שום מידע.</p>
                </div>
              )}

              {!teaser && <div className="mt-5 flex justify-center gap-3">
                <button type="button" onClick={start} className="rounded-full bg-chocolate px-6 py-3 font-extrabold text-cream">
                  עוד סיבוב
                </button>
                <button type="button" onClick={onShare} className="rounded-full border-2 border-chocolate px-6 py-3 font-extrabold">
                  שיתוף
                </button>
              </div>}
            </div>
          )}
        </div>
      </div>

      {/* Side: rewards + weekly leaderboard */}
      {!teaser && <aside className="space-y-6">
        <section className="rounded-[2rem] bg-white/70 p-6">
          <h2 className="mb-3 text-2xl">הטבות לפי ניקוד</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between gap-3"><span>10 נקודות</span><span className="font-extrabold">תוספת חינם</span></li>
            <li className="flex justify-between gap-3"><span>20 נקודות</span><span className="font-extrabold">כדור שני במתנה</span></li>
            <li className="flex justify-between gap-3"><span>30 ומעלה</span><span className="font-extrabold">טבלת המובילים</span></li>
            <li className="flex justify-between gap-3"><span>מקומות 1–3</span><span className="font-extrabold">טעימה ראשונה מהדרופ</span></li>
          </ul>
          <p className="mt-3 text-xs">כל מי שעובר את הסף מקבל, בלי הגרלה. כדור זהב שווה 5 נקודות.</p>
        </section>
        <section className="rounded-[2rem] bg-white/70 p-6">
          <h2 className="mb-3 text-2xl">המובילים השבוע</h2>
          <ol className="space-y-2 text-sm">
            {LEADERS.map((l, i) => (
              <li key={l.name} className="flex justify-between gap-3">
                <span>
                  {i + 1}. {l.name}
                </span>
                <span className="font-extrabold tabular-nums">{l.score}</span>
              </li>
            ))}
          </ol>
        </section>
        <p className="text-sm">
          לא בא לך לשחק? <a href="#" className="font-extrabold underline">הצטרפות למועדון</a> נותנת את הטבת הבסיס גם בלי משחק.
        </p>
      </aside>}
    </div>
  );
}
