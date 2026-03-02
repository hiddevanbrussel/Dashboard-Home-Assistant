# Home Assistant Dashboard Builder

A personal, touchscreen-friendly dashboard for Home Assistant. Add widgets, set backgrounds, manage rooms, track energy, and more — all without writing code.

<img width="1234" height="689" alt="Dashboard preview" src="https://github.com/user-attachments/assets/cf92e71b-15b3-48c5-925e-f43cc083af4a" />

---

## Quick install with Docker

The easiest way to run the dashboard is with the pre-built Docker image from GitHub Container Registry.

```bash
docker run -d \
  --name ha-dashboard \
  --restart unless-stopped \
  -p 3000:3000 \
  -v ha-dashboard-data:/data \
  -e APP_SECRET="change-this-to-a-random-32-char-secret" \
  ghcr.io/hiddevanbrussel/dashboard-home-assistant:latest
```

Open **http://your-server-ip:3000** and follow the onboarding to connect Home Assistant.

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

You need a **Long-Lived Access Token** from Home Assistant:

1. Open Home Assistant → click your **Profile** (bottom-left avatar).
2. Scroll to **Long-Lived Access Tokens** → click **Create token**.
3. Give it a name (e.g. "Dashboard") and copy the token — it is shown only once.

Enter the token and your Home Assistant base URL during onboarding:

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

The Docker image is rebuilt automatically on every push to `main` and on every version tag (`v*.*.*`). To update:

```bash
docker pull ghcr.io/hiddevanbrussel/dashboard-home-assistant:latest
docker compose up -d   # or restart the container in Unraid
```

The current version is shown in **Settings → System**.

---

## Troubleshooting

**Invalid token** — Create a new Long-Lived Access Token in Home Assistant and enter it in Settings → HA Connection.

**Mixed content warning** — If the dashboard runs on HTTPS, the Home Assistant URL must also be HTTPS (or use a reverse proxy).

**Can't reach Home Assistant** — All HA API calls are made server-side. The HA URL must be reachable from the Docker container, not just from your browser.

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
