#!/bin/sh
set -e

OPTIONS_FILE=/data/options.json

if [ -f "$OPTIONS_FILE" ]; then
  APP_SECRET=$(jq -r '.app_secret // empty' "$OPTIONS_FILE")
  PEXELS_API_KEY=$(jq -r '.pexels_api_key // empty' "$OPTIONS_FILE")
  DEFAULT_LANGUAGE=$(jq -r '.default_language // "en"' "$OPTIONS_FILE")
else
  APP_SECRET=""
  PEXELS_API_KEY=""
  DEFAULT_LANGUAGE="en"
fi

SECRET_FILE=/data/app_secret
if [ -z "$APP_SECRET" ] || [ "$APP_SECRET" = "null" ]; then
  if [ -f "$SECRET_FILE" ]; then
    APP_SECRET=$(cat "$SECRET_FILE")
  else
    APP_SECRET=$(openssl rand -hex 32)
    echo "$APP_SECRET" > "$SECRET_FILE"
    chmod 600 "$SECRET_FILE"
  fi
fi

export APP_SECRET
export DATABASE_URL="${DATABASE_URL:-file:/data/app.db}"
export UPLOAD_DIR="${UPLOAD_DIR:-/data/uploads}"
export NEXT_PUBLIC_DEFAULT_LANGUAGE="$DEFAULT_LANGUAGE"
if [ -n "$PEXELS_API_KEY" ] && [ "$PEXELS_API_KEY" != "null" ]; then
  export PEXELS_API_KEY
fi

export HA_ADDON="1"
if [ -n "${SUPERVISOR_TOKEN:-}" ]; then
  export HA_SUPERVISOR_TOKEN="$SUPERVISOR_TOKEN"
fi

mkdir -p /data/uploads /run/nginx

if [ -d /data ]; then
  chown -R 1001:1001 /data 2>/dev/null || true
fi

# Next.js internal; ingress-proxy on :8099; nginx on :3000 (direct)
export HOSTNAME="127.0.0.1"
export PORT=3001

echo "[addon] Starting Dashboard Builder ${APP_VERSION:-unknown}"
echo "[addon] Next.js :3001 — ingress-proxy :8099 — nginx :3000"

rm -f /etc/nginx/http.d/default.conf
# Ingress is handled by Node (no nginx sub_filter on 8099)
rm -f /etc/nginx/http.d/ingress.conf

/app/docker-entrypoint.sh sh -c "npx prisma migrate deploy && node server.js" &
APP_PID=$!

i=0
until wget -q -O /dev/null "http://127.0.0.1:3001/__ha_ingress__/" 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -gt 90 ]; then
    echo "[addon] Next.js did not become ready in time" >&2
    kill "$APP_PID" 2>/dev/null || true
    exit 1
  fi
  if ! kill -0 "$APP_PID" 2>/dev/null; then
    echo "[addon] Next.js process exited unexpectedly" >&2
    exit 1
  fi
  sleep 1
done

echo "[addon] Next.js is ready; starting ingress-proxy + nginx"

node /ingress-proxy.js &
PROXY_PID=$!

nginx -c /etc/nginx/nginx.conf -g "daemon off;" &
NGINX_PID=$!

shutdown() {
  kill "$APP_PID" "$PROXY_PID" "$NGINX_PID" 2>/dev/null || true
  wait "$APP_PID" "$PROXY_PID" "$NGINX_PID" 2>/dev/null || true
}
trap 'shutdown; exit 0' TERM INT

while kill -0 "$APP_PID" 2>/dev/null && kill -0 "$PROXY_PID" 2>/dev/null && kill -0 "$NGINX_PID" 2>/dev/null; do
  sleep 2
done

echo "[addon] A process exited; shutting down" >&2
shutdown
exit 1
