#!/bin/sh
set -e
# Fix permissions: volume /data may be root-owned, nextjs (uid 1001) needs write access
if [ -d /data ]; then
  chown -R 1001:1001 /data 2>/dev/null || true
fi
exec gosu nextjs "$@"
