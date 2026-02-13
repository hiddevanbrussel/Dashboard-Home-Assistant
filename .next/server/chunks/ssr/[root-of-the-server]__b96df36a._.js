module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/stores/theme-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useThemeStore",
    ()=>useThemeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
const useThemeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set)=>({
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
}),
"[project]/src/components/theme-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function ThemeProvider({ children }) {
    const { mode, resolved, setResolved } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeStore"])();
    const applyTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const root = document.documentElement;
        let next = resolved;
        if (mode === "auto") {
            next = "undefined" !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "TURBOPACK unreachable" : "light";
        } else {
            next = mode;
        }
        root.classList.remove("light", "dark");
        root.classList.add(next);
        setResolved(next);
    }, [
        mode,
        resolved,
        setResolved
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        applyTheme();
    }, [
        applyTheme
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mode !== "auto") return;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = ()=>applyTheme();
        mq.addEventListener("change", handler);
        return ()=>mq.removeEventListener("change", handler);
    }, [
        mode,
        applyTheme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen transition-theme duration-theme",
        "data-theme": resolved,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/theme-provider.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/stores/screensaver-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time truthy", 1) return 0;
    //TURBOPACK unreachable
    ;
}
function setScreensaverDelaySeconds(seconds) {
    try {
        localStorage.setItem(STORAGE_KEY_DELAY, String(Math.max(0, Math.round(seconds))));
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch  {
    // ignore
    }
}
function getScreensaverBackgroundImage() {
    if ("TURBOPACK compile-time truthy", 1) return "";
    //TURBOPACK unreachable
    ;
}
function setScreensaverBackgroundImage(url) {
    try {
        localStorage.setItem(STORAGE_KEY_BACKGROUND, url || "");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch  {
    // ignore
    }
}
const STORAGE_KEY_CLOCK24 = "dashboard.screensaverClock24h";
function getScreensaverClock24h() {
    if ("TURBOPACK compile-time truthy", 1) return true;
    //TURBOPACK unreachable
    ;
}
function setScreensaverClock24h(value) {
    try {
        localStorage.setItem(STORAGE_KEY_CLOCK24, value ? "true" : "false");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch  {
    // ignore
    }
}
const STORAGE_KEY_WEATHER_ENTITY = "dashboard.screensaverWeatherEntityId";
function getScreensaverWeatherEntityId() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function setScreensaverWeatherEntityId(entityId) {
    try {
        localStorage.setItem(STORAGE_KEY_WEATHER_ENTITY, entityId ?? "");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch  {
    // ignore
    }
}
const STORAGE_KEY_PEXELS_ENABLED = "dashboard.screensaverPexelsEnabled";
const STORAGE_KEY_PEXELS_QUERY = "dashboard.screensaverPexelsQuery";
const STORAGE_KEY_PEXELS_API_KEY = "dashboard.screensaverPexelsApiKey";
function getScreensaverPexelsEnabled() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
function setScreensaverPexelsEnabled(enabled) {
    try {
        localStorage.setItem(STORAGE_KEY_PEXELS_ENABLED, enabled ? "true" : "false");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch  {
    // ignore
    }
}
function getScreensaverPexelsQuery() {
    if ("TURBOPACK compile-time truthy", 1) return "nature landscape";
    //TURBOPACK unreachable
    ;
}
function setScreensaverPexelsQuery(query) {
    try {
        localStorage.setItem(STORAGE_KEY_PEXELS_QUERY, query.trim() || "nature landscape");
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch  {
    // ignore
    }
}
function getScreensaverPexelsApiKey() {
    if ("TURBOPACK compile-time truthy", 1) return "";
    //TURBOPACK unreachable
    ;
}
function setScreensaverPexelsApiKey(apiKey) {
    try {
        localStorage.setItem(STORAGE_KEY_PEXELS_API_KEY, apiKey.trim());
        window.dispatchEvent(new CustomEvent("screensaver-setting-changed"));
    } catch  {
    // ignore
    }
}
}),
"[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEntityStateStore",
    ()=>useEntityStateStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const useEntityStateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        states: {},
        updatedAt: null,
        error: null,
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
        isOffline: ()=>get().error != null
    }));
}),
"[project]/src/components/screensaver.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScreensaverProvider",
    ()=>ScreensaverProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-ssr] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-fog.js [app-ssr] (ecmascript) <export default as CloudFog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-lightning.js [app-ssr] (ecmascript) <export default as CloudLightning>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-rain.js [app-ssr] (ecmascript) <export default as CloudRain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-snow.js [app-ssr] (ecmascript) <export default as CloudSnow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/screensaver-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
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
function useIdleScreensaver() {
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timeoutSeconds, setTimeoutSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const sec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScreensaverDelaySeconds"])();
        setTimeoutSeconds(sec);
        const onSettingChange = ()=>setTimeoutSeconds((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScreensaverDelaySeconds"])());
        const onActivate = ()=>setActive(true);
        window.addEventListener("screensaver-setting-changed", onSettingChange);
        window.addEventListener("screensaver-activate", onActivate);
        return ()=>{
            window.removeEventListener("screensaver-setting-changed", onSettingChange);
            window.removeEventListener("screensaver-activate", onActivate);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (timeoutSeconds <= 0) {
            setActive(false);
            return;
        }
        const delayMs = timeoutSeconds * 1000;
        let timeoutId = null;
        const resetTimer = ()=>{
            setActive(false);
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(()=>setActive(true), delayMs);
        };
        resetTimer();
        const onActivity = ()=>resetTimer();
        for (const ev of ACTIVITY_EVENTS){
            window.addEventListener(ev, onActivity, {
                passive: true
            });
        }
        return ()=>{
            for (const ev of ACTIVITY_EVENTS){
                window.removeEventListener(ev, onActivity);
            }
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [
        timeoutSeconds
    ]);
    return {
        active,
        setActive
    };
}
function ScreensaverWeatherIcon({ state }) {
    const s = state?.toLowerCase() ?? "";
    const iconClass = "h-6 w-6 shrink-0 text-white/90";
    if (s === "sunny" || s === "clear") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 75,
        columnNumber: 46
    }, this);
    if (s === "clear-night") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 76,
        columnNumber: 35
    }, this);
    if (s === "fog" || s === "mist") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__["CloudFog"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 77,
        columnNumber: 43
    }, this);
    if (s === "rainy" || s === "pouring" || s === "hail") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__["CloudRain"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 78,
        columnNumber: 64
    }, this);
    if (s === "snowy" || s === "snowy-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__["CloudSnow"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 79,
        columnNumber: 52
    }, this);
    if (s === "lightning" || s === "lightning-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__["CloudLightning"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 80,
        columnNumber: 60
    }, this);
    if (s === "windy" || s === "windy-variant") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 81,
        columnNumber: 54
    }, this);
    if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 82,
        columnNumber: 77
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 83,
        columnNumber: 10
    }, this);
}
function ScreensaverWeather() {
    const entityId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScreensaverWeatherEntityId"])() ?? (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null) ?? "weather.home";
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entityId));
    const condition = entity?.state ?? "";
    const temperature = entity?.attributes?.temperature != null ? Number(entity.attributes.temperature) : entity?.state != null && entityId.startsWith("sensor.") ? Number(entity.state) : undefined;
    const tempStr = temperature != null && !Number.isNaN(temperature) ? `${Math.round(temperature)}°` : null;
    if (!tempStr && !condition) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 text-white/90 drop-shadow-md",
        children: [
            (condition || entityId.startsWith("weather.")) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverWeatherIcon, {
                state: condition
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 108,
                columnNumber: 9
            }, this),
            tempStr && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xl font-light tabular-nums",
                children: tempStr
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, this);
}
function ScreensaverClock() {
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new Date());
    const use24h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScreensaverClock24h"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>setTime(new Date()), 1000);
        return ()=>clearInterval(interval);
    }, []);
    const timeStr = use24h ? `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}` : `${time.getHours() % 12 || 12}:${time.getMinutes().toString().padStart(2, "0")}`;
    const ampm = use24h ? null : time.getHours() < 12 ? "am" : "pm";
    const dateStr = time.toLocaleDateString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-end gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("time", {
                dateTime: time.toISOString(),
                className: "text-5xl sm:text-6xl font-light tabular-nums text-white/90 drop-shadow-md",
                children: [
                    timeStr,
                    ampm != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-1.5 text-lg sm:text-xl font-normal text-white/70",
                        children: ampm
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-white/50 tabular-nums",
                children: dateStr
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
function ScreensaverOverlay({ onDismiss }) {
    const customBg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScreensaverBackgroundImage"])();
    const pexelsEnabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScreensaverPexelsEnabled"])();
    const pexelsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScreensaverPexelsQuery"])();
    const [pexelsImage, setPexelsImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pexelsAttribution, setPexelsAttribution] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [imageFailed, setImageFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pexelsError, setPexelsError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pexelsApiKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getScreensaverPexelsApiKey"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (customBg || !pexelsEnabled || !pexelsApiKey) return;
        setPexelsError(false);
        fetch(`/api/pexels/photo?query=${encodeURIComponent(pexelsQuery)}`, {
            headers: {
                "X-Pexels-Api-Key": pexelsApiKey
            }
        }).then((r)=>r.json()).then((data)=>{
            if (data?.imageUrl) {
                setPexelsImage(data.imageUrl);
                setPexelsAttribution(data.pexelsUrl && data.photographer ? {
                    url: data.pexelsUrl,
                    photographer: data.photographer
                } : null);
            } else {
                setPexelsError(true);
            }
        }).catch(()=>setPexelsError(true));
    }, [
        customBg,
        pexelsEnabled,
        pexelsQuery,
        pexelsApiKey
    ]);
    const backgroundImage = customBg || pexelsImage || DEFAULT_SCREENSAVER_IMAGE;
    const useGradient = imageFailed || pexelsEnabled && !customBg && (pexelsError && !pexelsImage || !pexelsApiKey);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            !useGradient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-cover bg-center bg-no-repeat",
                        style: {
                            backgroundImage: `url(${backgroundImage})`
                        },
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: backgroundImage,
                        alt: "",
                        className: "sr-only",
                        onError: ()=>setImageFailed(true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/50",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 216,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex flex-col items-end gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverWeather, {}, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverClock, {}, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this),
                    pexelsAttribution && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: pexelsAttribution.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-xs text-white/50 hover:text-white/70 transition-colors",
                        onClick: (e)=>e.stopPropagation(),
                        children: [
                            "Photo by ",
                            pexelsAttribution.photographer,
                            " on Pexels"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this),
                    pexelsEnabled && !pexelsAttribution && !pexelsError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "https://www.pexels.com",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "text-xs text-white/50 hover:text-white/70 transition-colors",
                        onClick: (e)=>e.stopPropagation(),
                        children: "Photos provided by Pexels"
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
}
function ScreensaverProvider({ children }) {
    const { active, setActive } = useIdleScreensaver();
    const dismiss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>setActive(false), []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            children,
            active && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverOverlay, {
                onDismiss: dismiss
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 260,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true);
}
}),
"[project]/src/hooks/use-entity-state.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEntityStatePolling",
    ()=>useEntityStatePolling
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
const POLL_INTERVAL_MS = 5000;
function useEntityStatePolling(connectionId) {
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const setError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setError);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const url = connectionId ? `/api/ha/state?connectionId=${encodeURIComponent(connectionId)}` : "/api/ha/state";
        function poll() {
            fetch(url).then((res)=>{
                if (!res.ok) throw new Error("Fetch failed");
                return res.json();
            }).then((data)=>{
                if (Array.isArray(data)) setStates(data);
            }).catch(()=>setError("No connection"));
        }
        poll();
        intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
        return ()=>{
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [
        connectionId,
        setStates,
        setError
    ]);
}
}),
"[project]/src/components/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$screensaver$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/screensaver.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-entity-state.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function Providers({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000
                }
            }
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EntityStatePoller, {}, void 0, false, {
                    fileName: "[project]/src/components/providers.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$screensaver$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ScreensaverProvider"], {
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
function EntityStatePoller() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStatePolling"])();
    return null;
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/src/lib/onboarding-completed.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOnboardingCompleted",
    ()=>getOnboardingCompleted,
    "setOnboardingCompleted",
    ()=>setOnboardingCompleted
]);
const KEY = "onboarding_completed";
function setOnboardingCompleted() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function getOnboardingCompleted() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/src/components/onboarding-guard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnboardingGuard",
    ()=>OnboardingGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/onboarding-completed.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function OnboardingGuard({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [allowed, setAllowed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const completed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOnboardingCompleted"])();
        const isOnboardingStart = pathname === "/onboarding/start";
        const isOnboardingWizard = pathname === "/onboarding";
        if (completed || isOnboardingStart || isOnboardingWizard) {
            setAllowed(true);
            return;
        }
        // Geen onboarding-flag in localStorage: check of er al een dashboard is (bijv. eerste start na deploy met bestaande data)
        fetch("/api/dashboard").then((r)=>r.json()).then((d)=>{
            if (d?.id) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setOnboardingCompleted"])();
                setAllowed(true);
                if (pathname === "/" || pathname === "/dashboards") {
                    router.replace(`/dashboards/${d.id}`);
                }
            } else {
                router.replace("/onboarding/start");
                setAllowed(false);
            }
        }).catch(()=>{
            router.replace("/onboarding/start");
            setAllowed(false);
        });
    }, [
        pathname,
        router
    ]);
    if (allowed === null || !allowed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-page-light dark:bg-dark-page",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/src/components/page-background.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageBackgroundProvider",
    ()=>PageBackgroundProvider,
    "usePageBackground",
    ()=>usePageBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function fetchBackground() {
    return fetch("/api/dashboard").then((r)=>r.json()).then((d)=>({
            background: d?.background ?? null,
            backgroundLight: d?.backgroundLight ?? null,
            backgroundDark: d?.backgroundDark ?? null
        })).catch(()=>({
            background: null,
            backgroundLight: null,
            backgroundDark: null
        }));
}
const PageBackgroundContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function usePageBackground() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(PageBackgroundContext);
}
function PageBackgroundProvider({ children }) {
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        background: null,
        backgroundLight: null,
        backgroundDark: null
    });
    const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeStore"])((s)=>s.resolved);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchBackground().then(setData);
        const onUpdate = ()=>fetchBackground().then(setData);
        window.addEventListener("page-background-changed", onUpdate);
        return ()=>window.removeEventListener("page-background-changed", onUpdate);
    }, []);
    const url = (resolved === "dark" ? data.backgroundDark : data.backgroundLight) ?? data.background ?? null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageBackgroundContext.Provider, {
        value: url,
        children: [
            url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat",
                style: {
                    backgroundImage: `url(${url})`
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
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b96df36a._.js.map