# Changelog

## 0.4.52

- Trash card: slightly larger next-collection title; move waste-type chip toward the bottom of the card

## 0.4.51

- Soft UI click sounds on primary controls (climate temp, music play/pause/skip, light toggle, vacuum start) with Appearance toggle (on by default), throttle, and tab-visibility guard

## 0.4.50

- Trash card: replace GFT / Restafval / PMD widget assets (background, person+container, icon) with higher-res cutouts; cache-bust asset URLs
- Trash card: move edit (⋮) button to the top-right corner in dashboard edit mode, aligned with other floating cards

## 0.4.48

- Trash card: background, person art, icon, and accent now follow the resolved waste type (GFT / Restafval / PMD) immediately when the HA entity or demo theme changes; prefer specific fraction tokens over generic “waste” entity ids

## 0.4.47

- New **Trash / waste collection** floating card (`trash_card`): next pickup day + waste type (GFT / Restafval / PMD) with themed illustrations; bind HA sensors (Afvalwijzer-style or separate type/date); demo preview without HA; resizable; NL/EN

## 0.4.46

- Team Tracker match card: center team names under logos; edit toggles for team names, form (W/D/L), and progress bar (`show_team_names`, `show_form`, `show_progress`)

## 0.4.45

- Team Tracker PRE card: large **VS** between teams, soft blue **AANKOMEND** / UPCOMING pill, kickoff as date then time on one line (e.g. `4 oktober 2026 20:45`)

## 0.4.44

- Team Tracker match card: vertically center teams + kickoff time/date for upcoming (PRE) matches so content is not stuck at the top

## 0.4.43

- Team Tracker match card: quieter light layout — plain white surface, thin border, logos + centered score, muted form/record line, soft LIVE pill, thin progress bar (no pitch fade or watermark logos)

## 0.4.40

- Energy dashboard: new **Metric / Waarde** floating text (`energy_metric`) — small title above, large value + unit below (Opwek / Net / Kosten style); freely placeable on the energy board with optional HA sensor or manual value
- Energy dashboard: full-page floating board so cards can be dragged across the viewport (from #188)

## 0.4.39

- Energy dashboard: always force bundled vector light/dark illustrations (ignore patio / custom / global wallpaper URLs); clear stored energy backgrounds on API load; soften bottom fade; stronger cache-bust

## 0.4.37

- Energy dashboard: stop persisted/stale light/dark background URLs from replacing the current bundled art after first load; bump PNG cache-bust; clear legacy backgrounds on API load; remove leftover `house_cloudy_day.png`

## 0.4.36

- Energy dashboard: fresh blank canvas (remove fixed overview/stats); add Pills, Text, and Nuts cards freely over the light/dark hero art
- Nuts card: remove glow/shadow around the icon
- Remove unused legacy photoreal energy house image assets


## 0.4.35

- Energy dashboard: full-viewport light/dark illustrations (behind sidebar + topbar) with a soft bottom fade only (no side washes); show the full hero art (no upper crop), cache-bust bundled PNGs, and ignore legacy photoreal house paths as page backgrounds

## 0.4.34

- Nuts card: remove week/month switch from the live card; period stays editable in properties only

## 0.4.31

- Energy dashboard: show light/dark hero illustrations with a soft gradient fade (not full-page wallpaper); fix near-opaque theme wash that hid the art
- Smart stack: toggle automatic swipe on/off; when off, swipe the stack manually

## 0.4.30

- Energy dashboard: page-wide light/dark background illustrations with a soft theme gradient; floating cards still placeable

## 0.4.29

- Nuts card: choose weekly or monthly overview (chart + period trend); default remains weekly
- Nuts card: week/month switch on the live card (persists); edit dialog control kept in sync

## 0.4.28

- Smart stack: nested media card now fills the stack frame size (width + height)

## 0.4.27

- Calendar card: horizontal mockup layout (large date + event list with overflow), shared card radius, still resizable
- Smart stack: smoother slide crossfade (soft fade/slide instead of hard overflow cut)

## 0.4.26

- Media card: show the player name on the card (custom title, otherwise HA friendly name)

## 0.4.25

- Smart stack: on the live dashboard, show only the rotating card (no stack title, slide counter, or dots)

## 0.4.24

- Smart stack (slimme stapel): floating slideshow card that cycles through nested existing cards with configurable interval

## 0.4.23

- Nuts card: denser layout at 250×250 (smaller value, reserved chart space); min size 250×250

## 0.4.22

- Nuts card: proper light and dark theme styling (glass surfaces, text, trend pill, chart grid)

## 0.4.21

- Nuts card: redesigned to weekly Verbruik/Opbrengst mockup (accent styles, today value, month trend, bar chart); re-enabled in add-tile picker

## 0.4.20

- Climate card 2 compact mode: restore edit (⋮) control so entity, display mode, and title can be changed in dashboard edit mode

## 0.4.19

- Climate card 2 compact mode: 250×250 mockup layout, clearer status line / stepper contrast, softer border and aligned radii

## 0.4.18

- Climate card 2: choose display style in the edit dialog — standard (gauge), compact, or graph (today's temperature history)

## 0.4.17

- Screensaver: honor Docker `PEXELS_API_KEY` without a browser-stored key; enabling Pexels selects it as media source when no custom image is set
- Vacuum card 2: show battery % from more attributes and sibling `sensor.*_battery` entities (not only the Lucide placeholder icon)

## 0.4.16

- Soft onboarding works on first run for HA add-on and Docker: no auto-created empty Home dashboard that skipped the wizard; pristine Home/Thuis still counts as needing onboarding
- Add-on docs clarify Supervisor auto-link inside soft onboarding; Docker connect keeps LAN discovery
- Vacuum card 2: always show fan modes while resizing, real status line, corner radius aligned with other floating cards

## 0.4.15

- Soft LAN discovery + log in with Home Assistant (IndieAuth) for self-hosted installs; Settings → Connection auto-scans
- Keep OAuth connections alive via refresh tokens when a long-lived token cannot be created
- Vacuum card 2 restyle (battery / status / Eco·Standard·Turbo / robot art)
- Faster Docker CI on `main` (amd64-only; ARM builds on version tags)

## 0.4.14

- Fix Ingress-only blank page (`Connection closed`): Next splits Flight `T` rows across multiple `self.__next_f.push` chunks (length header in one script, body in the next). Per-chunk rewrite never updated the length. Now concatenate Flight pushes, rewrite length-aware, emit a single push.
- Explains why direct port 3000 worked (no body rewrite) while HA menu/Ingress failed

## 0.4.13

- Fix RSC `Connection closed` under Ingress: path rewrite expanded Flight `T` rows without updating hex byte-lengths, so `createFromReadableStream` saw an incomplete payload when the document stream closed
  - Flight (`text/x-component`) and HTML-embedded `self.__next_f.push` payloads are rewritten length-aware
  - Disable `ingress_stream` (proxy already buffers full responses)

## 0.4.12

- Broader Ingress audit after image/basePath work:
  - Settings: `/family` and `/energy` use `next/link` (raw `<a>` escaped the iframe)
  - Music/camera/energy-monitor/screensaver images use `withBasePath`
  - Wake-word model URLs use `withBasePath`
  - Dynamic `app/manifest.ts` with prefixed `start_url` / icons (removed static `public/manifest.json`)
  - Proxy also rewrites `/uploads/`, `/wake-word/`, static image hrefs/srcs, CSS `url(...)`, and `poster=`
  - Set-Cookie `Path` scoped to `X-Ingress-Path` so cookies do not attach to HA Core

## 0.4.11

- Fix client-router 404: bare `/__ha_ingress__` (Next `basePath`) must rewrite to `X-Ingress-Path` **without** a trailing slash
- Only exact root `href`/`src` keep a trailing slash (HA route matcher)
- Line-buffer ingress-proxy logs in Docker so request traffic is visible

## 0.4.10

- Fix Ingress `/api/*` colliding with Home Assistant Core: unprefixed `/api/...` and `/manifest.json` were resolved on the HA host (404)
- BasePathScript detects `/api/hassio_ingress/<token>` from `location.pathname` so fetch/XHR stay inside the iframe
- Metadata (manifest, PWA icons) uses `withBasePath`
- Proxy also rewrites stray absolute `/api`, `/_next`, `/manifest.json` hrefs/srcs; broader Docker IP allowlist; request arrival logs

## 0.4.9

- Fix Ingress 404: remove Next `trailingSlash` (it 308-looped `/__ha_ingress__/` ↔ `/__ha_ingress__` under the proxy)
- Proxy root maps to `/__ha_ingress__` (no slash); body rewrite still emits `X-Ingress-Path/` for HA's route matcher
- Strip upstream `http://127.0.0.1:3001` from `Location` headers so redirects stay inside Ingress

## 0.4.8

- Fix HA Ingress 404 on bare `/api/hassio_ingress/<token>` (no trailing slash)
- Enable `trailingSlash` for the addon Next.js build so root links end with `/`
- Proxy rewrite always maps `/__ha_ingress__` → `<X-Ingress-Path>/`

## 0.4.7

- Fix Ingress root proxy path: map `/` → `/__ha_ingress__` (no trailing slash) to avoid Next.js 308 leaking out of the iframe
- Log each ingress request (status, bytes, `X-Ingress-Path`) for easier debugging

## 0.4.6

- Fix RSC `Connection closed` under Ingress: replace nginx `sub_filter` with a Node proxy that buffers and rewrites `/__ha_ingress__`
- nginx `sub_filter` breaks Next.js App Router streaming (`createFromReadableStream`)

## 0.4.5

- Fix Ingress 502 Bad Gateway: stop sending `Connection: close` to Next.js with upstream keepalive
- Larger proxy buffers for basePath body rewrite on JS/HTML
- Allow Supervisor docker nets `172.30.32.0/23`

## 0.4.4

- Fix blank page on addon start: remove aggressive DOM prototype / MutationObserver patches that broke React hydration
- Keep fetch/XHR basePath patch only; media still uses `withBasePath` / `cssUrl` at render time

## 0.4.3

- Fix images under Ingress (energy house, Immich/Pexels screensaver, uploads, card art)
- Prefix same-origin media URLs with the addon basePath and harden the client patch

## 0.4.2

- Auto-link to Home Assistant via Supervisor when installed as an app (no long-lived token)
- Onboarding and Settings show Supervisor connection status

## 0.4.1

- Fix Ingress Open Web UI: stop Next.js 308 on `/` from sending the browser outside the ingress path
- Rewrite `Location` headers that still contain `/__ha_ingress__`
- Silence nginx duplicate `text/html` MIME warning in `sub_filter_types`

## 0.4.0

- Initial Home Assistant app (addon) with Ingress support
- Nginx reverse proxy rewrites the Next.js basePath placeholder to `X-Ingress-Path`
- Optional direct access on port 3000
- Options: `app_secret`, `pexels_api_key`, `default_language`
