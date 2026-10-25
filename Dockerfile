# Multi-stage build: Node 20+, port 3000
# Build met versie: docker build --build-arg VERSION=1.0.0 -t dashboard:1.0.0 .

ARG VERSION=0.0.0

FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

COPY . .
# prisma generate vereist DATABASE_URL; bij build is er geen runtime-ENV, dus placeholder
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

ARG VERSION=0.0.0
LABEL org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.title="Home Assistant Dashboard Builder"
ENV APP_VERSION="${VERSION}"

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# ws gebruikt anders de native bufferutil; in Docker faalt die vaak → pure JS fallback
ENV WS_NO_BUFFER_UTIL=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN apk add --no-cache gosu

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
# Production dependencies only. Prisma CLI stays because it is a runtime dependency for migrations.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/lib/check-secrets.mjs ./src/lib/check-secrets.mjs
# SIL Open Font License for the self-hosted Montserrat files.
COPY src/fonts/montserrat/OFL.txt /usr/share/licenses/montserrat/OFL.txt

# better-sqlite3 is een native addon: opnieuw bouwen voor deze container (Alpine) zodat de .node-binding klopt
RUN apk add --no-cache python3 make g++ \
  && npm rebuild better-sqlite3 \
  && npm prune --omit=dev \
  && apk del python3 make g++

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Maak de image-cache map aan en geef nextjs schrijfrechten
RUN mkdir -p /app/.next/cache && chown -R nextjs:nodejs /app/.next/cache
# /data bestaat ook zonder volume, zodat een kale `docker run` kan starten (#279). Een gemount volume vervangt deze map.
RUN mkdir -p /data/uploads && chown -R nextjs:nodejs /data

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Uploads in het data-volume zodat nextjs er mag schrijven (geen EACCES)
ENV UPLOAD_DIR=/data/uploads
# Image default for a bare docker run. A runtime DATABASE_URL still overrides this.
ENV DATABASE_URL="file:/data/app.db"

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
