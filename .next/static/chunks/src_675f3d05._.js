(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/stores/theme-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useThemeStore",
    ()=>useThemeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useThemeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        mode: "auto",
        resolved: "light",
        setMode: (mode)=>set({
                mode
            }),
        setResolved: (resolved)=>set({
                resolved
            })
    }), {
    name: "dashboard-theme"
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ThemeProvider(param) {
    let { children } = param;
    _s();
    const { mode, resolved, setResolved } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])();
    const applyTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[applyTheme]": ()=>{
            const root = document.documentElement;
            let next = resolved;
            if (mode === "auto") {
                next = "object" !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            } else {
                next = mode;
            }
            root.classList.remove("light", "dark");
            root.classList.add(next);
            setResolved(next);
        }
    }["ThemeProvider.useCallback[applyTheme]"], [
        mode,
        resolved,
        setResolved
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            applyTheme();
        }
    }["ThemeProvider.useEffect"], [
        applyTheme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if (mode !== "auto") return;
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            const handler = {
                "ThemeProvider.useEffect.handler": ()=>applyTheme()
            }["ThemeProvider.useEffect.handler"];
            mq.addEventListener("change", handler);
            return ({
                "ThemeProvider.useEffect": ()=>mq.removeEventListener("change", handler)
            })["ThemeProvider.useEffect"];
        }
    }["ThemeProvider.useEffect"], [
        mode,
        applyTheme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen transition-theme duration-theme",
        "data-theme": resolved,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/theme-provider.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "xYed3HFTG5Yi/URqL/xOYnojGls=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"]
    ];
});
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/screensaver-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getScreensaverBackgroundImage",
    ()=>getScreensaverBackgroundImage,
    "getScreensaverClock24h",
    ()=>getScreensaverClock24h,
    "getScreensaverDelaySeconds",
    ()=>getScreensaverDelaySeconds,
    "getScreensaverPexelsApiKey",
    ()=>getScreensaverPexelsApiKey,
    "getScreensaverPexelsEnabled",
    ()=>getScreensaverPexelsEnabled,
    "getScreensaverPexelsQuery",
    ()=>getScreensaverPexelsQuery,
    "getScreensaverWeatherEntityId",
    ()=>getScreensaverWeatherEntityId,
    "setScreensaverBackgroundImage",
    ()=>setScreensaverBackgroundImage,
    "setScreensaverClock24h",
    ()=>setScreensaverClock24h,
    "setScreensaverDelaySeconds",
    ()=>setScreensaverDelaySeconds,
    "setScreensaverPexelsApiKey",
    ()=>setScreensaverPexelsApiKey,
    "setScreensaverPexelsEnabled",
    ()=>setScreensaverPexelsEnabled,
    "setScreensaverPexelsQuery",
    ()=>setScreensaverPexelsQuery,
    "setScreensaverWeatherEntityId",
    ()=>setScreensaverWeatherEntityId
]);
const STORAGE_KEY_DELAY = "dashboard.screensaverDelaySeconds";
const STORAGE_KEY_LEGACY_MINUTES = "dashboard.screensaverMinutes";
const STORAGE_KEY_BACKGROUND = "dashboard.screensaverBackground";
function getScreensaverDelaySeconds() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        let v = localStorage.getItem(STORAGE_KEY_DELAY);
        if (v === null) {
            const legacy = localStorage.getItem(STORAGE_KEY_LEGACY_MINUTES);
            if (legacy !== null) {
                const min = parseInt(legacy, 10);
                if (Number.isFinite(min) && min >= 0) {
                    const sec = min * 60;
                    localStorage.setItem(STORAGE_KEY_DELAY, String(sec));
                    localStorage.removeItem(STORAGE_KEY_LEGACY_MINUTES);
                    return sec;
                }
            }
            return 0;
        }
        const n = parseInt(v, 10);
        return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch (e) {
        return 0;
    }
}
function setScreensaverDelaySeconds(seconds) {
    try {
        localStorage.setItem(STORAGE_KEY_DELAY, String(Math.max(0, Math.round(seconds))));
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch (e) {
    // ignore
    }
}
function getScreensaverBackgroundImage() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const v = localStorage.getItem(STORAGE_KEY_BACKGROUND);
        return typeof v === "string" ? v : "";
    } catch (e) {
        return "";
    }
}
function setScreensaverBackgroundImage(url) {
    try {
        localStorage.setItem(STORAGE_KEY_BACKGROUND, url || "");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch (e) {
    // ignore
    }
}
const STORAGE_KEY_CLOCK24 = "dashboard.screensaverClock24h";
function getScreensaverClock24h() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const v = localStorage.getItem(STORAGE_KEY_CLOCK24);
        if (v === "false") return false;
        if (v === "true") return true;
        return true;
    } catch (e) {
        return true;
    }
}
function setScreensaverClock24h(value) {
    try {
        localStorage.setItem(STORAGE_KEY_CLOCK24, value ? "true" : "false");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch (e) {
    // ignore
    }
}
const STORAGE_KEY_WEATHER_ENTITY = "dashboard.screensaverWeatherEntityId";
function getScreensaverWeatherEntityId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const v = localStorage.getItem(STORAGE_KEY_WEATHER_ENTITY);
        return v && v.length > 0 ? v : null;
    } catch (e) {
        return null;
    }
}
function setScreensaverWeatherEntityId(entityId) {
    try {
        localStorage.setItem(STORAGE_KEY_WEATHER_ENTITY, entityId !== null && entityId !== void 0 ? entityId : "");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch (e) {
    // ignore
    }
}
const STORAGE_KEY_PEXELS_ENABLED = "dashboard.screensaverPexelsEnabled";
const STORAGE_KEY_PEXELS_QUERY = "dashboard.screensaverPexelsQuery";
const STORAGE_KEY_PEXELS_API_KEY = "dashboard.screensaverPexelsApiKey";
function getScreensaverPexelsEnabled() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        return localStorage.getItem(STORAGE_KEY_PEXELS_ENABLED) === "true";
    } catch (e) {
        return false;
    }
}
function setScreensaverPexelsEnabled(enabled) {
    try {
        localStorage.setItem(STORAGE_KEY_PEXELS_ENABLED, enabled ? "true" : "false");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch (e) {
    // ignore
    }
}
function getScreensaverPexelsQuery() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const v = localStorage.getItem(STORAGE_KEY_PEXELS_QUERY);
        return typeof v === "string" && v.trim() ? v.trim() : "nature landscape";
    } catch (e) {
        return "nature landscape";
    }
}
function setScreensaverPexelsQuery(query) {
    try {
        localStorage.setItem(STORAGE_KEY_PEXELS_QUERY, query.trim() || "nature landscape");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch (e) {
    // ignore
    }
}
function getScreensaverPexelsApiKey() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const v = localStorage.getItem(STORAGE_KEY_PEXELS_API_KEY);
        return typeof v === "string" ? v : "";
    } catch (e) {
        return "";
    }
}
function setScreensaverPexelsApiKey(apiKey) {
    try {
        localStorage.setItem(STORAGE_KEY_PEXELS_API_KEY, apiKey.trim());
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch (e) {
    // ignore
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEntityStateStore",
    ()=>useEntityStateStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const useEntityStateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        states: {},
        updatedAt: null,
        error: null,
        refreshRequested: 0,
        setStates: (entities)=>{
            const states = {};
            for (const e of entities){
                states[e.entity_id] = e;
            }
            set({
                states,
                updatedAt: Date.now(),
                error: null
            });
        },
        updateEntityState: (entityId, patch)=>{
            const current = get().states[entityId];
            if (!current) return;
            set({
                states: {
                    ...get().states,
                    [entityId]: {
                        ...current,
                        ...patch
                    }
                },
                updatedAt: Date.now()
            });
        },
        setError: (error)=>set({
                error
            }),
        getState: (entityId)=>get().states[entityId],
        isOffline: ()=>get().error != null,
        requestRefresh: ()=>set((s)=>({
                    refreshRequested: s.refreshRequested + 1
                }))
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/screensaver.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScreensaverProvider",
    ()=>ScreensaverProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-client] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-fog.js [app-client] (ecmascript) <export default as CloudFog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-lightning.js [app-client] (ecmascript) <export default as CloudLightning>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-rain.js [app-client] (ecmascript) <export default as CloudRain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-snow.js [app-client] (ecmascript) <export default as CloudSnow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/screensaver-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
/** Standaard achtergrond wanneer er geen afbeelding is geüpload (zet bestand in public/default-screensaver.png). */ const DEFAULT_SCREENSAVER_IMAGE = "/default-screensaver.png";
const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll",
    "click"
];
const PHOTO_ROTATION_SECONDS = 10;
const FADE_DURATION_MS = 1500;
function useIdleScreensaver() {
    _s();
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timeoutSeconds, setTimeoutSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIdleScreensaver.useEffect": ()=>{
            const sec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverDelaySeconds"])();
            setTimeoutSeconds(sec);
            const onSettingChange = {
                "useIdleScreensaver.useEffect.onSettingChange": ()=>setTimeoutSeconds((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverDelaySeconds"])())
            }["useIdleScreensaver.useEffect.onSettingChange"];
            const onActivate = {
                "useIdleScreensaver.useEffect.onActivate": ()=>setActive(true)
            }["useIdleScreensaver.useEffect.onActivate"];
            window.addEventListener("screensaver-setting-changed", onSettingChange);
            window.addEventListener("screensaver-activate", onActivate);
            return ({
                "useIdleScreensaver.useEffect": ()=>{
                    window.removeEventListener("screensaver-setting-changed", onSettingChange);
                    window.removeEventListener("screensaver-activate", onActivate);
                }
            })["useIdleScreensaver.useEffect"];
        }
    }["useIdleScreensaver.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIdleScreensaver.useEffect": ()=>{
            if (timeoutSeconds <= 0) {
                setActive(false);
                return;
            }
            const delayMs = timeoutSeconds * 1000;
            let timeoutId = null;
            const resetTimer = {
                "useIdleScreensaver.useEffect.resetTimer": ()=>{
                    setActive(false);
                    if (timeoutId) clearTimeout(timeoutId);
                    timeoutId = setTimeout({
                        "useIdleScreensaver.useEffect.resetTimer": ()=>setActive(true)
                    }["useIdleScreensaver.useEffect.resetTimer"], delayMs);
                }
            }["useIdleScreensaver.useEffect.resetTimer"];
            resetTimer();
            const onActivity = {
                "useIdleScreensaver.useEffect.onActivity": ()=>resetTimer()
            }["useIdleScreensaver.useEffect.onActivity"];
            for (const ev of ACTIVITY_EVENTS){
                window.addEventListener(ev, onActivity, {
                    passive: true
                });
            }
            return ({
                "useIdleScreensaver.useEffect": ()=>{
                    for (const ev of ACTIVITY_EVENTS){
                        window.removeEventListener(ev, onActivity);
                    }
                    if (timeoutId) clearTimeout(timeoutId);
                }
            })["useIdleScreensaver.useEffect"];
        }
    }["useIdleScreensaver.useEffect"], [
        timeoutSeconds
    ]);
    return {
        active,
        setActive
    };
}
_s(useIdleScreensaver, "9H2c7lAJDeEokhL/ELrqeEq2Tvc=");
function ScreensaverWeatherIcon(param) {
    let { state } = param;
    var _state_toLowerCase;
    const s = (_state_toLowerCase = state === null || state === void 0 ? void 0 : state.toLowerCase()) !== null && _state_toLowerCase !== void 0 ? _state_toLowerCase : "";
    const iconClass = "h-6 w-6 shrink-0 text-white/90";
    if (s === "sunny" || s === "clear") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 78,
        columnNumber: 46
    }, this);
    if (s === "clear-night") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 79,
        columnNumber: 35
    }, this);
    if (s === "fog" || s === "mist") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__["CloudFog"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 80,
        columnNumber: 43
    }, this);
    if (s === "rainy" || s === "pouring" || s === "hail") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__["CloudRain"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 81,
        columnNumber: 64
    }, this);
    if (s === "snowy" || s === "snowy-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__["CloudSnow"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 82,
        columnNumber: 52
    }, this);
    if (s === "lightning" || s === "lightning-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__["CloudLightning"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 83,
        columnNumber: 60
    }, this);
    if (s === "windy" || s === "windy-variant") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 84,
        columnNumber: 54
    }, this);
    if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 85,
        columnNumber: 77
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 86,
        columnNumber: 10
    }, this);
}
_c = ScreensaverWeatherIcon;
function ScreensaverWeather() {
    var _entity_attributes;
    _s1();
    var _getScreensaverWeatherEntityId, _ref;
    const entityId = (_ref = (_getScreensaverWeatherEntityId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverWeatherEntityId"])()) !== null && _getScreensaverWeatherEntityId !== void 0 ? _getScreensaverWeatherEntityId : ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("dashboard.headerTemperatureEntityId") : "TURBOPACK unreachable") !== null && _ref !== void 0 ? _ref : "weather.home";
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "ScreensaverWeather.useEntityStateStore[entity]": (s)=>s.getState(entityId)
    }["ScreensaverWeather.useEntityStateStore[entity]"]);
    var _ref1;
    const condition = (_ref1 = entity === null || entity === void 0 ? void 0 : entity.state) !== null && _ref1 !== void 0 ? _ref1 : "";
    const temperature = (entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.temperature) != null ? Number(entity.attributes.temperature) : (entity === null || entity === void 0 ? void 0 : entity.state) != null && entityId.startsWith("sensor.") ? Number(entity.state) : undefined;
    const tempStr = temperature != null && !Number.isNaN(temperature) ? "".concat(Math.round(temperature), "°") : null;
    if (!tempStr && !condition) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 text-white/90 drop-shadow-md",
        children: [
            (condition || entityId.startsWith("weather.")) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverWeatherIcon, {
                state: condition
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this),
            tempStr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xl font-light tabular-nums",
                children: tempStr
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s1(ScreensaverWeather, "0Dpq8XOPxr5+xoZU8oNJeWvn+/k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c1 = ScreensaverWeather;
function ScreensaverClock() {
    _s2();
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ScreensaverClock.useState": ()=>new Date()
    }["ScreensaverClock.useState"]);
    const use24h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverClock24h"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScreensaverClock.useEffect": ()=>{
            const interval = setInterval({
                "ScreensaverClock.useEffect.interval": ()=>setTime(new Date())
            }["ScreensaverClock.useEffect.interval"], 1000);
            return ({
                "ScreensaverClock.useEffect": ()=>clearInterval(interval)
            })["ScreensaverClock.useEffect"];
        }
    }["ScreensaverClock.useEffect"], []);
    const timeStr = use24h ? "".concat(time.getHours().toString().padStart(2, "0"), ":").concat(time.getMinutes().toString().padStart(2, "0")) : "".concat(time.getHours() % 12 || 12, ":").concat(time.getMinutes().toString().padStart(2, "0"));
    const ampm = use24h ? null : time.getHours() < 12 ? "am" : "pm";
    const dateStr = time.toLocaleDateString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-end gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                dateTime: time.toISOString(),
                className: "text-5xl sm:text-6xl font-light tabular-nums text-white/90 drop-shadow-md",
                children: [
                    timeStr,
                    ampm != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-1.5 text-lg sm:text-xl font-normal text-white/70",
                        children: ampm
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-white/50 tabular-nums",
                children: dateStr
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_s2(ScreensaverClock, "sjdlyPivxnJhgdCBOvEiU9Pz9WE=");
_c2 = ScreensaverClock;
function ScreensaverOverlay(param) {
    let { onDismiss } = param;
    _s3();
    const customBg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverBackgroundImage"])();
    const pexelsEnabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverPexelsEnabled"])();
    const pexelsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverPexelsQuery"])();
    const pexelsApiKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverPexelsApiKey"])();
    const [currentImage, setCurrentImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nextImage, setNextImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentAttribution, setCurrentAttribution] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nextAttribution, setNextAttribution] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFading, setIsFading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageFailed, setImageFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pexelsError, setPexelsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchPexelsPhoto = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScreensaverOverlay.useCallback[fetchPexelsPhoto]": ()=>{
            if (!pexelsApiKey) return;
            setPexelsError(false);
            fetch("/api/pexels/photo?query=".concat(encodeURIComponent(pexelsQuery)), {
                headers: {
                    "X-Pexels-Api-Key": pexelsApiKey
                }
            }).then({
                "ScreensaverOverlay.useCallback[fetchPexelsPhoto]": (r)=>r.json()
            }["ScreensaverOverlay.useCallback[fetchPexelsPhoto]"]).then({
                "ScreensaverOverlay.useCallback[fetchPexelsPhoto]": (data)=>{
                    if (data === null || data === void 0 ? void 0 : data.imageUrl) {
                        const attr = data.pexelsUrl && data.photographer ? {
                            url: data.pexelsUrl,
                            photographer: data.photographer
                        } : null;
                        setCurrentImage({
                            "ScreensaverOverlay.useCallback[fetchPexelsPhoto]": (prev)=>{
                                if (prev) {
                                    setNextImage(data.imageUrl);
                                    setNextAttribution(attr);
                                    return prev;
                                }
                                setCurrentAttribution(attr);
                                return data.imageUrl;
                            }
                        }["ScreensaverOverlay.useCallback[fetchPexelsPhoto]"]);
                    } else {
                        setPexelsError(true);
                    }
                }
            }["ScreensaverOverlay.useCallback[fetchPexelsPhoto]"]).catch({
                "ScreensaverOverlay.useCallback[fetchPexelsPhoto]": ()=>setPexelsError(true)
            }["ScreensaverOverlay.useCallback[fetchPexelsPhoto]"]);
        }
    }["ScreensaverOverlay.useCallback[fetchPexelsPhoto]"], [
        pexelsApiKey,
        pexelsQuery
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScreensaverOverlay.useEffect": ()=>{
            if (customBg || !pexelsEnabled || !pexelsApiKey) return;
            fetchPexelsPhoto();
        }
    }["ScreensaverOverlay.useEffect"], [
        customBg,
        pexelsEnabled,
        pexelsApiKey,
        pexelsQuery,
        fetchPexelsPhoto
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScreensaverOverlay.useEffect": ()=>{
            if (customBg || !pexelsEnabled || !pexelsApiKey || !currentImage || nextImage) return;
            const interval = setInterval(fetchPexelsPhoto, PHOTO_ROTATION_SECONDS * 1000);
            return ({
                "ScreensaverOverlay.useEffect": ()=>clearInterval(interval)
            })["ScreensaverOverlay.useEffect"];
        }
    }["ScreensaverOverlay.useEffect"], [
        customBg,
        pexelsEnabled,
        pexelsApiKey,
        currentImage,
        nextImage,
        fetchPexelsPhoto
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScreensaverOverlay.useEffect": ()=>{
            if (!nextImage) return;
            const start = requestAnimationFrame({
                "ScreensaverOverlay.useEffect.start": ()=>setIsFading(true)
            }["ScreensaverOverlay.useEffect.start"]);
            return ({
                "ScreensaverOverlay.useEffect": ()=>cancelAnimationFrame(start)
            })["ScreensaverOverlay.useEffect"];
        }
    }["ScreensaverOverlay.useEffect"], [
        nextImage
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScreensaverOverlay.useEffect": ()=>{
            if (!isFading) return;
            const timer = setTimeout({
                "ScreensaverOverlay.useEffect.timer": ()=>{
                    setCurrentImage(nextImage);
                    setCurrentAttribution(nextAttribution);
                    setNextImage(null);
                    setNextAttribution(null);
                    setIsFading(false);
                }
            }["ScreensaverOverlay.useEffect.timer"], FADE_DURATION_MS);
            return ({
                "ScreensaverOverlay.useEffect": ()=>clearTimeout(timer)
            })["ScreensaverOverlay.useEffect"];
        }
    }["ScreensaverOverlay.useEffect"], [
        isFading,
        nextImage,
        nextAttribution
    ]);
    const usePexelsRotation = pexelsEnabled && !customBg && pexelsApiKey;
    const backgroundImage = customBg || currentImage || DEFAULT_SCREENSAVER_IMAGE;
    const useGradient = imageFailed || pexelsEnabled && !customBg && (pexelsError && !currentImage || !pexelsApiKey);
    const singleImage = !usePexelsRotation || !nextImage && !isFading;
    const fadeStyle = {
        transition: "opacity ".concat(FADE_DURATION_MS, "ms ease-in-out")
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "button",
        tabIndex: 0,
        "aria-label": "Screensaver aanraken om te sluiten",
        className: "fixed inset-0 z-[9999] flex items-end justify-end p-8 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        style: useGradient ? {
            background: "linear-gradient(to bottom right, #111827, #1f2937, #000)"
        } : undefined,
        onClick: onDismiss,
        onKeyDown: (e)=>{
            if (e.key === "Enter" || e.key === " ") onDismiss();
        },
        children: [
            !useGradient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    singleImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-cover bg-center bg-no-repeat",
                                style: {
                                    backgroundImage: "url(".concat(backgroundImage, ")")
                                },
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/screensaver.tsx",
                                lineNumber: 254,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 pointer-events-none",
                                "aria-hidden": true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: backgroundImage,
                                    alt: "",
                                    fill: true,
                                    sizes: "100vw",
                                    className: "sr-only",
                                    onError: ()=>setImageFailed(true),
                                    unoptimized: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/screensaver.tsx",
                                    lineNumber: 260,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/screensaver.tsx",
                                lineNumber: 259,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-cover bg-center bg-no-repeat",
                                style: {
                                    ...fadeStyle,
                                    backgroundImage: "url(".concat(currentImage, ")"),
                                    opacity: isFading ? 0 : 1
                                },
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/screensaver.tsx",
                                lineNumber: 273,
                                columnNumber: 15
                            }, this),
                            nextImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-cover bg-center bg-no-repeat",
                                style: {
                                    ...fadeStyle,
                                    backgroundImage: "url(".concat(nextImage, ")"),
                                    opacity: isFading ? 1 : 0
                                },
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/screensaver.tsx",
                                lineNumber: 283,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/50",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 295,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex flex-col items-end gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverWeather, {}, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 299,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverClock, {}, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this),
                    currentAttribution && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: currentAttribution.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-xs text-white/50 hover:text-white/70 transition-colors",
                        onClick: (e)=>e.stopPropagation(),
                        children: [
                            "Photo by ",
                            currentAttribution.photographer,
                            " on Pexels"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 302,
                        columnNumber: 11
                    }, this),
                    pexelsEnabled && !currentAttribution && !pexelsError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "https://www.pexels.com",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-xs text-white/50 hover:text-white/70 transition-colors",
                        onClick: (e)=>e.stopPropagation(),
                        children: "Photos provided by Pexels"
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 313,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 298,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 235,
        columnNumber: 5
    }, this);
}
_s3(ScreensaverOverlay, "IDgrTIDC3RVVmDpNt7rH5lgjJHQ=");
_c3 = ScreensaverOverlay;
function ScreensaverProvider(param) {
    let { children } = param;
    _s4();
    const { active, setActive } = useIdleScreensaver();
    const dismiss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScreensaverProvider.useCallback[dismiss]": ()=>setActive(false)
    }["ScreensaverProvider.useCallback[dismiss]"], [
        setActive
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            children,
            active && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverOverlay, {
                onDismiss: dismiss
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 339,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true);
}
_s4(ScreensaverProvider, "UanZlW5mxhBuWw/j17f4yHCq64g=", false, function() {
    return [
        useIdleScreensaver
    ];
});
_c4 = ScreensaverProvider;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "ScreensaverWeatherIcon");
__turbopack_context__.k.register(_c1, "ScreensaverWeather");
__turbopack_context__.k.register(_c2, "ScreensaverClock");
__turbopack_context__.k.register(_c3, "ScreensaverOverlay");
__turbopack_context__.k.register(_c4, "ScreensaverProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/use-entity-state.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEntityStatePolling",
    ()=>useEntityStatePolling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const POLL_INTERVAL_MS = 5000;
function useEntityStatePolling(connectionId) {
    _s();
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "useEntityStatePolling.useEntityStateStore[setStates]": (s)=>s.setStates
    }["useEntityStatePolling.useEntityStateStore[setStates]"]);
    const setError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "useEntityStatePolling.useEntityStateStore[setError]": (s)=>s.setError
    }["useEntityStatePolling.useEntityStateStore[setError]"]);
    const refreshRequested = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "useEntityStatePolling.useEntityStateStore[refreshRequested]": (s)=>s.refreshRequested
    }["useEntityStatePolling.useEntityStateStore[refreshRequested]"]);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useEntityStatePolling.useEffect": ()=>{
            const url = connectionId ? "/api/ha/state?connectionId=".concat(encodeURIComponent(connectionId)) : "/api/ha/state";
            function poll() {
                fetch(url).then({
                    "useEntityStatePolling.useEffect.poll": (res)=>{
                        if (!res.ok) throw new Error("Fetch failed");
                        return res.json();
                    }
                }["useEntityStatePolling.useEffect.poll"]).then({
                    "useEntityStatePolling.useEffect.poll": (data)=>{
                        if (Array.isArray(data)) setStates(data);
                    }
                }["useEntityStatePolling.useEffect.poll"]).catch({
                    "useEntityStatePolling.useEffect.poll": ()=>setError("No connection")
                }["useEntityStatePolling.useEffect.poll"]);
            }
            poll();
            intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
            return ({
                "useEntityStatePolling.useEffect": ()=>{
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            })["useEntityStatePolling.useEffect"];
        }
    }["useEntityStatePolling.useEffect"], [
        connectionId,
        setStates,
        setError
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useEntityStatePolling.useEffect": ()=>{
            if (refreshRequested > 0) {
                const url = connectionId ? "/api/ha/state?connectionId=".concat(encodeURIComponent(connectionId)) : "/api/ha/state";
                fetch(url).then({
                    "useEntityStatePolling.useEffect": (res)=>{
                        if (!res.ok) throw new Error("Fetch failed");
                        return res.json();
                    }
                }["useEntityStatePolling.useEffect"]).then({
                    "useEntityStatePolling.useEffect": (data)=>{
                        if (Array.isArray(data)) setStates(data);
                    }
                }["useEntityStatePolling.useEffect"]).catch({
                    "useEntityStatePolling.useEffect": ()=>setError("No connection")
                }["useEntityStatePolling.useEffect"]);
            }
        }
    }["useEntityStatePolling.useEffect"], [
        refreshRequested,
        connectionId,
        setStates,
        setError
    ]);
}
_s(useEntityStatePolling, "t1kjLW3yLci+5TbFCCVhqgAen5Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$screensaver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/screensaver.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-entity-state.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Providers(param) {
    let { children } = param;
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Providers.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000
                    }
                }
            })
    }["Providers.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EntityStatePoller, {}, void 0, false, {
                    fileName: "[project]/src/components/providers.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$screensaver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScreensaverProvider"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/providers.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/providers.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/providers.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_s(Providers, "EDhZMppT3uj6hsVhJR5npPD5uEI=");
_c = Providers;
function EntityStatePoller() {
    _s1();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStatePolling"])();
    return null;
}
_s1(EntityStatePoller, "swyMZoblbSOM1StNGZ8BufQ1xLs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStatePolling"]
    ];
});
_c1 = EntityStatePoller;
var _c, _c1;
__turbopack_context__.k.register(_c, "Providers");
__turbopack_context__.k.register(_c1, "EntityStatePoller");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/onboarding-completed.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOnboardingCompleted",
    ()=>getOnboardingCompleted,
    "setOnboardingCompleted",
    ()=>setOnboardingCompleted
]);
const KEY = "onboarding_completed";
function setOnboardingCompleted() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(KEY, "true");
}
function getOnboardingCompleted() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return window.localStorage.getItem(KEY) === "true";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/onboarding-guard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnboardingGuard",
    ()=>OnboardingGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/onboarding-completed.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function OnboardingGuard(param) {
    let { children } = param;
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [allowed, setAllowed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OnboardingGuard.useEffect": ()=>{
            const completed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOnboardingCompleted"])();
            const isOnboardingStart = pathname === "/onboarding/start";
            const isOnboardingWizard = pathname === "/onboarding";
            if (completed || isOnboardingStart || isOnboardingWizard) {
                setAllowed(true);
                return;
            }
            // Geen onboarding-flag in localStorage: check of er al een dashboard is (bijv. eerste start na deploy met bestaande data)
            fetch("/api/dashboard").then({
                "OnboardingGuard.useEffect": (r)=>r.json()
            }["OnboardingGuard.useEffect"]).then({
                "OnboardingGuard.useEffect": (d)=>{
                    if (d === null || d === void 0 ? void 0 : d.id) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setOnboardingCompleted"])();
                        setAllowed(true);
                        if (pathname === "/" || pathname === "/dashboards") {
                            router.replace("/dashboards/".concat(d.id));
                        }
                    } else {
                        router.replace("/onboarding/start");
                        setAllowed(false);
                    }
                }
            }["OnboardingGuard.useEffect"]).catch({
                "OnboardingGuard.useEffect": ()=>{
                    router.replace("/onboarding/start");
                    setAllowed(false);
                }
            }["OnboardingGuard.useEffect"]);
        }
    }["OnboardingGuard.useEffect"], [
        pathname,
        router
    ]);
    if (allowed === null || !allowed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-page-light dark:bg-dark-page",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent"
            }, void 0, false, {
                fileName: "[project]/src/components/onboarding-guard.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/onboarding-guard.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(OnboardingGuard, "WUfetaCDIdSlVsCHcopVhPPibIM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = OnboardingGuard;
var _c;
__turbopack_context__.k.register(_c, "OnboardingGuard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/page-background.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageBackgroundProvider",
    ()=>PageBackgroundProvider,
    "usePageBackground",
    ()=>usePageBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
function fetchBackground() {
    return fetch("/api/dashboard").then((r)=>r.json()).then((d)=>{
        var _d_background, _d_backgroundLight, _d_backgroundDark;
        return {
            background: (_d_background = d === null || d === void 0 ? void 0 : d.background) !== null && _d_background !== void 0 ? _d_background : null,
            backgroundLight: (_d_backgroundLight = d === null || d === void 0 ? void 0 : d.backgroundLight) !== null && _d_backgroundLight !== void 0 ? _d_backgroundLight : null,
            backgroundDark: (_d_backgroundDark = d === null || d === void 0 ? void 0 : d.backgroundDark) !== null && _d_backgroundDark !== void 0 ? _d_backgroundDark : null
        };
    }).catch(()=>({
            background: null,
            backgroundLight: null,
            backgroundDark: null
        }));
}
const PageBackgroundContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function usePageBackground() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PageBackgroundContext);
}
_s(usePageBackground, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function PageBackgroundProvider(param) {
    let { children } = param;
    _s1();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        background: null,
        backgroundLight: null,
        backgroundDark: null
    });
    const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])({
        "PageBackgroundProvider.useThemeStore[resolved]": (s)=>s.resolved
    }["PageBackgroundProvider.useThemeStore[resolved]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PageBackgroundProvider.useEffect": ()=>{
            fetchBackground().then(setData);
            const onUpdate = {
                "PageBackgroundProvider.useEffect.onUpdate": ()=>fetchBackground().then(setData)
            }["PageBackgroundProvider.useEffect.onUpdate"];
            window.addEventListener("page-background-changed", onUpdate);
            return ({
                "PageBackgroundProvider.useEffect": ()=>window.removeEventListener("page-background-changed", onUpdate)
            })["PageBackgroundProvider.useEffect"];
        }
    }["PageBackgroundProvider.useEffect"], []);
    var _ref, _ref1;
    const url = (_ref1 = (_ref = resolved === "dark" ? data.backgroundDark : data.backgroundLight) !== null && _ref !== void 0 ? _ref : data.background) !== null && _ref1 !== void 0 ? _ref1 : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PageBackgroundContext.Provider, {
        value: url,
        children: [
            url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat",
                style: {
                    backgroundImage: "url(".concat(url, ")")
                },
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/page-background.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this) : null,
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/page-background.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s1(PageBackgroundProvider, "1Mx6anmMu6TApmo/A2dkHf7YvuE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"]
    ];
});
_c = PageBackgroundProvider;
var _c;
__turbopack_context__.k.register(_c, "PageBackgroundProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_675f3d05._.js.map