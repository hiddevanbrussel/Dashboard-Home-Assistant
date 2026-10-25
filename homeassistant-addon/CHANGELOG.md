# Changelog

## [0.5.8] - 2026-10-25

No breaking changes: existing configs, dashboards, volumes and localStorage keep working.

### Fixed

- The Docker image starts without a `/data` volume. Before, a bare `docker run` stopped with a Prisma "Permission denied" error; volumes owned by root keep working too (#314, fixes #279).

## [0.5.7] - 2026-10-25

No breaking changes: existing configs, dashboards and localStorage keep working.

### Changed

- The music page has a full-width player bar at the bottom again: cover, title and artist, favourite, shuffle, previous, play/pause, next, keep playing, mute, a volume slider, the queue and a button for the large player. It replaces the small chip in the corner (#312).

## [0.5.6] - 2026-10-25

No breaking changes: existing configs, dashboards and localStorage keep working. The stored encryption format is unchanged.

### Added

- Music Assistant v1: view the queue, remove one item or clear the whole queue, each with a 5-second undo. Radio has its own tab, and Music shows in the menu whenever Music Assistant is on or Home Assistant has media players (#300).

### Changed

- The player bar keeps volume as − and + buttons, and all music controls have 44px touch targets (#300).
- API responses are compressed with gzip or brotli, also when Next.js streams them; in the add-on the ingress proxy compresses once after rewriting paths. A 25 KB dashboard response now travels as about 4 KB (#294).
- The Home Assistant token is no longer decrypted with a slow key derivation on every request; the key and token stay in memory until a new token is saved (#294).

## [0.5.5] - 2026-10-25

No breaking changes: existing configs, dashboards and localStorage keep working.

### Added

- Every tile has a tile menu in edit mode (⋮ → Edit tile, Duplicate tile, Remove tile). A duplicate lands on the first free spot with "(copy)" after its name; removing can be undone for 5 seconds and the tile comes back in the same place (#309).

### Changed

- The ⋮ button on every tile has a 44px touch area, without changing how it looks (#308).

### Fixed

- Icon buttons in the room panel are read out by name instead of the icon's code name (#307).
- Glass effect Off now also turns off the blur on tiles that set their own blur (#307).

## [0.5.4] - 2026-10-24

No breaking changes: existing configs, dashboards and localStorage keep working.

### Added

- Tasks v2 on the family page: task cards one per row in portrait and two in landscape, ticking off with a 5-second undo, a celebration when all of today's tasks are done, and a points balance that never goes below zero (#298, #304).
- Rooms page v1: room tiles with temperature and humidity, floor tabs with counts, one room panel for name, floor, background, icon, colour and sensors, deleting with a 5-second undo, and linking a dashboard room tile from a list (#299).
- Tiles no longer overlap in portrait: portrait and landscape keep their own tile positions. Landscape stays exactly as it was; portrait is laid out once and tiles are pushed apart when you tap Done or rotate (#296).

### Fixed

- The undo message is no longer cut off in portrait (#298, #304).
- Weekly tasks no longer trigger the "all done today" celebration (#298, #304).
- Stat pills pinned to the top bar keep their positions in both orientations and take no space in portrait (#296).

## [0.5.3] - 2026-10-24

No breaking changes: existing configs, dashboards and localStorage keep working.

### Added

- Add tile, phase 1: a new tile lands on the first free spot on screen (never behind the sidebar) and glows for 4 seconds with an undo toast. Each step of the add dialog goes back with the back button or Escape, touch targets are 44px, and the list stays above the on-screen keyboard (#290).
- Stat pills can be pinned to the top bar from a new tile menu in edit mode (⋮ → Move to top bar), and moved back to the grid. Up to 4 per dashboard or room; in portrait the bar shows one pill plus a "+N" chip (#301).
- An empty dashboard or room page explains itself and offers one Add tile button. Home without a dashboard shows a translated welcome card (#302).

### Changed

- The top-bar clock shows hours and minutes only, in the app language, and updates once a minute (#302).
- The top-bar temperature can only be tapped in edit mode, where it opens the weather picker. In normal use it is plain text (#302).
- Top-bar buttons and the weather picker's close button have 44px touch targets, without changing the bar height (#302).
- Dutch copy calls tiles "Tegel" everywhere: add, edit, name, remove, duplicate and move to another room. English is unchanged (#293).

### Fixed

- Chores: between 00:00 and 02:00 "today" still counted as yesterday. The chores card now follows the local calendar day (#297).

### Security

- The Music Assistant proxy only forwards the commands the dashboard itself uses; admin commands such as `config/*` are refused with 403, and rejected commands are logged without tokens (#295).

## [0.5.2] - 2026-10-22

No breaking changes: existing configs and localStorage keep working.

### Added

- Deleting a dashboard page can be undone for five seconds, and only the latest deletion stays undoable (#289).

### Changed

- The notification panel is solid in dark mode, and each dismiss control is a 44px tap target (#288).
- The clock font ships with the app, so the dashboard no longer downloads it from Google Fonts (#287).
- Glass density now applies only to the tiles. The navigation rail is solid, including over a photo background, with 44×44 tap targets (#291).

### Fixed

- The notification panel stays inside the screen, so Clear all remains visible, and the first list after idle shows current notifications (#282).
- In edit mode the page bar no longer covers the resize handle of a tile along the bottom (#286).

## [0.5.1] - 2026-10-21

- Fix: the add-on UI crashed under Home Assistant ingress (#277).
- Fix: the notification bell (#271).
- The UI font is now Google Sans, self-hosted (#273).
- Weather tile: the metrics row is hidden on low tiles (#276).
- Calendar tile: date labels stay inside the date column (#275).
- New settings screen (#272).

## 0.5.0

Login and security hardening. The dashboard does not start until `APP_SECRET` and `DASHBOARD_PASSWORD` are set. Back up the dashboard data for your install type before you update.

Requires Home Assistant 2024.8 or newer. From 2024.8 on, REST `return_response` works for `weather.get_forecasts`. On 2024.3–2024.7 the forecast stays empty.

Assist needs 2023.5 or newer.

### Before you update

**Home Assistant add-on**

1. Make a partial Home Assistant backup that includes this add-on (**Settings → System → Backups**). That saves the add-on data.
2. Open **Settings → Add-ons → Dashboard Builder → Configuration**.
3. Set `dashboard_password` (at least 12 characters, not a denylisted word). The add-on exits on start when this is empty or too weak.
4. Leave `app_secret` empty unless you set one yourself. The add-on keeps using `/data/app_secret`, so the saved Home Assistant connection keeps working. If that file is still a published placeholder, replace it and re-save the Home Assistant connection.
5. Update the add-on.
6. **Open Web UI / sidebar (Ingress) does not ask for the password.** Tablets on port 3000 sign in once (90-day cookie).

**Docker Compose / docker run**

1. Stop the app and archive the Compose volume `app-data` (the `/data` mount: `app.db`, `uploads/`). For example: `docker compose stop app`, then `docker run --rm -v app-data:/data -v "$PWD":/backup alpine tar czf /backup/app-data.tgz -C /data .`. The real volume name is often prefixed with the Compose project name.
2. Generate a secret once and store it: `openssl rand -hex 32`. Do not put that command inline in a `docker run` you repeat.
3. Set `APP_SECRET` and `DASHBOARD_PASSWORD` (at least 12 characters). Compose uses `${APP_SECRET:?}` and `${DASHBOARD_PASSWORD:?}` and refuses to start when either is missing.
4. `docker compose pull && docker compose up -d --force-recreate`.

**Unraid**

1. Stop the container, then copy or archive `/mnt/user/appdata/dashboard`, so `app.db` is consistent.
2. Edit the container or re-import `unraid-template.xml`.
3. Fill in `APP_SECRET` and `DASHBOARD_PASSWORD`.
4. Apply.

**Docker and Unraid**

- Stop the container before copying appdata, so `app.db` is consistent.
- Reuse the existing `APP_SECRET` if it is at least 32 characters and not a placeholder. With a new `APP_SECRET`, re-save **Settings → Home Assistant** after the first start.
- Make sure `DATABASE_URL=file:/data/app.db` (now the image default).
- A new host or port is a new browser origin, so browser-stored settings and keys don't carry over. Run the localStorage migration on the existing origin, or re-enter them.
- Revoking the Home Assistant long-lived token also disconnects any other instance that uses a copy of the same database.
- Before the update, pin the existing container to a fixed tag (e.g. `:0.4.89`) if you don't want `:latest` to jump to 0.5.0.

### Rules enforced at startup

- `APP_SECRET`: required, at least 32 characters. Published placeholders are rejected. Values with fewer than 8 different characters are rejected. This repetitive check applies only to `APP_SECRET`.
- `DASHBOARD_PASSWORD`: required, at least 12 characters, and different from `APP_SECRET`. The whole value is also rejected when it exactly matches the denylist, compared case-insensitively. Published placeholders are long enough to hit that check, for example `replace-with-a-long-passphrase`. Shorter denylist entries such as `password` and `changeme` fail the 12-character rule first. This is not a general dictionary. A long repeated character is allowed for the password.
- Invalid values stop startup with a `[startup]` message. The add-on runs this check in `run.sh` before Next.js starts.

### Migration

- Startup runs `prisma migrate deploy`, which adds `IntegrationCredential`.
- If `APP_SECRET` changed, re-save **Settings → Home Assistant**. The old ciphertext cannot be decrypted.
- Immich, Music Assistant, Pexels, and Valetudo secrets move from the browser into the database. Open the dashboard once in each signed-in browser. If that browser no longer has them, enter them again in Settings.
- RSS and article fetches allow public `https` URLs only.
- A public `http` Home Assistant URL is rejected. `http` stays allowed for localhost, private IPs, and names such as `.local`, `.lan`, `.home`, and single-label hosts.
- Doorbell iframes load only local URLs, or `https` hosts listed in `DOORBELL_ALLOWED_HOSTS`.
- Settings → update runs only when `UPDATE_PASSCODE` is at least 20 characters. Updating the container image is the normal path.
- `.env` is not in the repository. Copy `.env.example`.
- Behind your own proxy, set `APP_PUBLIC_ORIGIN` when the Home Assistant login client id must be a public origin. `TRUST_PROXY=1` (the add-on sets `HA_ADDON=1` and does not set `TRUST_PROXY`) makes `X-Real-IP`, then `X-Forwarded-For`, the client address for the login rate limit. The same switch makes `X-Forwarded-Proto` count for the Home Assistant login client id only. The session cookie `Secure` flag follows `X-Forwarded-Proto` whenever that header is present, including when `TRUST_PROXY` is unset. If the header is missing, `Secure` follows the request URL scheme.
- Consider revoking Home Assistant long-lived tokens that were stored by an older version.

### Also in this release

- Direct access shows a login page. The session cookie is httpOnly, signed, SameSite=Lax, and lasts 90 days. `Secure` is set when `X-Forwarded-Proto` or the request URL is https. Five failures in 15 minutes are counted per client, not in one shared bucket.
- An expired session redirects to `/login?next=<path>`, including the add-on base path, and returns there after login. `next` accepts only a same-origin relative path.
- The exact add-on root `/__ha_ingress__` requires a session. Anonymous requests redirect to `/__ha_ingress__/login?next=%2F`.
- The ingress proxy on port 8099 accepts only the Home Assistant Supervisor (`172.30.32.2`) and loopback.
- API routes require a session, except health, login, logout, and the PWA icon.
- Integration secrets are encrypted and only sent to the URL they were saved with. Image proxy URLs no longer include tokens.
- Uploads are limited to 8 MB. SVG responses use a sandbox CSP.
- Responses send `X-Content-Type-Options`, `Referrer-Policy`, and `Content-Security-Policy: base-uri 'self'; object-src 'none'`.
- Dependencies include Next.js 15.5.28, Prisma and `@prisma/adapter-better-sqlite3` 7.10.1, sharp 0.35.5, and ws 8.22.0.
- Container tag `latest` is published only when a `v*.*.*` git tag is pushed, together with amd64 and arm64/aarch64 images for that version. An existing version tag is not overwritten. A push to `main` does not publish images. Release 0.5.0 by pushing git tag `v0.5.0` after merge.

## 0.4.89

- Vacuum card 2: theme-specific product art for light and dark mode as full-bleed card background

## 0.4.88

- Vacuum card 2: quieter mockup layout (glass card, product art, Eco/Standard/Turbo tiles, green battery)

## 0.4.87

- Trash card: abbreviated pickup dates, chronological upcoming rows, ignore stale past dates, stronger date contrast, larger upcoming bin icons

## 0.4.86

- Weather card: mockup layout (temp left, large 3D condition icon right, metric columns) + new 3D weather icons

## 0.4.85

- Quieter cards: weather (glass + icon/temp metrics), Team Tracker (white logos/date/time), trash schedule (featured + upcoming with 3D container art, no lifestyle scenes)

## 0.4.84

- Vacuum card 2: new docked / empty-dock lifestyle backgrounds
- Team Tracker card: separate day and night stadium backgrounds (theme-aware)

## 0.4.83

- Team Tracker card: stadium lifestyle background, logos + VS, league pill, calendar date/time footer (no top “next match” header)

## 0.4.82

- Media card idle: drop ready-to-play title, hint, and icon — keep lifestyle background + controls

## 0.4.81

- Topbar: restore normal height and use a light top-to-bottom fade (fade no longer doubles the bar)

## 0.4.80

- Media card idle state: lifestyle speaker backgrounds + ready-to-play layout (title, hint, control bar)

## 0.4.79

- Vacuum card 2 redesign: mockup layout (title + status + battery, hero art, Eco/Standard/Turbo tiles) with docked / empty-dock WebP art

## 0.4.78

- Weather card redesign: curated day/night WebP backgrounds, metrics bar (wind, humidity, air quality, precipitation), and per-detail switches in the edit panel

## 0.4.77

- Settings → Personalization: live preview + card layout (theme, accent, glass, background, language & time, interaction)

## 0.4.76

- Settings: restore left sidebar navigation (Display / Dashboard / System)
- Settings → Home Assistant: connection status card plus searchable entity browser (filter by type, group by active / idle / unavailable, copy entity ID)

## 0.4.72

- Docker / add-on: pass Immich and Music Assistant credentials via env (`IMMICH_URL`, `IMMICH_API_KEY`, `MUSIC_ASSISTANT_URL`, `MUSIC_ASSISTANT_TOKEN`) or matching add-on options; server env overrides browser-stored values
- Settings → Apps: show when Immich / Music Assistant keys come from the server (same pattern as Pexels)

## 0.4.70

- Image card: lower minimum resize size to 48×48 px (was 120×80) so tiny image cards are possible

## 0.4.69

- Image card: free resize via bottom-right handle (persists width/height), like media/nuts/calendar
- Image card: always render bare (rounded image only — no title, border, or glass background)

## 0.4.68

- Fix Docker/CI build: cast stat pill edit-preview `conditions` to `SensorCondition[]` so `npm run build` typechecks

## 0.4.67

- Stat pill card: visual icon picker (plug-zap, zap, sun, solar-panel, circle-arrow-up/down, lightbulb, zap-off, air-vent)
- Stat pill card: less transparent background (`/25`→`/80`) for better readability on energy backgrounds

## 0.4.66

- Topbar: full viewport width again (edge-to-edge, including behind the sidebar)
- Topbar: frosted glass only after scrolling, when content would show through; clear/transparent at the top
- Topbar: remove the now-playing disc icon while music is playing (mini player / music page unchanged)

## 0.4.65

- Topbar: frosted glass background (backdrop blur + translucent fill) so scrolled content no longer reads through the header; covers main header and music subnav chrome
- Music: polish Home / Artists / Albums / Playlists / Podcasts tabs into a segmented pill control matching the rest of the UI

## 0.4.64

- Appearance: global card glass density (Off / Low / Medium / High) — frosted blur intensity via CSS variables, like iOS liquid glass
- Screensaver settings: clearer sections (Behavior → Source & media → Display size & format → On-screen content → Test); preview moved to the bottom Test group

## 0.4.63

- Trash card: bold/light title split (e.g. “Eerstvolgende” / “ophaalmoment”), accent underline, waste-type chip centered vertically, remove unused chevron on the info chip

## 0.4.62

- Music: move Home / Artists / Albums / Playlists / Podcasts section tabs out of the main topbar into a full-width secondary nav bar under the header (desktop + mobile)

## 0.4.61

- Doorbell settings moved under Settings → Apps (alongside Pexels and other integrations); removed the standalone sidebar item

## 0.4.60

- Doorbell: when a configured HA visitor/doorbell binary sensor rings, play a chime and open a camera popup (Reolink-friendly via Home Assistant)
- Doorbell settings: pick sensor + camera, enable/disable, cooldown, optional go2rtc WebRTC URL for live audio / talkback (EN + NL)
- Without go2rtc: live HA camera snapshots + chime still work; a separate Reolink app is not required for video + sound

## 0.4.59

- Calendar week view: overlapping timed events render side-by-side so titles stay readable
- Calendar week view: all-day / multi-day events use a dedicated equal-width lane (no more skewed day columns)

## 0.4.58

- Notifications: in-app alerts when HA entity states change (toast + header bell history), with configurable rules and cooldowns
- Notifications: default “vacuum finished” rule (cleaning/returning/paused → docked/idle/charging)
- Settings → Notifications: add/edit/enable rules (EN + NL)

## 0.4.57

- Pexels: fix intermittent empty screensaver media by paging within `total_results` (was randomly requesting pages 1–10)
- Pexels: prefer server/Docker `PEXELS_API_KEY` over a stale browser-stored key; clearer missing/invalid-key errors
- Pexels: Apps settings shows env-key status and a Test connection button; force HTTPS on video CDN links

## 0.4.56

- Energy: fix SVG background uploads rejected when browsers send charset MIME (`image/svg+xml;charset=utf-8`) or mislabeled types (`text/xml`, `text/plain`); treat `.svg` filename as SVG and sanitize content

## 0.4.55

- Energy: allow SVG (including SMIL-animated) light/dark page backgrounds; served via `<img>` with server-side sanitization; value pills remain on top

## 0.4.54

- Energy: customize light/dark page backgrounds in Settings → Energy (upload, replace, reset to bundled art); persists on the energy dashboard and never inherits patio/global wallpaper

## 0.4.53

- Header: show sunrise and sunset next to weather (Lucide icons; HA `sun.sun` `next_rising` / `next_setting`, with weather-attribute fallback)

## 0.4.52

- Trash card: larger top-left next-collection title; move waste-type chip toward the bottom of the card

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
