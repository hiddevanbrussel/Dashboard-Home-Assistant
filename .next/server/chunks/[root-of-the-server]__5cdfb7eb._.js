module.exports = [
"[project]/.next-internal/server/app/api/ha/state/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/lib/encrypt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Server-only encryption for sensitive data (e.g. Home Assistant tokens).
 * Uses AES-256-GCM. Never log or send decrypted tokens to the client.
 */ __turbopack_context__.s([
    "decrypt",
    ()=>decrypt,
    "encrypt",
    ()=>encrypt
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const ALGORITHM = "aes-256-gcm";
const KEY_LEN = 32;
const IV_LEN = 16;
const AUTH_TAG_LEN = 16;
const SALT_LEN = 32;
function getKey(secret) {
    const salt = process.env.APP_SECRET_SALT ?? "ha-dashboard-salt-v1";
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["scryptSync"])(secret, salt, KEY_LEN);
}
function encrypt(plaintext, secret) {
    const keySecret = secret ?? process.env.APP_SECRET;
    if (!keySecret || keySecret.length < 16) {
        throw new Error("APP_SECRET must be set and at least 16 characters");
    }
    const key = getKey(keySecret);
    const iv = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(IV_LEN);
    const cipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createCipheriv"])(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([
        iv,
        authTag,
        encrypted
    ]).toString("hex");
}
function decrypt(hexPayload, secret) {
    const keySecret = secret ?? process.env.APP_SECRET;
    if (!keySecret || keySecret.length < 16) {
        throw new Error("APP_SECRET must be set and at least 16 characters");
    }
    const key = getKey(keySecret);
    const buf = Buffer.from(hexPayload, "hex");
    if (buf.length < IV_LEN + AUTH_TAG_LEN) {
        throw new Error("Invalid encrypted payload");
    }
    const iv = buf.subarray(0, IV_LEN);
    const authTag = buf.subarray(IV_LEN, IV_LEN + AUTH_TAG_LEN);
    const ciphertext = buf.subarray(IV_LEN + AUTH_TAG_LEN);
    const decipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createDecipheriv"])(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(ciphertext) + decipher.final("utf8");
}
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Server-only: get HA connection config from DB (decrypted).
 */ __turbopack_context__.s([
    "getHaConnection",
    ()=>getHaConnection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$encrypt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/encrypt.ts [app-route] (ecmascript)");
;
;
async function getHaConnection(connectionId) {
    const conn = connectionId ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].connection.findUnique({
        where: {
            id: connectionId
        }
    }) : await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].connection.findFirst({
        orderBy: {
            createdAt: "desc"
        }
    });
    if (!conn) return null;
    try {
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$encrypt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decrypt"])(conn.encryptedToken);
        return {
            baseUrl: conn.baseUrl,
            token
        };
    } catch  {
        return null;
    }
}
}),
"[project]/src/lib/ha/rest.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Home Assistant REST API client. Use only on the server.
 */ __turbopack_context__.s([
    "callService",
    ()=>callService,
    "getAreas",
    ()=>getAreas,
    "getEntities",
    ()=>getEntities,
    "testConnection",
    ()=>testConnection
]);
function normalizeBaseUrl(baseUrl) {
    const u = baseUrl.trim().replace(/\/+$/, "");
    return u;
}
async function haFetch(baseUrl, token, path, options = {}) {
    const url = `${normalizeBaseUrl(baseUrl)}${path.startsWith("/") ? path : `/${path}`}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers
        }
    });
    return res;
}
async function testConnection(config) {
    try {
        const res = await haFetch(config.baseUrl, config.token, "/api/");
        if (!res.ok) {
            if (res.status === 401) return {
                ok: false,
                error: "Invalid token. Create a new Long-Lived Access Token in Home Assistant."
            };
            if (res.status === 404) return {
                ok: false,
                error: "API not found. Check the base URL and that Home Assistant is running."
            };
            return {
                ok: false,
                error: `Connection failed: ${res.status} ${res.statusText}`
            };
        }
        const text = await res.text();
        if (!text.toLowerCase().includes("api")) {
            return {
                ok: false,
                error: "Unexpected response from Home Assistant."
            };
        }
        return {
            ok: true
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("fetch failed") || message.includes("ECONNREFUSED")) {
            return {
                ok: false,
                error: "Cannot reach Home Assistant. Check base URL and network."
            };
        }
        if (message.includes("Mixed Content") || message.includes("HTTPS")) {
            return {
                ok: false,
                error: "Use HTTPS for the base URL or a reverse proxy to avoid mixed content."
            };
        }
        return {
            ok: false,
            error: message
        };
    }
}
async function getEntities(config) {
    const res = await haFetch(config.baseUrl, config.token, "/api/states");
    if (!res.ok) {
        throw new Error(`Failed to fetch entities: ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}
async function getAreas(config) {
    const { fetchAreasViaWebSocket } = await __turbopack_context__.A("[project]/src/lib/ha/websocket.ts [app-route] (ecmascript, async loader)");
    const list = await fetchAreasViaWebSocket(config.baseUrl, config.token);
    return list.map((a)=>({
            area_id: a.area_id,
            name: a.name
        }));
}
async function callService(config, domain, service, data = {}) {
    try {
        const res = await haFetch(config.baseUrl, config.token, `/api/services/${domain}/${service}`, {
            method: "POST",
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const text = await res.text();
            return {
                ok: false,
                error: text || res.statusText
            };
        }
        return {
            ok: true
        };
    } catch (err) {
        return {
            ok: false,
            error: err instanceof Error ? err.message : String(err)
        };
    }
}
}),
"[project]/src/app/api/ha/state/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ha$2f$rest$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ha/rest.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get("connectionId") ?? undefined;
    const config = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getHaConnection"])(connectionId);
    if (!config) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
    }
    try {
        const entities = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ha$2f$rest$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEntities"])(config);
        const state = entities.map((e)=>({
                entity_id: e.entity_id,
                state: e.state,
                attributes: e.attributes
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(state);
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err instanceof Error ? err.message : "Failed to fetch state"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5cdfb7eb._.js.map