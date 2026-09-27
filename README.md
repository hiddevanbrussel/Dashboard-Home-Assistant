# Home Assistant Dashboard Builder

A personal, touchscreen-friendly dashboard for Home Assistant. Add widgets, set backgrounds, manage rooms, track energy, and more — all without writing code.

The interface is available in **English** and **Dutch**.

<img alt="Home dashboard with vacuum and weather cards" src="docs/readme/dashboard.webp" />

<p>
<img width="49%" alt="Screensaver lock clock" src="docs/readme/screensaver.webp" />
<img width="49%" alt="Screensaver settings" src="docs/readme/settings-screensaver.webp" />
</p>

<img alt="Energy page" src="docs/readme/energy.webp" />

---

## What's new

Recent updates that landed on `main`:

- **Screensaver lock clock** — Montserrat Medium, hours and minutes side by side in warm gold (hours slightly paler), with a tint from your accent color. Four sizes from phone to wall display; Extra large is meant for a TV or wall tablet.
- **Music on the screensaver** — choose which Home Assistant `media_player` may show now-playing. Automatic (first player that is playing), a specific speaker, or hide music entirely. Useful when some speakers report playback but do not pass a real track.
- **Vacuum card** — restyled around light/dark robot illustrations, with a full control sheet (and Valetudo map when configured).
- **Resizable cards** — Media, Weather, Climate, and Vacuum cards scale from a bottom-right handle in edit mode, same as each other.
- **Swipeable Home pages** — up to six dashboard pages, swiped like the Rooms floors.
- **Screensaver media** — custom upload, [Pexels](https://www.pexels.com/api/), or your own [Immich](https://immich.app/) library.
- **Voice Satellite** — tap-to-talk Assist from the header, or an on-device wake word (Okay Nabu, Hey Jarvis, and others). A wake word plays a short chime and shows status in the header instead of a popup. Uses your Home Assistant voice pipeline for speech-to-text, conversation, and spoken replies.

---

## Features

### Home & rooms

- Free-form dashboard: drag cards, optional edit passcode, welcome title, and a wallpaper per light/dark theme.
- Up to six swipeable Home pages.
- Rooms grouped by floor; swipe between floors, then open a room board with the same editor.

### Cards

Add tiles in edit mode. Current types:

| Card | Notes |
|---|---|
| Light | Brightness, color, and color temperature |
| Climate | Temperature gauge; swipe between climate entities |
| Media | Now playing; resizable |
| Weather | Current conditions; tap for hourly/weekly forecast; resizable |
| Vacuum | Robot illustration and control sheet; resizable |
| Calendar | Compact Now / Up next |
| Tasks | Family chore summary |
| Room | Shortcut into a room |
| Text / Image / Stat pill | Labels, photos, and single-value stats |

### Screensaver

After idle time the dashboard becomes a lock screen. Dismiss it with a tap or mouse move.

- Clock size and position (nine placements), 12- or 24-hour format, and a full-screen preview from Settings.
- Weather (same entity as the header, or a specific one).
- Now-playing from a chosen speaker, or hidden.
- Optional football match overlay from a `sensor.team_…` entity.
- A running kitchen timer stays visible on the lock screen.
- Background: uploaded image, Pexels photos/videos, or Immich photos/videos.

Configure this under **Settings → Screensaver**.

### Pages

Enable extra pages in Settings when you need them:

| Page | What it does |
|---|---|
| **Energy** | Solar/grid/battery overview, house scene, panel heatmap, and an editable energy board |
| **Calendar** | Day / week / month, Today, Now, and Up next from Home Assistant calendars |
| **Family / Tasks** | Children, chores, points, streaks, and a rewards shop — works **without** Home Assistant |
| **Music** | Music Assistant home (search, shelves, player) or a Home Assistant media-player fallback |
| **Vacuum** | Full-page Valetudo map and room cleaning (from Settings → Apps → Valetudo, or the vacuum card) |

The header also shows the clock, weather temperature, optional RSS news, a timer, Voice Satellite (including wake-word status), and now-playing.

### Settings & integrations

- **Appearance** — light / dark / system theme and accent color.
- **Connection** — Home Assistant base URL and long-lived access token.
- **Apps** — Music Assistant, Valetudo, Pexels, Immich, RSS news, and Voice Satellite (Home Assistant Assist, optional wake word).

---

## Home Assistant App (Addon)

Install from Supervisor for Ingress (Open Web UI / sidebar), no separate Docker host required:

1. **Settings → Apps → App Store** → ⋮ → **Repositories**
2. Add `https://github.com/hiddevanbrussel/Dashboard-Home-Assistant`
3. Install **Dashboard Builder**, start it, then open **Open Web UI**

During soft onboarding the app **links automatically** via the Supervisor (no URL or long-lived token). You still pick a dashboard name and optional integrations. Full steps: [`homeassistant-addon/DOCS.md`](homeassistant-addon/DOCS.md).

---

## Quick install with Docker

The easiest way to run the dashboard outside Supervisor is the pre-built Docker image from GitHub Container Registry.

```bash
docker run -d \
  --name ha-dashboard \
  --restart unless-stopped \
  -p 3000:3000 \
  -v ha-dashboard-data:/data \
  -e APP_SECRET="change-this-to-a-random-32-char-secret" \
  ghcr.io/hiddevanbrussel/dashboard-home-assistant:latest
```

Open **http://your-server-ip:3000** and follow soft onboarding. Docker installs scan your LAN for Home Assistant, then let you log in (IndieAuth) or paste a long-lived token.

---

## Docker Compose

Create a `docker-compose.yml`:

```yaml
services:
  ha-dashboard:
    image: ghcr.io/hiddevanbrussel/dashboard-home-assistant:latest
    container_name: ha-dashboard
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ha-dashboard-data:/data
    environment:
      - APP_SECRET=change-this-to-a-random-32-char-secret
      - PEXELS_API_KEY=        # optional — get a free key at pexels.com/api

volumes:
  ha-dashboard-data:
```

```bash
docker compose up -d
```

---

## Unraid

1. In Unraid, go to **Apps** and click **Add Container** (or import a template).
2. Set the repository to:
   ```
   ghcr.io/hiddevanbrussel/dashboard-home-assistant:latest
   ```
3. Map port **3000** and set a host path for `/data` (e.g. `/mnt/user/appdata/ha-dashboard`).
4. Add the environment variable `APP_SECRET` with a random string.
5. Optionally add `PEXELS_API_KEY` for screensaver photos/videos.

You can also import the template from the repository: [`unraid-template.xml`](unraid-template.xml)

---

## Connecting Home Assistant

**Docker / self-hosted:** soft onboarding searches your network for Home Assistant, then you can **Log in with Home Assistant** (IndieAuth) or paste a long-lived access token.

**Home Assistant App (Addon):** connection is automatic via the Supervisor — no token needed.

To create a long-lived token manually:

1. Open Home Assistant → click your **Profile** (bottom-left avatar).
2. Scroll to **Long-Lived Access Tokens** → click **Create token**.
3. Give it a name (e.g. "Dashboard") and copy the token — it is shown only once.

Base URL examples:

| Setup | URL example |
|---|---|
| Local hostname | `http://homeassistant.local:8123` |
| IP address | `http://192.168.1.10:8123` |
| HTTPS / reverse proxy | `https://ha.yourdomain.com` |

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `APP_SECRET` | Yes | Random secret for session encryption (min. 32 characters) |
| `DATABASE_URL` | No | SQLite path (default: `file:/data/app.db`) |
| `PEXELS_API_KEY` | No | Free key from [pexels.com/api](https://www.pexels.com/api/) for screensaver media |
| `NEXT_PUBLIC_APP_NAME` | No | App name shown in the browser title |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | No | Default UI language: `en` (English) or `nl` (Dutch) |

---

## Automatic updates

The Docker image is rebuilt automatically on every push to `main` (amd64) and on every version tag (`v*.*.*`, amd64 + arm64). The version in **Settings → System** matches `package.json` / the addon `config.yaml`.

### Docker / Docker Compose

```bash
docker pull ghcr.io/hiddevanbrussel/dashboard-home-assistant:latest
docker compose pull
docker compose up -d --force-recreate
```

A plain `docker pull` is not enough — the container must be recreated to run the new image.

### Unraid

1. Open the container → **Force update** (or apply update if shown).
2. Confirm **Settings → System** shows the new version (e.g. `0.4.16`).

### Home Assistant addon

Supervisor only offers an update when the addon **version** in `config.yaml` increases. After a release:

1. **Settings → Add-ons → Add-on store** → ⋮ → **Check for updates** (or refresh your custom repository).
2. Update **Dashboard Builder** when `0.4.16` (or newer) appears.
3. Confirm the version under the addon info / in-app **Settings → System**.

The current version is shown in **Settings → System**.

---

## Reverse proxy (Docker / Unraid)

The published Docker image (`ghcr.io/hiddevanbrussel/dashboard-home-assistant`) serves at **root `/` on port 3000**. Recent Home Assistant **addon Ingress** fixes (`/__ha_ingress__`, basePath rewrites) apply only to the separate addon image — they are **not** baked into the normal Docker image.

**Supported:** host-based / subdomain proxies (recommended):

- `https://dashboard.yourdomain.com/` → `http://container:3000/`
- Nginx Proxy Manager, Traefik, Caddy, etc. with a dedicated hostname

Forward these headers so HTTPS and IndieAuth redirects stay correct:

- `Host` (or `X-Forwarded-Host`)
- `X-Forwarded-Proto` (`https` when the public URL is HTTPS)
- `X-Forwarded-For` (optional)

Example Nginx (subdomain):

```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  # App Router / RSC streams; buffering can blank the page behind some proxies
  proxy_buffering off;
}
```

**Not supported out of the box:** path-based proxies such as `https://yourdomain.com/dashboard/` → container. Next.js `basePath` is a **build-time** setting. The Docker image is built without it, so `/_next/...` and `/api/...` stay absolute from `/` and break under a URL subpath.

**Do not** set `NEXT_BASE_PATH` or `NEXT_PUBLIC_BASE_PATH` at container runtime — that does not change the already-built routes. The addon image is a different build (`…-addon`) that uses `/__ha_ingress__` only for Supervisor Ingress.

Quick checks:

1. Direct: `http://HOST:3000/` returns the app (not a redirect to `/__ha_ingress__`).
2. Via proxy: open the public URL and confirm network requests go to `/_next/...` and `/api/...` on the **same** host (no missing subpath, no `/__ha_ingress__`).
3. Confirm **Settings → System** shows the expected version after `docker compose pull` + recreate (or Unraid Force update).

---

## Troubleshooting

**Invalid token** — Create a new Long-Lived Access Token in Home Assistant and enter it in Settings → HA Connection.

**Mixed content warning** — If the dashboard runs on HTTPS, the Home Assistant URL must also be HTTPS (or use a reverse proxy).

**Can't reach Home Assistant** — All HA API calls are made server-side. The HA URL must be reachable from the Docker container, not just from your browser.

**Dashboard unreachable via reverse proxy** — Use a subdomain (not a `/subpath`). See [Reverse proxy (Docker / Unraid)](#reverse-proxy-docker--unraid). Path-based proxies and confusing the Docker image with the HA addon image are the usual causes — not the recent Ingress-only updates.

**Uploads not persisting** — Make sure the `/data` volume is mounted. Without it, uploaded images and the database are lost when the container restarts.

---

## Build from source

```bash
git clone https://github.com/HiddevanBrussel/Dashboard-Home-Assistant.git
cd Dashboard-Home-Assistant
npm install
cp .env.example .env   # edit APP_SECRET
npx prisma migrate dev
npm run dev            # http://localhost:3000
```

```bash
npm run build && npm run start   # production
```
