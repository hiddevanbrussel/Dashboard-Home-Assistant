module.exports = [
"[project]/.next-internal/server/app/api/ha/test/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/lib/validation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "baseUrlSchema",
    ()=>baseUrlSchema,
    "connectionPayloadSchema",
    ()=>connectionPayloadSchema,
    "entityFilterSchema",
    ()=>entityFilterSchema,
    "tokenSchema",
    ()=>tokenSchema,
    "validateConnectionInput",
    ()=>validateConnectionInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const baseUrlSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Base URL is required").url("Invalid URL format").refine((url)=>{
    try {
        const u = new URL(url);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch  {
        return false;
    }
}, {
    message: "URL must use http or https"
});
const tokenSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Token is required");
const connectionPayloadSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    baseUrl: baseUrlSchema,
    token: tokenSchema
});
const entityFilterSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    domains: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).optional(),
    search: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
function validateConnectionInput(input) {
    const result = connectionPayloadSchema.safeParse(input);
    if (result.success) return {
        success: true,
        data: result.data
    };
    const first = result.error.flatten().fieldErrors;
    const msg = first.baseUrl?.[0] ?? first.token?.[0] ?? "Invalid connection data";
    return {
        success: false,
        error: msg
    };
}
}),
"[project]/src/lib/ha/rest.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Home Assistant REST API client. Use only on the server.
 */ __turbopack_context__.s([
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
}),
"[project]/src/app/api/ha/test/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/validation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ha$2f$rest$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ha/rest.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid JSON"
        }, {
            status: 400
        });
    }
    const validated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateConnectionInput"])(body);
    if (!validated.success) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: validated.error
        }, {
            status: 400
        });
    }
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ha$2f$rest$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["testConnection"])({
        baseUrl: validated.data.baseUrl,
        token: validated.data.token
    });
    if (result.ok) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: false,
        error: result.error
    }, {
        status: 400
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6ad2ce15._.js.map