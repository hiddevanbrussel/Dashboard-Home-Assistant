# Changelog

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
