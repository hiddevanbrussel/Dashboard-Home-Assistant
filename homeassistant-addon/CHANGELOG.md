# Changelog

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
