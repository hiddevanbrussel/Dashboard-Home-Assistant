# Dashboard Builder

Personal, touchscreen-friendly dashboard for Home Assistant. Add widgets, set backgrounds, manage rooms, track energy, and more — without writing Lovelace YAML.

## Installation

1. In Home Assistant go to **Settings → Apps → App Store** (or **Settings → Add-ons** on older versions).
2. Click the three-dot menu → **Repositories**.
3. Add:
   ```
   https://github.com/hiddevanbrussel/Dashboard-Home-Assistant
   ```
4. Find **Dashboard Builder** in the store and install it.
5. Start the app, then open it with **Open Web UI** (Ingress) or from the sidebar.

The first start pulls the pre-built image from GitHub Container Registry and may take a minute.

## Configuration

| Option | Description |
|---|---|
| `app_secret` | Optional. Encryption secret (min. 32 characters). Leave empty to auto-generate a stable secret stored in the app data. |
| `pexels_api_key` | Optional. [Pexels](https://www.pexels.com/api/) key for screensaver media. |
| `default_language` | UI language: `en` or `nl`. |

## Connecting Home Assistant

When installed as a Home Assistant app, the dashboard **links automatically** via the Supervisor (`homeassistant_api`). Onboarding shows “Connected via Home Assistant” — no URL or long-lived token is required.

You can still set a custom URL + token under **Settings → Connection** if you need to override the Supervisor link (for example to point at a remote instance).

## Ingress vs direct port

- **Ingress (recommended)** — use **Open Web UI** or the sidebar entry. Traffic stays inside Home Assistant; no extra port on your LAN.
- **Port 3000** — enable under the app’s network settings if you want a direct URL. Open `http://HOME_ASSISTANT_IP:3000/` (redirects to `/__ha_ingress__`).

## Data

SQLite database and uploads are stored in the app’s persistent `/data` folder and survive updates.

## Support

- Issues: https://github.com/hiddevanbrussel/Dashboard-Home-Assistant/issues
- Docker / Unraid installs (without Supervisor): see the repository [README](https://github.com/hiddevanbrussel/Dashboard-Home-Assistant#quick-install-with-docker)
