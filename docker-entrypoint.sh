#!/bin/sh
set -e
# Fix permissions: volume /data may be root-owned, nextjs (uid 1001) needs write access
if [ -d /data ]; then
  mkdir -p /data/uploads
  chown -R 1001:1001 /data 2>/dev/null || true
fi
if [ -f /app/src/lib/check-secrets.mjs ]; then
  node /app/src/lib/check-secrets.mjs
fi
exec gosu nextjs "$@"
