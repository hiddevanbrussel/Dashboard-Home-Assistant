# ASSETS

## Energie: isometrisch huis (`public/energy/house/`)

### Herkomst
- **Wat:** een AI-gegenereerde render van een huis als miniatuur-diorama. Hidde van Brussel maakte hem met ChatGPT (OpenAI) op 23-10-2026.
  - De datum blijkt uit de bronnamen: "ChatGPT Image Oct 23, 2026, 03_30_46 PM-1.png" t/m "…03_31_15 PM-6.png".
  - Hidde koos die dag zelf voor deze render ("gebruik mijn eigen ChatGPT-huis", via de CEO).
- **Bron:** 6 PNG's van 1672×941, één per variant. Ze staan niet in de repo.
- **Het ChatGPT-model of de -versie:** onbekend. Hidde (29-10-2026): "Model weet ik niet meer, noteer onbekend".
- **Hiddes letterlijke prompt:** zie [Prompt](#prompt) hieronder (bron: `PROMPT-hidde.txt`). De omschrijving onder [Omschrijving](#omschrijving) is door de designer geschreven aan de hand van het beeld; het is niet Hiddes prompt.
- **Hoe de 6 varianten tot stand kwamen:** Hidde (29-10-2026): "Varianten zijn bewerkingen van hetzelfde beeld". De varianten zijn niet pixelgelijk; de kleine verschuivingen zijn per variant gemeten (`dx`/`dy` in `ankers.json`).
- **Bewerking door het team:**
  - alpha-uitsnede met kleur-ontmenging aan de rand;
  - een zachte fade op de afgesneden sokkelpunt;
  - één gedeelde uitsnede (bronpx 224,32 → 1424,941);
  - geschaald naar 960×727;
  - export naar WebP q80 en AVIF q50.

  Verder zijn er geen inhoudelijke wijzigingen aan het beeld gedaan.

### Prompt
Letterlijk van Hidde (`PROMPT-hidde.txt`):

```text
Create a consistent set of six high-quality isometric architectural illustrations for a modern smart-home energy dashboard.

BASE SCENE:
A modern two-story detached suburban house, shown from an elevated three-quarter isometric view, with the front entrance and garage on the right and a large window facade on the left. White cream stucco exterior walls, charcoal-gray pitched tiled roof, small square chimney, warm wooden front door, dark gray garage door, large windows with dark frames and visible modern living-room furniture. A small landscaped rectangular plot with green grass, two leafy trees, rounded shrubs, white hydrangeas, ornamental grasses, flower beds, gravel strips, paved driveway and entrance steps.

ENERGY SYSTEM:
Exactly six blue photovoltaic panels arranged in two rows of three on the visible roof slope. A compact light-gray solar inverter mounted near the garage wall, with a larger white home battery directly below it and discreet connecting conduits. No branding.

VISUAL STYLE:
Premium realistic architectural 3D product rendering, clean isometric diorama, detailed but uncluttered, crisp edges, subtle natural materials, balanced lighting, centered composition. Landscape 16:9, minimum width 1536 pixels. No text, no logos, no labels, no border, no horizon, no green energy-flow lines. Plain uniform background without a decorative shadow rim.

CREATE THESE SIX VARIANTS:
1. solar-day-light: solar panels, inverter and battery visible. Sunny midday, soft daylight, solid very light lavender-gray background.
2. solar-day-dark: identical scene and camera, same sunny daylight on the house, solid deep dark blue-gray background.
3. solar-night-light: identical scene and camera, dusk/night lighting, warm glowing windows and subtle garden lighting, very dark solar panels, solid very light lavender-gray background.
4. solar-night-dark: identical night scene, solid deep dark blue-gray background.
5. house-day-light: identical to variant 1, but remove all six solar panels, inverter, battery and conduits. Replace the exposed roof area with matching charcoal roof tiles.
6. house-day-dark: identical to variant 5, but with the deep dark blue-gray background.

CRITICAL CONSISTENCY:
Use variant 1 as the immutable master reference. Keep the exact same camera angle, scale, crop, house architecture, window layout, roof shape, chimney, tree positions, landscaping, driveway, and object placement across all six images. Only modify the requested lighting, background or energy-system visibility. Produce six separate image files, not one collage.
```

**Beeld wijkt af van prompt.** Geteld op de bron-PNG's: 8 zonnepanelen in 2 rijen van 4, in alle 4 varianten met panelen. De prompt vraagt "Exactly six blue photovoltaic panels arranged in two rows of three". Kleinere afwijkingen: de omvormer is wit in plaats van lichtgrijs, en de thuisbatterij bestaat uit 2 gestapelde modules waar de prompt om een "larger white home battery" vraagt. De varianten zonder panelen heten in de prompt `house-day-light`/`house-day-dark`, in de bundel `huis-zonder-*`. De render is ongewijzigd gebruikt; de omschrijving en `ankers.json` volgen het beeld.

### Omschrijving
Een semi-fotorealistische 3D-render van een modern Nederlands vrijstaand huis op een lichte sokkel, isometrisch van schuin boven gezien.
- **Huis:** witte stucgevels, antraciet dakpannen met schoorsteen, grote donkere kozijnen met warm verlichte ramen, een houten voordeur onder een luifel, een antraciet garagedeur en een oprit van lichte tegels.
- **Installatie:** op het dak 8 blauwe zonnepanelen in 2 rijen van 4 (beeld wijkt af van prompt, die vraagt 6 in 2 rijen van 3). Naast de voordeur hangt een witte omvormer met daaronder een thuisbatterij (2 gestapelde modules).
- **Tuin:** gras, grind, struiken, siergras, hortensia en twee kleine bomen.
- **Stijl:** zacht studiolicht, geen tekst, geen logo's, geen line-art en geen pastel.
- **Varianten:**
  - dag: panelen helder blauw;
  - nacht: panelen bijna zwart, warmere gevelgloed en tuinspotjes;
  - zonder: geen panelen, geen omvormer en geen batterij.

  Elke variant bestaat op een lichte en op een donkere achtergrond.

### Rechten en licentie
Dit is voorzichtig advies, geen juridisch oordeel.
- **Wat OpenAI zegt:** volgens de OpenAI EU Terms of Use (https://openai.com/policies/eu-terms-of-use/, versie 16-01-2026) draagt OpenAI zijn rechten op de output over aan de gebruiker, "to the extent permitted by applicable law" en "if any".
  - OpenAI garandeert niet dat er rechten zijn.
  - Vergelijkbare output kan ook bij anderen ontstaan.
- **Auteursrecht is onzeker.** In de EU geldt de eis "eigen intellectuele schepping van een mens", en het US Copyright Office stelt dat prompts alleen meestal onvoldoende zijn. Puur gegenereerd beeld is daardoor mogelijk niet beschermd.
- **Daarom vallen deze afbeeldingen niet onder de GPL-3.0 van de code.** Een licentie op een recht dat mogelijk niet bestaat, zegt weinig.
- **Gebruik:** Hidde stelt de render beschikbaar voor gebruik in dit project.
- **Licentie voor derden** (forks, hergebruik buiten dit project): CC0. Hidde (29-10-2026): "Afbeelding vrij te gebruiken, CC0". *Toelichting team, geen uitspraak van Hidde:* omdat er mogelijk geen auteursrecht op rust, is CC0 vooral een verklaring dat Hidde er geen rechten op claimt.
- **Akkoord voor een release:** gegeven. Hidde (29-10-2026): "Ja, akkoord met onzekere rechten" (advies v3.4 §2).
- **AI-gegenereerd:** dit beeld is gemaakt met AI en wordt niet als handgemaakt gepresenteerd.
- **Merken:** het beeld bevat geen logo's of merknamen en is niet bedoeld als afbeelding van een bestaand product. Op de omvormer staat een onleesbaar pseudo-tekstje van ±2 px op assetmaat.

### Bestanden (12 assets + ankers)
Alle assets zijn 960×727 met transparantie.

| Bestand | Variant | WebP q80 | AVIF q50 |
|---|---|---|---|
| `huis-dag-licht` | dag, licht thema | 141,0 KB | 63,6 KB |
| `huis-dag-donker` | dag, donker thema | 113,1 KB | 54,2 KB |
| `huis-nacht-licht` | nacht, licht thema | 106,0 KB | 51,9 KB |
| `huis-nacht-donker` | nacht, donker thema | 130,7 KB | 60,6 KB |
| `huis-zonder-licht` | zonder zon en batterij, licht thema | 122,3 KB | 56,2 KB |
| `huis-zonder-donker` | zonder zon en batterij, donker thema | 105,2 KB | 50,6 KB |
| **Totaal** | | **718,3 KB** | **337,1 KB** |

- **Gebruik:** per scherm wordt één variant geladen, via `<picture>` met AVIF eerst. De variant volgt het thema, dag of nacht (zon op of onder) en of er zon en batterij gekoppeld zijn.
- **`ankers.json`:** de posities voor de live-lagen en labels, in procenten van de asset (dezelfde uitsnede als de assets). Per variant bevat het:
  - de punten `zon_panelen`, `omvormer_kastje`, `batterij`, `net_voordeur` en `huis`, elk met `aanwezig`, `pct`, `bronpx` en `dx`/`dy`;
  - de polygonen `panelen`, `mint_lijn_dag`, `mint_lijn_nacht` en `batterij_led`;
  - een regel over de batterij.

  In `zonder-*` zijn zon, omvormer en batterij `aanwezig: false` en vervalt het batterijlabel.
- **Integriteit:** de SHA256 van alle 13 bestanden staat in `SHA256SUMS` (paden `public/energy/house/…`). Controle vanuit de map boven `public/`: `sha256sum -c SHA256SUMS` (29-10-2026: 13× OK). `SHA256SUMS` komt mee in de repo. Hidde (29-10-2026): "SHA256SUMS mag in de repo".
