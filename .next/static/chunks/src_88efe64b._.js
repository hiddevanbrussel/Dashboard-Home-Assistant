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
    "getScreensaverMinutes",
    ()=>getScreensaverMinutes,
    "setScreensaverBackgroundImage",
    ()=>setScreensaverBackgroundImage,
    "setScreensaverMinutes",
    ()=>setScreensaverMinutes
]);
const STORAGE_KEY_MINUTES = "dashboard.screensaverMinutes";
const STORAGE_KEY_BACKGROUND = "dashboard.screensaverBackground";
function getScreensaverMinutes() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const v = localStorage.getItem(STORAGE_KEY_MINUTES);
        const n = v ? parseInt(v, 10) : 0;
        return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch (e) {
        return 0;
    }
}
function setScreensaverMinutes(minutes) {
    try {
        localStorage.setItem(STORAGE_KEY_MINUTES, String(Math.max(0, Math.round(minutes))));
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/screensaver-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
const ACTIVITY_EVENTS = [
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll",
    "click"
];
function useIdleScreensaver() {
    _s();
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [timeoutMinutes, setTimeoutMinutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIdleScreensaver.useEffect": ()=>{
            const minutes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverMinutes"])();
            setTimeoutMinutes(minutes);
            const onSettingChange = {
                "useIdleScreensaver.useEffect.onSettingChange": ()=>setTimeoutMinutes((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverMinutes"])())
            }["useIdleScreensaver.useEffect.onSettingChange"];
            window.addEventListener("screensaver-setting-changed", onSettingChange);
            return ({
                "useIdleScreensaver.useEffect": ()=>window.removeEventListener("screensaver-setting-changed", onSettingChange)
            })["useIdleScreensaver.useEffect"];
        }
    }["useIdleScreensaver.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useIdleScreensaver.useEffect": ()=>{
            if (timeoutMinutes <= 0) {
                setActive(false);
                return;
            }
            const delayMs = timeoutMinutes * 60 * 1000;
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
        timeoutMinutes
    ]);
    return {
        active,
        setActive
    };
}
_s(useIdleScreensaver, "QH3iGgj8IgNGwYPHH53h1yV+6tY=");
function ScreensaverClock() {
    _s1();
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ScreensaverClock.useState": ()=>new Date()
    }["ScreensaverClock.useState"]);
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
    const str = "".concat(time.getHours().toString().padStart(2, "0"), ":").concat(time.getMinutes().toString().padStart(2, "0"));
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
                children: str
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-white/50 tabular-nums",
                children: dateStr
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s1(ScreensaverClock, "sjdlyPivxnJhgdCBOvEiU9Pz9WE=");
_c = ScreensaverClock;
function ScreensaverOverlay(param) {
    let { onDismiss } = param;
    const backgroundImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverBackgroundImage"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "button",
        tabIndex: 0,
        "aria-label": "Screensaver aanraken om te sluiten",
        className: "fixed inset-0 z-[9999] flex items-end justify-end p-8 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        style: backgroundImage ? undefined : {
            background: "linear-gradient(to bottom right, #111827, #1f2937, #000)"
        },
        onClick: onDismiss,
        onKeyDown: (e)=>{
            if (e.key === "Enter" || e.key === " ") onDismiss();
        },
        children: [
            backgroundImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-cover bg-center bg-no-repeat",
                        style: {
                            backgroundImage: "url(".concat(backgroundImage, ")")
                        },
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 102,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/50",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/screensaver.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverClock, {}, void 0, false, {
                    fileName: "[project]/src/components/screensaver.tsx",
                    lineNumber: 111,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/screensaver.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_c1 = ScreensaverOverlay;
function ScreensaverProvider(param) {
    let { children } = param;
    _s2();
    const { active, setActive } = useIdleScreensaver();
    const dismiss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScreensaverProvider.useCallback[dismiss]": ()=>setActive(false)
    }["ScreensaverProvider.useCallback[dismiss]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            children,
            active && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScreensaverOverlay, {
                onDismiss: dismiss
            }, void 0, false, {
                fileName: "[project]/src/components/screensaver.tsx",
                lineNumber: 128,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true);
}
_s2(ScreensaverProvider, "UanZlW5mxhBuWw/j17f4yHCq64g=", false, function() {
    return [
        useIdleScreensaver
    ];
});
_c2 = ScreensaverProvider;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ScreensaverClock");
__turbopack_context__.k.register(_c1, "ScreensaverOverlay");
__turbopack_context__.k.register(_c2, "ScreensaverProvider");
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
;
var _s = __turbopack_context__.k.signature();
"use client";
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$screensaver$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScreensaverProvider"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/providers.tsx",
                lineNumber: 21,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/providers.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/providers.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_s(Providers, "EDhZMppT3uj6hsVhJR5npPD5uEI=");
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
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
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
function fetchBackground() {
    return fetch("/api/dashboard").then((r)=>r.json()).then((d)=>{
        var _d_background;
        return (_d_background = d === null || d === void 0 ? void 0 : d.background) !== null && _d_background !== void 0 ? _d_background : null;
    }).catch(()=>null);
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
    const [url, setUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PageBackgroundProvider.useEffect": ()=>{
            fetchBackground().then(setUrl);
            const onUpdate = {
                "PageBackgroundProvider.useEffect.onUpdate": ()=>fetchBackground().then(setUrl)
            }["PageBackgroundProvider.useEffect.onUpdate"];
            window.addEventListener("page-background-changed", onUpdate);
            return ({
                "PageBackgroundProvider.useEffect": ()=>window.removeEventListener("page-background-changed", onUpdate)
            })["PageBackgroundProvider.useEffect"];
        }
    }["PageBackgroundProvider.useEffect"], []);
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
                lineNumber: 35,
                columnNumber: 9
            }, this) : null,
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/page-background.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s1(PageBackgroundProvider, "2bP48bgC9x4MxGX+fFJYZwu2rfU=");
_c = PageBackgroundProvider;
var _c;
__turbopack_context__.k.register(_c, "PageBackgroundProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_88efe64b._.js.map