# Changelog

## 0.4.1

- Fix Ingress Open Web UI: stop Next.js 308 on `/` from sending the browser outside the ingress path
- Rewrite `Location` headers that still contain `/__ha_ingress__`
- Silence nginx duplicate `text/html` MIME warning in `sub_filter_types`

## 0.4.0

- Initial Home Assistant app (addon) with Ingress support
- Nginx reverse proxy rewrites the Next.js basePath placeholder to `X-Ingress-Path`
- Optional direct access on port 3000
- Options: `app_secret`, `pexels_api_key`, `default_language`
