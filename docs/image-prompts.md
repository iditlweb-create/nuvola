# נובולה — פרומפטים לתמונות (ChatGPT)

מעכשיו כל התמונות נוצרות בשיחה אחת ב-ChatGPT (פרומפט הסגנון נשלח פעם אחת בתחילתה), לא שיחה חדשה לכל קבוצה. הקבוצות הראשונות נוצרו עוד בשיחות נפרדות.
אחרי היצירה: המרה ל-WebP/AVIF, הסרת רקע לפי הצורך, ושמירה ב-`public/images`.

## פרומפט הסגנון של המותג (תמיד ההודעה הראשונה)

```text
Brand style for NUVOLA, a premium artisanal gelato lab. Soft diffused studio light,
warm cream background (#FFF6EA), palette of pistachio (#A8C66C), cherry (#B8234A),
mango (#FFB547), dark chocolate (#2B1A14) and cloud blue (#E9F1F7).
Playful but premium, clean composition, generous empty space, appetizing texture.
No text, no letters, no logos, no watermarks, no real brands.
--- Please keep this brand style for every image in this chat. Don't generate anything yet; just reply OK and wait for my request.
```

## לוגו — סמל (`logo-symbol`)

### 4 כיוונים

```text
Logo symbol exploration for NUVOLA (Italian for 'cloud'). Create ONE square image (1024x1024)
showing 4 different logo symbol directions arranged in a clean 2x2 grid on a plain white background,
with lots of space around each. Concept: a scoop of gelato whose shape is a soft cloud. Each symbol
must be flat vector style, maximum two colors from the brand palette (pistachio #A8C66C, cherry #B8234A,
mango #FFB547, dark chocolate #2B1A14), simple bold geometric shapes, no gradients, no shadows,
readable at favicon size. Symbol only: absolutely NO letters, NO text, NO numbers, NO wordmark.
Directions: 1) cloud-shaped scoop sitting on a cone, 2) a single scoop where the top silhouette is
cloud bumps, minimal monoline-free solid shape, 3) cloud scoop with a small melting drip,
4) abstract badge: circle containing a cloud-scoop negative space.
```

### חידוד הכיוון שנבחר (3 + גביע)

```text
I choose direction 3 (the mango cloud scoop with the melting drip), but add a cone under it.
Refine it into ONE final logo symbol, centered on a plain pure white background, 1024x1024.
Flat vector style, exactly two colors: mango (#FFB547) for the cloud-shaped scoop with the small drip,
dark chocolate (#2B1A14) for a simple cone (a clean triangle, minimal or no waffle lines so it stays
readable at favicon size). The scoop's top silhouette is clearly soft cloud bumps; the drip falls over
the cone edge. Bold simple shapes, no gradients, no shadows, no outlines, no texture.
Symbol only: absolutely NO letters, NO text, NO wordmark.
```

תוצרי הלוגו (נבנו מהסמל המאושר, `assets-src/logo-symbol-chatgpt.png`):
`public/brand/logo-symbol*.svg`, `public/brand/logo-horizontal*.svg` (השם בלאון Heavy כקווי מתאר), `src/app/icon.svg`, `src/app/apple-icon.png`.

## הירו (`hero-cloud-scoop`) — שיחה חדשה, אחרי פרומפט הסגנון

### גרסה A — צילומית

```text
Hero image, version A. Wide landscape 16:9 (target 2400x1350). A single generous scoop of pistachio
gelato (#A8C66C, visible crushed pistachio pieces, creamy ridged texture), no cone, floating weightlessly
among soft fluffy white clouds, in a pale cloud-blue sky (#E9F1F7) fading to warm cream (#FFF6EA) at the
bottom. Photorealistic food photography, soft diffused light, gentle shadow on the clouds. Composition for
a right-to-left website: the scoop and main clouds sit in the LEFT 45% of the frame; the RIGHT half is
calm, mostly empty sky for a headline. A few tiny pistachio crumbs floating. No text, no letters, no logos.
```

### גרסה B — תלת־ממד חלומי

```text
Hero image, version B (keep version A as is, this is a separate alternative). Wide landscape 16:9
(target 2400x1350). A more playful, dreamy, slightly surreal studio scene: a pistachio gelato scoop
(#A8C66C) whose top melts softly into a cloud, as if the gelato itself is becoming a cloud, resting on a
small sculptural plinth of soft cloud. Smaller pastel clouds float around, a single glossy cherry
(#B8234A) and a slice of mango (#FFB547) floating as accents. Background: smooth seamless gradient from
cloud blue (#E9F1F7) at the top to warm cream (#FFF6EA) at the bottom. High-end 3D render look, soft
matte materials, soft diffused light. Composition for a right-to-left website: the subject sits in the
LEFT 45% of the frame; the RIGHT half is calm and empty for a headline. No text, no letters, no logos.
```

נבחרה גרסה B. `og-image` נחתך מאותה תמונה (1200×630) במקום יצירה נפרדת, כדי שהשיתוף ייראה כמו ההירו.

## טעמים (`flavor-*`, 8 תמונות) — שיחה חדשה, אחרי פרומפט הסגנון

### תמונה 1 — מגדירה את הזווית לכל הסדרה

```text
Flavor series, image 1 of 8: PISTACHIO. Portrait 4:5. One single perfect round scoop of Sicilian
pistachio gelato (soft green #A8C66C, creamy ridges from the scoop, a few crushed pistachio pieces on
top), no cone, no bowl, no spoon. Photorealistic premium food photography, soft diffused studio light
from the upper left, very subtle contact shadow under the scoop. Camera at a slight 15-degree high angle,
scoop centered, filling about 60% of the frame width. TRANSPARENT background (PNG with alpha), nothing
else in the frame. This exact angle, lighting, scale and framing will be reused for all 8 flavors, so
keep it simple and repeatable. No text.
```

### תמונות 2–8 — אותה תבנית, משתנה רק הטעם

```text
Image N of 8: <FLAVOR>. Exactly the same angle, lighting, scale, framing and transparent background as
image 1. One single round scoop of <description>. No cone, no bowl. Transparent background (PNG with
alpha). No text.
```

| # | קובץ | טעם | תיאור לפרומפט |
| --- | --- | --- | --- |
| 1 | `flavor-pistachio` | פיסטוק סיציליאני | Sicilian pistachio, soft green #A8C66C, crushed pistachio on top |
| 2 | `flavor-raspberry` | פטל ושמנת | raspberry cream, deep raspberry red #B8234A, fresh raspberry pieces |
| 3 | `flavor-mango` | מנגו וליים | mango sorbet, vivid mango #FFB547, a thin curl of lime zest |
| 4 | `flavor-chocolate` | שוקולד מריר 70% | dark chocolate #2B1A14, glossy, a few dark chocolate shavings |
| 5 | `flavor-vanilla` | וניל מדגסקר | warm ivory vanilla, visible black vanilla bean specks |
| 6 | `flavor-hazelnut` | אגוזי לוז | hazelnut praline, warm caramel brown, chopped toasted hazelnuts |
| 7 | `flavor-lemon` | לימון ובזיליקום | pale lemon sorbet, a tiny basil leaf on top |
| 8 | `flavor-mint` | נענע ושבבים | fresh mint, very pale green, dark chocolate chips |

## רכיבים (`ingredient-*`, 4 תמונות) — שיחה חדשה, אחרי פרומפט הסגנון

### תמונה 1 — מגדירה את הזווית

```text
Ingredient series, image 1 of 4: PISTACHIOS. Square 1:1. A small natural cluster of shelled Sicilian
pistachios, a few still half in their shells, some crushed pieces, vivid green kernels. Photorealistic
premium food photography, soft diffused studio light from the upper left, very subtle contact shadow.
Shot from a slight 20-degree high angle, cluster centered, filling about 60% of the frame. TRANSPARENT
background (PNG with alpha), nothing else in the frame. These will float around a gelato scoop on the
website. The same angle, lighting and scale will be reused for all 4 ingredients. No text.
```

### תמונות 2–4 — אותה תבנית

```text
Image N of 4: <INGREDIENT>. Exactly the same angle, lighting, scale and transparent background as
image 1. <description>. Transparent background (PNG with alpha). No text.
```

| # | קובץ | תיאור לפרומפט |
| --- | --- | --- |
| 1 | `ingredient-pistachio` | cluster of shelled pistachios, some crushed |
| 2 | `ingredient-mint` | a small sprig of fresh mint, 4–5 vivid green leaves |
| 3 | `ingredient-mango` | one juicy ripe mango slice, glossy golden-orange flesh |
| 4 | `ingredient-chocolate` | a small pile of dark chocolate chips and two broken shards |

## קופסת הדרופ (`drop-box`) — שיחה חדשה, אחרי פרומפט הסגנון

### גרסה A

```text
Monthly drop box, version A. Square 1:1. A premium designed gelato pint box / tub for a limited monthly
flavor drop, lid lifted and tilted open, revealing four small scoops of different flavors inside
(pistachio, raspberry, mango, chocolate) arranged neatly. The box itself is matte cream with bold
abstract color blocks in pistachio, cherry and mango, completely free of any text, letters or logos.
A soft cloud of cold mist spills from the opening. Placed on a seamless cloud-blue (#E9F1F7) to cream
gradient background, centered with generous empty space around. Photorealistic premium product
photography, soft diffused light. No text, no letters, no logos.
```

### גרסה B

```text
Monthly drop box, version B (a separate alternative, keep A). Square 1:1. A more playful, graphic take:
a round cylindrical gelato tub in solid cherry red (#B8234A) with a pistachio-green lid floating just
above it, as if popping open; from inside, four mini scoops in pistachio, raspberry, mango and dark
chocolate rise up slightly like they are floating out, with a few soft little clouds around. No text,
letters or logos anywhere on the tub. Clean seamless warm cream (#FFF6EA) background, subject centered
with generous empty space. High-end soft 3D render look, matte materials, soft diffused light.
No text, no letters, no logos.
```

נבחרה גרסה A.

## עגלת אירועים (`events-cart`) — שיחה חדשה, אחרי פרומפט הסגנון

### גרסה A

```text
Events cart, version A. Landscape 3:2 (target 2000x1333). A charming pastel gelato cart at a garden
wedding at golden-hour sunset: a vintage-style cart painted in soft pistachio green (#A8C66C) with a
cream and cherry-red striped canopy, a glass display showing colorful gelato tubs (pistachio, raspberry,
mango, chocolate), a few waffle cones in a holder. Background: softly blurred garden with string lights,
white flowers and long tables, warm bokeh. No people, or at most very distant out-of-focus silhouettes
with no faces. Absolutely no text, signs, letters or logos on the cart or canopy. The cart sits slightly
right of center; the left third is calmer for headline space. Photorealistic premium lifestyle
photography. No text, no letters, no logos.
```

### גרסה B

```text
Events cart, version B (a separate alternative, keep A). Landscape 3:2 (target 2000x1333). A modern,
minimal gelato cart at an elegant outdoor garden event at sunset: a sleek rounded cart in warm cream
with a pistachio-green countertop and a soft cloud-shaped white canopy above, glass display with pastel
gelato (pistachio, raspberry, mango, chocolate), a stack of cones. Around it soft pastel balloons in
cloud blue and mango, softly blurred garden and fairy lights in the background, dreamy warm bokeh.
No people. Absolutely no text, signs, letters or logos anywhere. The cart sits slightly right of center;
the left third is calm for headline space. Photorealistic premium lifestyle photography.
No text, no letters, no logos.
```

נבחרה גרסה A.

## מעבדה (`lab-*`, 3 תמונות) — שיחה חדשה, אחרי פרומפט הסגנון

### תמונה 1 — מגדירה תאורה וגוון

```text
Lab series, image 1 of 3: MILK. Landscape 3:2 (target 1600x1067). Inside a bright, clean artisanal
gelato lab: a stream of fresh whole milk pouring from a simple glass bottle into a gleaming
stainless-steel pot, a gentle splash, soft steam. Only hands and forearms visible (wearing a cream apron
sleeve), no face, no full person. Warm cream and cloud-blue tones, pale tiled wall softly blurred
behind, soft diffused window light. Photorealistic editorial food photography, shallow depth of field,
generous empty space. The same lighting, color grade and lens will be reused for all 3 lab images.
Absolutely no text, labels, letters or logos on bottles, pots or anywhere. No text.
```

### תמונות 2–3 — אותה תבנית

```text
Image N of 3: <STEP>. Exactly the same lighting, color grade, lens and lab setting as image 1. Only hands
visible, no faces. <description>. Absolutely no text, labels, letters or logos. No text.
```

| # | קובץ | תיאור לפרומפט |
| --- | --- | --- |
| 1 | `lab-milk` | milk pouring from a glass bottle into a steel pot |
| 2 | `lab-pistachio` | hands grinding roasted pistachios in a stone mortar, green paste and crumbs |
| 3 | `lab-vitrine` | hands smoothing a fresh gelato tray into a glass display case with pastel tubs |

## סניפים (`branch-*`, 3 תמונות) — באותה שיחה של המעבדה (כלל השיחה האחת)

### תמונה 1 — מגדירה עדשה ותאורה

```text
Next group, same brand style as this chat. Branch series, image 1 of 3: TEL AVIV (Florentin).
Landscape 3:2 (target 1600x1067). The storefront of a small boutique gelato shop in a Bauhaus-inspired
white plaster building with rounded balcony corners, typical of Tel Aviv: a pistachio-green (#A8C66C)
painted shopfront with large glass windows, a cream awning, a few potted plants and a small bench, soft
late-afternoon light. The shop sign above the door is completely BLANK (an empty cream panel). No people.
Absolutely no text, letters, numbers, logos or signage anywhere, including street signs. Photorealistic
architectural lifestyle photography, slightly frontal view, generous empty space. The same lens, light
and color grade will be reused for all 3 branches. No text.
```

### תמונות 2–3 — אותה תבנית

```text
Image N of 3: <CITY>. Exactly the same lens, light, color grade and framing as image 1. <description>.
The shop sign is completely BLANK. No people. Absolutely no text, letters, numbers, logos or signage
anywhere. No text.
```

| # | קובץ | תיאור לפרומפט |
| --- | --- | --- |
| 1 | `branch-tel-aviv` | Bauhaus white plaster building, pistachio-green shopfront |
| 2 | `branch-haifa` | German Colony: Templer stone house, red-tiled roof, cherry-red shutters, palm |
| 3 | `branch-jerusalem` | Nachlaot: golden Jerusalem stone alley, arched doorway, mango-yellow door, bougainvillea |

## חלקי המשחק (`game-*`) — באותה שיחה

גיליון ספרייטים אחד שנחתך אוטומטית ל-9 קבצים (512×512, רקע שקוף).

```text
Last group, for a browser game (stack gelato scoops on a cone). This one is NOT photographic: a game
sprite sheet in a flat, uniform vector illustration style, same brand palette. Square 1:1, TRANSPARENT
background (PNG with alpha). A clean 3x3 grid of 9 separate game pieces, each centered in its own cell
with wide empty transparent space between them so they can be cut apart, all drawn at the same scale and
with the same simple style (flat fills, one soft highlight shape, no outlines, no gradients, no shadows,
no texture). Row 1: a round gelato ball in pistachio green (#A8C66C), a ball in raspberry red (#B8234A),
a ball in mango (#FFB547). Row 2: a ball in dark chocolate (#2B1A14), a ball in vanilla cream, a ball in
pale mint green. Row 3: a special shiny golden ball with a small sparkle, a simple waffle cone in warm
caramel with a few crosshatch lines, a soft fluffy white cloud. Each ball has a slightly wavy scooped
bottom edge so it reads as gelato. Absolutely no text, letters, numbers or logos. No text.
```

קבצים: `game-ball-pistachio`, `game-ball-raspberry`, `game-ball-mango`, `game-ball-chocolate`,
`game-ball-vanilla`, `game-ball-mint`, `game-ball-gold`, `game-cone`, `game-cloud`.

## מעבדה — תמונה רביעית: הקצפה (`lab-whip`) — באותה שיחה

```text
One more lab image, matching the 3 lab images earlier in this chat (MILK, PISTACHIO, VITRINE). Lab
image: WHIPPING. Landscape 3:2 (target 1600x1067). Exactly the same lighting, color grade, lens and
bright lab setting as those images. Only hands visible, no faces. Inside a stainless-steel gelato batch
freezer / mixing bowl, a pale pistachio-green gelato base is being slowly churned and whipped into soft,
airy, cloud-like ribbons and peaks by the machine paddle; one hand holds a spatula at the edge. Creamy,
fluffy texture, a few fine pistachio crumbs on the counter. Absolutely no text, labels, buttons with
markings, letters or logos. No text.
```

## סרטון הירו בגלילה (Magnific, Seedance 2.5) — מתמונת ההירו B

תמונת ההתחלה: `assets-src/hero-cloud-scoop-chatgpt.png`. 8 שניות, 16:9, 1080p, מצלמה סטטית.
הסרטון נשמר ב-`assets-src/video/hero-magnific.mp4` ונחתך לפריימים ב-`public/hero-seq` (96 למחשב, 64 לנייד),
שמנוגנים על canvas לפי הגלילה (`src/components/HeroSequence.tsx`).

```text
Locked-off static camera, no camera movement, no zoom, no cuts. The exact scene of the start frame: a pistachio
gelato scoop melting into a soft cloud, resting on a cloud plinth, left side of the frame, against a smooth
cloud-blue to cream gradient sky. Over the whole clip, in one slow, smooth, continuous and steady motion: all the
small floating elements around the scoop gently drift outward and away from it, as if the scene is slowly opening
up like an exploded view. The whole pistachios, the crushed pistachio crumbs, the glossy cherry and the
peach/mango slice each float farther out from the scoop, slowly rotating a little, spreading wider and wider until
the end. The scoop itself stays in place and keeps its shape, with only a very subtle soft melt. In the
background, the soft white clouds drift slowly and steadily from right to left across the frame, the farther
clouds moving slower than the nearer ones (parallax). Motion is linear and even from the first frame to the last,
no sudden moves, no bounce, no reversal, so the video can be scrubbed by page scroll. Keep the right half of the
frame calm and mostly empty sky. Soft diffused light, high-end 3D render look, matte materials. No text, no
letters, no logos, no people.
```

### גרסה 2: שכבות (בקשת עידית — עננים בלופ בלי קשר לגלילה)

1. ב-ChatGPT (אותה שיחה, עם תמונת ההירו מצורפת) — הירו בלי עננים ברקע:

```text
Edit the attached hero image (keep everything else identical in style, composition, 16:9 framing and lighting):
REMOVE all the separate floating background clouds in the sky (the small white clouds around and behind, top-left,
right side and far background). KEEP the pistachio gelato scoop, the cloud plinth it rests on directly underneath
it, the cherry, the mango slice, the whole pistachios and all the pistachio crumbs exactly where they are. The sky
must become a clean, smooth, empty gradient from cloud blue (#E9F1F7) at the top to warm cream (#FFF6EA) at the
bottom, with no clouds at all. No text, no letters, no logos.
```

2. ב-ChatGPT — גיליון עננים לשכבת הלופ (`hero-cloud-*`):

```text
Now a cloud sprite sheet for the same hero: exactly the same soft, fluffy, matte white 3D-render cloud style as the
cloud plinth in the hero image (soft diffused light, very subtle warm shading underneath). Wide landscape 16:9,
TRANSPARENT background (PNG with alpha). Five separate clouds of different sizes and shapes (two large wide ones,
two medium, one small), arranged in a loose grid with wide empty transparent space between them so they can be cut
apart, none touching or overlapping each other or the edges. Each cloud is a complete, closed shape (no cropped
edges). No sky, no background, no shadows on the ground. No text, no letters, no logos.
```

3. ב-Magnific (Seedance 2.5, 8 שניות, 1080p, מצלמה סטטית) מהתמונה בלי העננים, ואז הסרת רקע לסרטון (VP9 עם שקיפות):

```text
Locked-off static camera, no camera movement, no zoom, no cuts. The exact scene of the start frame: a pistachio
gelato scoop melting softly, resting on a fluffy cloud plinth, on the left side of the frame, against a perfectly
clean, empty, smooth cloud-blue to cream gradient background. The background must stay completely empty and
unchanged for the whole clip: no clouds, no new objects, no particles in the sky. Over the whole clip, in one slow,
smooth, continuous and steady motion, all the small floating elements around the scoop gently drift outward and
away from it, as if the scene slowly opens up like an exploded view: the whole pistachios, the crushed pistachio
crumbs, the glossy cherry and the peach slice each float farther out from the scoop, rotating a little, spreading
wider and wider until the end, staying inside the frame. The scoop and its cloud plinth stay in place and keep their
shape, with only a very subtle soft melt. Motion is linear and even from the first frame to the last, no sudden
moves, no bounce, no reversal, so the video can be scrubbed by page scroll. Soft diffused light, high-end 3D render
look, matte materials. No text, no letters, no logos, no people.
```
