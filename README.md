# Home Assistant Dashboard Builder

Set up a working dashboard with live Home Assistant data in 5–10 minutes.

<img width="1234" height="689" alt="image" src="https://github.com/user-attachments/assets/cf92e71b-15b3-48c5-925e-f43cc083af4a" />

## Requirements

- Node 20+
- Home Assistant instance with a **Long-Lived Access Token**

## Getting a token in Home Assistant

1. In Home Assistant, open your **Profile** (click your avatar).
2. Under **Long-Lived Access Tokens**, click **Create token**.
3. Name it (e.g. "Dashboard Builder") and copy the token. Store it securely; it is shown only once.

## Base URL examples

- Local: `http://homeassistant.local:8123`
- IP: `http://192.168.1.10:8123`
- With HTTPS / reverse proxy: `https://ha.yourdomain.com`

## Quick start (local)

```bash
cp .env.example .env
# Set APP_SECRET (at least 16 characters) and optionally DATABASE_URL
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and go through **Onboarding** to connect Home Assistant and build your dashboard.

## Docker

### Build and run

```bash
docker build -t ha-dashboard-builder .
docker run -p 3000:3000 \
  -e APP_SECRET="your-32-byte-secret-for-encryption-change-in-production" \
  -v ha-data:/data \
  ha-dashboard-builder
```

### Docker Compose

```bash
docker compose up -d
```

Defaults:

- `APP_SECRET`: set in `.env` or override when running.
- `DATABASE_URL`: `file:/data/app.db` (SQLite in the mounted volume).
- `NEXT_PUBLIC_APP_NAME`: "Home Assistant Dashboard Builder".

## Troubleshooting

- **Invalid token**: Create a new Long-Lived Access Token in Home Assistant and use it in onboarding.
- **Mixed content**: If the app is served over HTTPS, use an HTTPS base URL for Home Assistant (or a reverse proxy).
- **CORS**: All Home Assistant API calls are made from the server; the client never sends the token. No CORS issues from the browser.

## Scripts

- `npm run dev` – development server (Turbopack)
- `npm run build` – production build
- `npm run start` – run production server
- `npm run lint` – ESLint
- `npm run test` – run Vitest tests
