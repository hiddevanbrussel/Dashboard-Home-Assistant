(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/top-tabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopTabs",
    ()=>TopTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$door$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DoorOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/door-open.js [app-client] (ecmascript) <export default as DoorOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
"use client";
;
;
;
;
const tabs = [
    {
        href: "/dashboards",
        label: "Dashboard",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        href: "/energy",
        label: "Energy",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
    },
    {
        href: "/rooms",
        label: "Rooms",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$door$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DoorOpen$3e$__["DoorOpen"]
    },
    {
        href: "/devices",
        label: "Devices",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"]
    }
];
function TopTabs(param) {
    let { activeHref, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-1 rounded-full bg-black/5 px-1 py-1 dark:bg-white/5", className),
        role: "tablist",
        children: tabs.map((param)=>{
            let { href, label, icon: Icon, badge } = param;
            const isActive = activeHref === href;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                role: "tab",
                "aria-selected": isActive,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150", isActive ? "bg-white text-gray-900 shadow-sm dark:bg-white/95 dark:text-gray-900" : "text-gray-600 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: "h-4 w-4",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/top-tabs.tsx",
                        lineNumber: 48,
                        columnNumber: 13
                    }, this),
                    label,
                    badge != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-200 px-1.5 text-xs dark:bg-white/20",
                        children: badge
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/top-tabs.tsx",
                        lineNumber: 51,
                        columnNumber: 15
                    }, this)
                ]
            }, href, true, {
                fileName: "[project]/src/components/layout/top-tabs.tsx",
                lineNumber: 36,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/layout/top-tabs.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_c = TopTabs;
var _c;
__turbopack_context__.k.register(_c, "TopTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
"use client";
;
;
;
;
const mainIcons = [
    {
        href: "/dashboards",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
        label: "Home"
    },
    {
        href: "/settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        label: "Settings"
    }
];
function Sidebar(param) {
    let { activeHref, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-14 flex-col items-center gap-2 rounded-full bg-gray-900/90 py-3 dark:bg-black/40", className),
        "aria-label": "Sidebar",
        children: mainIcons.map((param)=>{
            let { href, icon: Icon, label } = param;
            const isActive = activeHref === href;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                "aria-label": label,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150", isActive ? "bg-white text-gray-900" : "text-white/80 hover:bg-white/15 hover:text-white"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "h-5 w-5"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/sidebar.tsx",
                    lineNumber: 40,
                    columnNumber: 13
                }, this)
            }, label, false, {
                fileName: "[project]/src/components/layout/sidebar.tsx",
                lineNumber: 29,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/layout/sidebar.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/floating-toolbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingToolbar",
    ()=>FloatingToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-client] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.js [app-client] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
"use client";
;
;
;
function FloatingToolbar(param) {
    let { className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-900/90 px-3 py-2 shadow-lg dark:bg-black/50", className),
        role: "toolbar",
        "aria-label": "Floating toolbar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Zoom in",
                className: "flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/floating-toolbar.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/floating-toolbar.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Zoom out",
                className: "flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/floating-toolbar.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/floating-toolbar.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Search",
                className: "flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/floating-toolbar.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/floating-toolbar.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Close",
                className: "flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/floating-toolbar.tsx",
                    lineNumber: 46,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/floating-toolbar.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/floating-toolbar.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = FloatingToolbar;
var _c;
__turbopack_context__.k.register(_c, "FloatingToolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/theme-switcher.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeSwitcher",
    ()=>ThemeSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ThemeSwitcher(param) {
    let { className } = param;
    _s();
    const { mode, setMode, resolved } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])();
    const effective = mode === "auto" ? resolved : mode;
    function handleToggle() {
        setMode(effective === "light" ? "dark" : "light");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: handleToggle,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center rounded-full bg-gray-100 p-0.5 dark:bg-white/10 transition-colors", className),
        "aria-label": effective === "light" ? "Switch to dark mode" : "Switch to light mode",
        title: effective === "light" ? "Dark mode" : "Light mode",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-8 w-8 items-center justify-center rounded-full transition-colors", effective === "light" ? "bg-white text-amber-600 shadow-sm dark:bg-white/20 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                    className: "h-4 w-4",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/theme-switcher.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/theme-switcher.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-8 w-8 items-center justify-center rounded-full transition-colors", effective === "dark" ? "bg-white text-indigo-500 shadow-sm dark:bg-white/20 dark:text-indigo-300" : "text-gray-500 dark:text-gray-400"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                    className: "h-4 w-4",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/theme-switcher.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/theme-switcher.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/theme-switcher.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(ThemeSwitcher, "QIAi96KtsMZ4hu4R65Pd60v4UyI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"]
    ];
});
_c = ThemeSwitcher;
var _c;
__turbopack_context__.k.register(_c, "ThemeSwitcher");
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
        setError: (error)=>set({
                error
            }),
        getState: (entityId)=>get().states[entityId],
        isOffline: ()=>get().error != null
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/app-shell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-client] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-fog.js [app-client] (ecmascript) <export default as CloudFog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-lightning.js [app-client] (ecmascript) <export default as CloudLightning>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-rain.js [app-client] (ecmascript) <export default as CloudRain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-snow.js [app-client] (ecmascript) <export default as CloudSnow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-client] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$top$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/top-tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$floating$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/floating-toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme-switcher.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$page$2d$background$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/page-background.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
async function fetchAndMergeEntityState(setStates) {
    try {
        const res = await fetch("/api/ha/state");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setStates(data);
    } catch (e) {
    // ignore
    }
}
const HEADER_TEMPERATURE_STORAGE_KEY = "dashboard.headerTemperatureEntityId";
const DEFAULT_TEMPERATURE_ENTITY = "sensor.weather_temperature";
function WeatherIcon(param) {
    let { state } = param;
    var _state_toLowerCase;
    const s = (_state_toLowerCase = state === null || state === void 0 ? void 0 : state.toLowerCase()) !== null && _state_toLowerCase !== void 0 ? _state_toLowerCase : "";
    const iconClass = "h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400";
    if (s === "sunny" || s === "clear") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 66,
        columnNumber: 46
    }, this);
    if (s === "clear-night") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 67,
        columnNumber: 35
    }, this);
    if (s === "fog" || s === "mist") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__["CloudFog"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 68,
        columnNumber: 43
    }, this);
    if (s === "rainy" || s === "pouring" || s === "hail") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__["CloudRain"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 69,
        columnNumber: 64
    }, this);
    if (s === "snowy" || s === "snowy-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__["CloudSnow"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 70,
        columnNumber: 52
    }, this);
    if (s === "lightning" || s === "lightning-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__["CloudLightning"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 71,
        columnNumber: 60
    }, this);
    if (s === "windy" || s === "windy-variant") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 72,
        columnNumber: 54
    }, this);
    if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 73,
        columnNumber: 77
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 74,
        columnNumber: 10
    }, this);
}
_c = WeatherIcon;
function TemperatureEntityModal(param) {
    let { onClose, onSelect } = param;
    _s();
    const [entities, setEntities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TemperatureEntityModal.useEffect": ()=>{
            fetch("/api/ha/entities").then({
                "TemperatureEntityModal.useEffect": (r)=>{
                    if (!r.ok) throw new Error("Failed to load");
                    return r.json();
                }
            }["TemperatureEntityModal.useEffect"]).then({
                "TemperatureEntityModal.useEffect": (data)=>{
                    const weather = data.filter({
                        "TemperatureEntityModal.useEffect.weather": (e)=>e.entity_id.startsWith("weather.")
                    }["TemperatureEntityModal.useEffect.weather"]);
                    setEntities(weather);
                    setError(null);
                }
            }["TemperatureEntityModal.useEffect"]).catch({
                "TemperatureEntityModal.useEffect": ()=>setError("Could not load weather entities.")
            }["TemperatureEntityModal.useEffect"]).finally({
                "TemperatureEntityModal.useEffect": ()=>setLoading(false)
            }["TemperatureEntityModal.useEffect"]);
        }
    }["TemperatureEntityModal.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-[101] bg-black/20 dark:bg-black/30 backdrop-blur-md",
                "aria-hidden": true,
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-[102] w-full max-w-sm rounded-2xl border-0 bg-white p-5 shadow-xl dark:bg-gray-800",
                onClick: (e)=>e.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-900 dark:text-white",
                                children: "Choose weather for temperature"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onClose,
                                className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700",
                                "aria-label": "Close",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 dark:text-gray-400",
                        children: "Loading…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-red-600 dark:text-red-400",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 130,
                        columnNumber: 11
                    }, this) : entities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 dark:text-gray-400",
                        children: "No weather entities found. Check your Home Assistant connection."
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "max-h-64 overflow-auto space-y-1",
                        children: entities.map((e)=>{
                            var _e_attributes;
                            var _ref;
                            const name = (_ref = (_e_attributes = e.attributes) === null || _e_attributes === void 0 ? void 0 : _e_attributes.friendly_name) !== null && _ref !== void 0 ? _ref : e.entity_id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: (ev)=>{
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        onSelect(e.entity_id);
                                        onClose();
                                    },
                                    className: "w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/10",
                                    children: name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 142,
                                    columnNumber: 19
                                }, this)
                            }, e.entity_id, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 141,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_s(TemperatureEntityModal, "W3g9ajxtOr3Ca7U2mhWuL/xEN5U=");
_c1 = TemperatureEntityModal;
function useTime24() {
    _s1();
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTime24.useEffect": ()=>{
            function update() {
                const now = new Date();
                setTime(now.toLocaleTimeString("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                }));
            }
            update();
            const id = setInterval(update, 1000);
            return ({
                "useTime24.useEffect": ()=>clearInterval(id)
            })["useTime24.useEffect"];
        }
    }["useTime24.useEffect"], []);
    return time;
}
_s1(useTime24, "BOCfeVG4OKCNzybCuynup9cQfu8=");
function AppShell(param) {
    let { children, activeTab = "/dashboards", showSidebar = true, showFloatingToolbar = false, welcomeBarAction, headerEndAction, welcomeTitle: welcomeTitleProp, welcomeSubtitle: welcomeSubtitleProp, welcomeEditable = false, onWelcomeChange, temperatureEntityId, className } = param;
    var _temperatureState_attributes;
    _s2();
    const defaultWelcomeTitle = "Hey, Fam van Brussel!";
    const defaultWelcomeSubtitle = "Control your home in one place!";
    const welcomeTitle = welcomeTitleProp !== null && welcomeTitleProp !== void 0 ? welcomeTitleProp : defaultWelcomeTitle;
    const welcomeSubtitle = welcomeSubtitleProp !== null && welcomeSubtitleProp !== void 0 ? welcomeSubtitleProp : defaultWelcomeSubtitle;
    const pageBackground = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$page$2d$background$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageBackground"])();
    const time24 = useTime24();
    const [temperatureModalOpen, setTemperatureModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chosenTemperatureEntityId, setChosenTemperatureEntityId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppShell.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            setChosenTemperatureEntityId(localStorage.getItem(HEADER_TEMPERATURE_STORAGE_KEY));
        }
    }["AppShell.useEffect"], []);
    var _ref;
    const effectiveTempEntity = temperatureEntityId === null ? undefined : (_ref = temperatureEntityId !== null && temperatureEntityId !== void 0 ? temperatureEntityId : chosenTemperatureEntityId) !== null && _ref !== void 0 ? _ref : DEFAULT_TEMPERATURE_ENTITY;
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "AppShell.useEntityStateStore[setStates]": (s)=>s.setStates
    }["AppShell.useEntityStateStore[setStates]"]);
    const temperatureState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "AppShell.useEntityStateStore[temperatureState]": (s)=>effectiveTempEntity ? s.getState(effectiveTempEntity) : undefined
    }["AppShell.useEntityStateStore[temperatureState]"]);
    var _ref1;
    const temperatureRaw = (_ref1 = temperatureState === null || temperatureState === void 0 ? void 0 : (_temperatureState_attributes = temperatureState.attributes) === null || _temperatureState_attributes === void 0 ? void 0 : _temperatureState_attributes.temperature) !== null && _ref1 !== void 0 ? _ref1 : (temperatureState === null || temperatureState === void 0 ? void 0 : temperatureState.state) != null ? Number(temperatureState.state) : undefined;
    const temperatureDisplay = temperatureRaw != null && !Number.isNaN(temperatureRaw) ? "".concat(Math.round(temperatureRaw), "°") : null;
    const saveChosenTemperatureEntity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AppShell.useCallback[saveChosenTemperatureEntity]": (entityId)=>{
            setChosenTemperatureEntityId(entityId);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem(HEADER_TEMPERATURE_STORAGE_KEY, entityId);
            }
            setTemperatureModalOpen(false);
            fetchAndMergeEntityState(setStates);
        }
    }["AppShell.useCallback[saveChosenTemperatureEntity]"], [
        setStates
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex min-h-screen flex-col", pageBackground ? "bg-white/85 dark:bg-black/50" : "bg-page-light dark:bg-dark-page", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex shrink-0 items-center border-b border-gray-200/50 px-4 py-3 dark:border-white/10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0 flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300",
                                "aria-live": "polite",
                                children: time24
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this),
                            effectiveTempEntity != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setTemperatureModalOpen(true),
                                className: "flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 transition-colors",
                                "aria-label": "Choose temperature entity",
                                children: [
                                    (effectiveTempEntity === null || effectiveTempEntity === void 0 ? void 0 : effectiveTempEntity.startsWith("weather.")) && (temperatureState === null || temperatureState === void 0 ? void 0 : temperatureState.state) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WeatherIcon, {
                                        state: temperatureState.state
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/app-shell.tsx",
                                        lineNumber: 255,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
                                        className: "h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/app-shell.tsx",
                                        lineNumber: 257,
                                        columnNumber: 17
                                    }, this),
                                    temperatureDisplay !== null && temperatureDisplay !== void 0 ? temperatureDisplay : "—"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 248,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center px-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$top$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TopTabs"], {
                            activeHref: activeTab
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/app-shell.tsx",
                            lineNumber: 264,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex items-center justify-end gap-2 min-w-0",
                        children: [
                            headerEndAction,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeSwitcher"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            temperatureModalOpen && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TemperatureEntityModal, {
                onClose: ()=>setTemperatureModalOpen(false),
                onSelect: saveChosenTemperatureEntity
            }, void 0, false, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 275,
                columnNumber: 11
            }, this), document.body),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 flex items-center justify-between gap-4 pl-10 pr-4 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: welcomeEditable && onWelcomeChange ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 max-w-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: welcomeTitle,
                                    onChange: (e)=>onWelcomeChange({
                                            title: e.target.value,
                                            subtitle: welcomeSubtitle
                                        }),
                                    className: "block w-full text-2xl md:text-3xl font-bold bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-white/20 rounded-lg px-2 py-1 -mx-2 text-gray-900 dark:text-white tracking-tight focus:outline-none focus:border-accent-purple dark:focus:border-accent-purple",
                                    placeholder: "Welkomsttitel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 286,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: welcomeSubtitle,
                                    onChange: (e)=>onWelcomeChange({
                                            title: welcomeTitle,
                                            subtitle: e.target.value
                                        }),
                                    className: "block w-full text-base md:text-lg font-normal bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-white/20 rounded-lg px-2 py-1 -mx-2 text-gray-600 dark:text-gray-300 focus:outline-none focus:border-accent-purple dark:focus:border-accent-purple",
                                    placeholder: "Ondertitel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 298,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/app-shell.tsx",
                            lineNumber: 285,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight",
                                    children: welcomeTitle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 313,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base md:text-lg font-normal text-gray-600 dark:text-gray-300 mt-1.5",
                                    children: welcomeSubtitle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 316,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, this),
                    welcomeBarAction != null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 shrink-0",
                        children: welcomeBarAction
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 323,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 282,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 overflow-hidden relative",
                children: [
                    showSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed left-0 top-[8rem] bottom-0 z-10 w-[88px] pl-8 flex flex-col items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                            activeHref: activeTab
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/app-shell.tsx",
                            lineNumber: 332,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 331,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 overflow-auto p-4 min-w-0", showSidebar && "ml-[88px]"),
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this),
            showFloatingToolbar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$floating$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingToolbar"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 345,
                columnNumber: 31
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 233,
        columnNumber: 5
    }, this);
}
_s2(AppShell, "b46t/kaeRdpuNCxlGKlOy3XDhtM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$page$2d$background$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageBackground"],
        useTime24,
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c2 = AppShell;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "WeatherIcon");
__turbopack_context__.k.register(_c1, "TemperatureEntityModal");
__turbopack_context__.k.register(_c2, "AppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/glass-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlassCard",
    ()=>GlassCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
function GlassCard(param) {
    let { children, className, as: Component = "div" } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("glass-card rounded-card border border-white/60 p-4 dark:border-white/10", "transition-shadow duration-150 hover:shadow-lg dark:hover:shadow-glass-dark", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/layout/glass-card.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = GlassCard;
var _c;
__turbopack_context__.k.register(_c, "GlassCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/energy-usage-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnergyUsageWidget",
    ()=>EnergyUsageWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function EnergyUsageWidget(param) {
    let { title = "Energy Usage", value = 65, label = "Medium", size = "md", className } = param;
    const pct = Math.min(100, Math.max(0, value !== null && value !== void 0 ? value : 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-card-title font-medium mb-2",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/energy-usage-widget.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-2xl font-bold text-accent-yellow dark:text-accent-green",
                        children: [
                            pct,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/energy-usage-widget.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-gray-500 dark:text-gray-400",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/energy-usage-widget.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/energy-usage-widget.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-3 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-full rounded-full transition-all duration-300", "bg-gradient-to-r from-accent-yellow to-accent-green dark:from-accent-green dark:to-accent-yellow"),
                    style: {
                        width: "".concat(pct, "%")
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/energy-usage-widget.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/energy-usage-widget.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/energy-usage-widget.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = EnergyUsageWidget;
var _c;
__turbopack_context__.k.register(_c, "EnergyUsageWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/light-control-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LightControlWidget",
    ()=>LightControlWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function LightControlWidget(param) {
    let { title = "Light", entity_id, state = "off", size = "md", className } = param;
    var _entityState_attributes;
    _s();
    const isOn = state === "on";
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sliderBrightness, setSliderBrightness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "LightControlWidget.useEntityStateStore[setStates]": (s)=>s.setStates
    }["LightControlWidget.useEntityStateStore[setStates]"]);
    const entityState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "LightControlWidget.useEntityStateStore[entityState]": (s)=>s.getState(entity_id)
    }["LightControlWidget.useEntityStateStore[entityState]"]);
    var _ref;
    const brightnessRaw = (_ref = entityState === null || entityState === void 0 ? void 0 : (_entityState_attributes = entityState.attributes) === null || _entityState_attributes === void 0 ? void 0 : _entityState_attributes.brightness) !== null && _ref !== void 0 ? _ref : 0;
    const brightnessPct = Math.round(brightnessRaw / 255 * 100);
    const displayBrightness = modalOpen ? sliderBrightness : brightnessPct;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LightControlWidget.useEffect": ()=>{
            setSliderBrightness(brightnessPct);
        }
    }["LightControlWidget.useEffect"], [
        brightnessPct
    ]);
    const refreshState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LightControlWidget.useCallback[refreshState]": async ()=>{
            const res = await fetch("/api/ha/state").then({
                "LightControlWidget.useCallback[refreshState]": (r)=>r.json()
            }["LightControlWidget.useCallback[refreshState]"]);
            if (Array.isArray(res)) setStates(res);
        }
    }["LightControlWidget.useCallback[refreshState]"], [
        setStates
    ]);
    async function callLight(service, serviceData) {
        setLoading(true);
        try {
            const res = await fetch("/api/ha/call-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entity_id,
                    domain: "light",
                    service,
                    service_data: serviceData
                })
            });
            if (res.ok) await refreshState();
            else {
                const data = await res.json().catch(()=>({}));
                console.error("Light service failed:", data.error);
            }
        } finally{
            setLoading(false);
        }
    }
    function handleCardClick() {
        setModalOpen(true);
    }
    async function handleIconClick(e) {
        e.preventDefault();
        e.stopPropagation();
        await callLight("toggle");
    }
    async function handleModalToggle() {
        await callLight(isOn ? "turn_off" : "turn_on", isOn ? undefined : {
            brightness_pct: brightnessPct || 100
        });
    }
    const brightnessTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    function handleBrightnessChange(pct) {
        setSliderBrightness(pct);
        if (brightnessTimeoutRef.current) clearTimeout(brightnessTimeoutRef.current);
        brightnessTimeoutRef.current = setTimeout(()=>{
            callLight("turn_on", {
                brightness_pct: pct
            });
            brightnessTimeoutRef.current = null;
        }, 120);
    }
    const iconSizes = {
        sm: "h-5 w-5",
        md: "h-6 w-6",
        lg: "h-7 w-7"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "button",
                tabIndex: 0,
                onClick: handleCardClick,
                onKeyDown: (e)=>{
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCardClick();
                    }
                },
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-start gap-3 rounded-2xl text-left transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4D2FB2] cursor-pointer", isOn ? "bg-white shadow-sm dark:bg-white" : "bg-white/60 dark:bg-white/10 backdrop-blur-md", size === "sm" && "p-3", size === "md" && "p-4", size === "lg" && "p-5", className),
                "aria-label": "Open ".concat(title, " controls"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleIconClick,
                        disabled: loading,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4D2FB2] disabled:opacity-70", isOn ? "" : "bg-white/50 dark:bg-white/10 backdrop-blur-md", size === "sm" && "h-9 w-9", size === "md" && "h-10 w-10", size === "lg" && "h-11 w-11"),
                        style: isOn ? {
                            backgroundColor: "#FFD41D"
                        } : undefined,
                        "aria-label": isOn ? "Turn off ".concat(title) : "Turn on ".concat(title),
                        "aria-pressed": isOn,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(iconSizes[size], "transition-colors duration-300 ease-out", isOn ? "text-white" : "text-[#FFD41D]"),
                            strokeWidth: 1.5,
                            fill: isOn ? "currentColor" : "none"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold truncate", isOn ? "text-gray-900" : "text-gray-900 dark:text-white", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg"),
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-medium", size === "sm" && "text-xs", size === "md" && "text-sm", size === "lg" && "text-base", isOn ? "text-gray-700" : "text-gray-500 dark:text-gray-400"),
                                children: isOn ? "On" : "Off"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            modalOpen && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-md transition-opacity duration-200 ease-out",
                        "aria-hidden": true,
                        onClick: ()=>setModalOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                        lineNumber: 171,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-50 w-full max-w-sm rounded-2xl border-0 bg-gray-800 p-6 shadow-xl dark:bg-gray-900 transition-transform duration-300 ease-out",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-white truncate",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                        lineNumber: 178,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-white/80 mt-0.5",
                                        children: [
                                            displayBrightness,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                        lineNumber: 181,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                lineNumber: 177,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center gap-4 mt-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center gap-2 touch-none select-none",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-24 h-56 flex flex-col items-center",
                                        style: {
                                            touchAction: "none"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-0 left-1/2 -translate-x-1/2 w-16 h-52 rounded-full bg-gray-600 flex flex-col justify-end overflow-hidden pointer-events-none",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full rounded-full bg-white min-h-0 shrink-0 will-change-[height]",
                                                    style: {
                                                        height: "".concat(displayBrightness, "%"),
                                                        transition: "height 0.2s ease-out"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                                lineNumber: 191,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: 0,
                                                max: 100,
                                                value: displayBrightness,
                                                onInput: (e)=>handleBrightnessChange(Number(e.target.value)),
                                                onChange: (e)=>handleBrightnessChange(Number(e.target.value)),
                                                disabled: loading,
                                                className: "absolute top-0 left-1/2 w-52 h-24 -translate-x-1/2 -rotate-90 origin-center opacity-0 cursor-ns-resize disabled:cursor-not-allowed",
                                                style: {
                                                    pointerEvents: "auto"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                                lineNumber: 201,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: handleModalToggle,
                                                disabled: loading,
                                                className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full disabled:opacity-60 transition-opacity duration-300 ease-out",
                                                "aria-label": isOn ? "Turn off" : "Turn on",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                                    className: "h-6 w-6 text-[#FFD41D] transition-opacity duration-300 ease-out",
                                                    strokeWidth: 1.5,
                                                    fill: "currentColor"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                                    lineNumber: 220,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                                lineNumber: 213,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                        lineNumber: 189,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                    lineNumber: 188,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                lineNumber: 186,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                        lineNumber: 176,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                lineNumber: 170,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true);
}
_s(LightControlWidget, "Hs2Izs8jz9dOjuQGKUhK/KB2Kms=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = LightControlWidget;
var _c;
__turbopack_context__.k.register(_c, "LightControlWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/wifi-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WifiWidget",
    ()=>WifiWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wifi.js [app-client] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function WifiWidget(param) {
    let { title = "Wi-Fi", value = "on", size = "md", className } = param;
    const on = value === "on";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4 flex items-center justify-between", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-6 w-6 text-accent-orange", !on && "opacity-50 text-gray-400")
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/wifi-widget.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-card-title font-medium",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/wifi-widget.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/wifi-widget.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                role: "switch",
                "aria-checked": on,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors", on ? "bg-accent-green dark:bg-accent-green" : "bg-gray-300 dark:bg-white/20"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition", on ? "translate-x-5" : "translate-x-1")
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/wifi-widget.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/wifi-widget.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/wifi-widget.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = WifiWidget;
var _c;
__turbopack_context__.k.register(_c, "WifiWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/solar-charge-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SolarChargeWidget",
    ()=>SolarChargeWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const DEFAULT_DATA = [
    {
        date: "Mon",
        value: 8.2
    },
    {
        date: "Tue",
        value: 10.1
    },
    {
        date: "Wed",
        value: 12.4
    },
    {
        date: "Thu",
        value: 9.8
    },
    {
        date: "Fri",
        value: 11.2
    },
    {
        date: "Sat",
        value: 14.0
    },
    {
        date: "Sun",
        value: 12.4
    }
];
function SolarChargeWidget(param) {
    let { title = "Solar Charge Collected Today", value = 12.4, unit = "kWh", data = DEFAULT_DATA, size = "md", className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-card-title font-medium mb-2",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-2xl font-bold text-accent-orange mb-4",
                children: [
                    value,
                    " ",
                    unit
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-32 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                    width: "100%",
                    height: "100%",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineChart"], {
                        data: data,
                        margin: {
                            top: 4,
                            right: 4,
                            bottom: 0,
                            left: 4
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                dataKey: "date",
                                tick: {
                                    fontSize: 10
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                hide: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                contentStyle: {
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.2)"
                                },
                                formatter: (v)=>[
                                        "".concat(v, " ").concat(unit),
                                        "Value"
                                    ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                                type: "monotone",
                                dataKey: "value",
                                stroke: "var(--accent-orange)",
                                strokeWidth: 2,
                                dot: {
                                    r: 3
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c = SolarChargeWidget;
var _c;
__turbopack_context__.k.register(_c, "SolarChargeWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/climate-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClimateWidget",
    ()=>ClimateWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function ClimateWidget(param) {
    let { title = "Climate", value = 23, unit = "°", state: climateState = "heat", size = "md", className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-card-title font-medium",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-widget.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        role: "switch",
                        "aria-label": "Toggle",
                        className: "relative inline-flex h-6 w-11 shrink-0 rounded-full bg-accent-green dark:bg-accent-green border-2 border-transparent"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-widget.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-widget.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-metric font-bold text-center text-accent-orange dark:text-accent-green my-4",
                children: [
                    value,
                    unit
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-widget.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1 justify-center text-xs text-gray-500 dark:text-gray-400",
                children: [
                    "6h",
                    "12h",
                    "18h",
                    "24h"
                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-2 py-1 rounded bg-white/5",
                        children: t
                    }, t, false, {
                        fileName: "[project]/src/components/widgets/climate-widget.tsx",
                        lineNumber: 39,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/climate-widget.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/climate-widget.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = ClimateWidget;
var _c;
__turbopack_context__.k.register(_c, "ClimateWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/lighting-brightness-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LightingBrightnessWidget",
    ()=>LightingBrightnessWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function LightingBrightnessWidget(param) {
    let { title = "Lighting Brightness", value = 70, size = "md", className } = param;
    const pct = Math.min(100, Math.max(0, value !== null && value !== void 0 ? value : 0));
    const rotation = -90 + pct / 100 * 180;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-card-title font-medium mb-4 text-center",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-32 h-24 mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 100 60",
                        className: "w-full h-full",
                        "aria-hidden": true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M 10 50 A 40 40 0 0 1 90 50",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "8",
                                className: "text-gray-200 dark:text-white/10"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M 10 50 A 40 40 0 0 1 90 50",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "8",
                                strokeLinecap: "round",
                                className: "text-accent-yellow dark:text-accent-green",
                                strokeDasharray: "".concat(pct / 100 * 125.6, " 125.6")
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "50",
                                y1: "50",
                                x2: "50",
                                y2: "18",
                                stroke: "currentColor",
                                strokeWidth: "3",
                                className: "text-accent-orange",
                                transform: "rotate(".concat(rotation, " 50 50)")
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-xl font-bold text-accent-yellow dark:text-accent-green mt-1",
                        children: [
                            pct,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = LightingBrightnessWidget;
var _c;
__turbopack_context__.k.register(_c, "LightingBrightnessWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/media-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MediaCardWidget",
    ()=>MediaCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/skip-back.js [app-client] (ecmascript) <export default as SkipBack>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/skip-forward.js [app-client] (ecmascript) <export default as SkipForward>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/disc-3.js [app-client] (ecmascript) <export default as Disc3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function formatTime(seconds) {
    if (seconds == null || Number.isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return "".concat(m, ":").concat(s.toString().padStart(2, "0"));
}
function MediaCardWidget(param) {
    let { title = "Media", entity_id, size = "md", className } = param;
    var _entity_attributes, _entity_attributes1, _entity_attributes2, _entity_attributes3, _entity_attributes4, _entity_attributes5;
    _s();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "MediaCardWidget.useEntityStateStore[entity]": (s)=>s.getState(entity_id)
    }["MediaCardWidget.useEntityStateStore[entity]"]);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "MediaCardWidget.useEntityStateStore[setStates]": (s)=>s.setStates
    }["MediaCardWidget.useEntityStateStore[setStates]"]);
    const updatedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "MediaCardWidget.useEntityStateStore[updatedAt]": (s)=>s.updatedAt
    }["MediaCardWidget.useEntityStateStore[updatedAt]"]);
    const isOn = (entity === null || entity === void 0 ? void 0 : entity.state) !== "off" && (entity === null || entity === void 0 ? void 0 : entity.state) !== "unavailable" && (entity === null || entity === void 0 ? void 0 : entity.state) !== "unknown";
    const isPlaying = (entity === null || entity === void 0 ? void 0 : entity.state) === "playing";
    var _ref;
    const mediaTitle = (_ref = entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.media_title) !== null && _ref !== void 0 ? _ref : "";
    var _ref1;
    const mediaArtist = (_ref1 = entity === null || entity === void 0 ? void 0 : (_entity_attributes1 = entity.attributes) === null || _entity_attributes1 === void 0 ? void 0 : _entity_attributes1.media_artist) !== null && _ref1 !== void 0 ? _ref1 : "";
    const entityPicture = entity === null || entity === void 0 ? void 0 : (_entity_attributes2 = entity.attributes) === null || _entity_attributes2 === void 0 ? void 0 : _entity_attributes2.entity_picture;
    const duration = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes3 = entity.attributes) === null || _entity_attributes3 === void 0 ? void 0 : _entity_attributes3.media_duration) || 0;
    const position = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes4 = entity.attributes) === null || _entity_attributes4 === void 0 ? void 0 : _entity_attributes4.media_position) || 0;
    const deviceName = (entity === null || entity === void 0 ? void 0 : (_entity_attributes5 = entity.attributes) === null || _entity_attributes5 === void 0 ? void 0 : _entity_attributes5.friendly_name) || entity_id;
    async function callMedia(service) {
        setLoading(true);
        try {
            const res = await fetch("/api/ha/call-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entity_id,
                    domain: "media_player",
                    service
                })
            });
            if (res.ok) {
                const data = await fetch("/api/ha/state").then((r)=>r.json());
                if (Array.isArray(data)) setStates(data);
            }
        } finally{
            setLoading(false);
        }
    }
    function handlePlayPause() {
        callMedia("media_play_pause");
    }
    function handlePrevious() {
        callMedia("media_previous_track");
    }
    function handleNext() {
        callMedia("media_next_track");
    }
    // Baseline voor interpolatie: alleen bijwerken bij echte HA-updates, niet bij elke re-render
    const baselineRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        position: 0,
        at: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MediaCardWidget.useEffect": ()=>{
            if (updatedAt != null && position >= 0) {
                baselineRef.current = {
                    position,
                    at: updatedAt
                };
            }
        }
    }["MediaCardWidget.useEffect"], [
        position,
        updatedAt
    ]);
    // Elke seconde re-renderen om tijd/progress te updaten; baseline staat in ref dus herstart niet
    const [, setTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MediaCardWidget.useEffect": ()=>{
            if (!isPlaying || duration <= 0) return;
            const interval = setInterval({
                "MediaCardWidget.useEffect.interval": ()=>setTick({
                        "MediaCardWidget.useEffect.interval": (t)=>t + 1
                    }["MediaCardWidget.useEffect.interval"])
            }["MediaCardWidget.useEffect.interval"], 1000);
            return ({
                "MediaCardWidget.useEffect": ()=>clearInterval(interval)
            })["MediaCardWidget.useEffect"];
        }
    }["MediaCardWidget.useEffect"], [
        isPlaying,
        duration
    ]);
    const { position: basePos, at: baseAt } = baselineRef.current;
    const displayPosition = isPlaying && duration > 0 && position >= 0 ? Math.min(duration, basePos + (Date.now() - baseAt) / 1000) : position;
    const progressPct = duration > 0 ? Math.min(100, displayPosition / duration * 100) : 0;
    // Unieke URL per nummer zodat de afbeelding ververst bij trackwissel (geen oude cache)
    const mediaImageSrc = (entityPicture === null || entityPicture === void 0 ? void 0 : entityPicture.startsWith("http")) ? entityPicture : entityPicture ? "/api/ha/media-image?entity_id=".concat(encodeURIComponent(entity_id), "&v=").concat(encodeURIComponent(entityPicture)) : null;
    // Key per nummer: oude afbeelding verdwijnt direct bij trackwissel, nieuwe laadt in
    const trackKey = [
        mediaTitle,
        entityPicture
    ].filter(Boolean).join("|") || "none";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pt-4 pb-2",
                        children: [
                            mediaImageSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setExpanded(false),
                                className: "block relative w-full aspect-square max-h-48 mx-auto rounded-xl overflow-hidden bg-white/5 hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50",
                                "aria-label": "Inklappen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: mediaImageSrc,
                                    alt: "",
                                    className: "w-full h-full object-cover pointer-events-none"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 138,
                                    columnNumber: 17
                                }, this)
                            }, trackKey, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 131,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full aspect-square max-h-48 mx-auto rounded-xl bg-white/5 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
                                    className: "h-16 w-16 text-white/20"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 146,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 145,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-1 rounded-full bg-white/20 overflow-hidden",
                                        role: "progressbar",
                                        "aria-valuenow": displayPosition,
                                        "aria-valuemin": 0,
                                        "aria-valuemax": duration,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full rounded-full bg-white transition-all duration-300",
                                            style: {
                                                width: "".concat(progressPct, "%")
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                            lineNumber: 157,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-xs text-white/60",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: formatTime(displayPosition)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                                lineNumber: 163,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: formatTime(duration)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 129,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setExpanded(false),
                        className: "flex items-center justify-center gap-1 py-1 text-white/50 hover:text-white/80 transition-colors",
                        "aria-label": "Inklappen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 168,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden",
                children: [
                    mediaImageSrc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        "aria-hidden": true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: mediaImageSrc,
                                alt: "",
                                className: "absolute inset-0 h-full w-full object-cover scale-105 blur-md opacity-70"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 183,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-black/40"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex items-center gap-3 px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5", isPlaying && "animate-spin"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
                                    className: "h-5 w-5 text-white/80",
                                    strokeWidth: 1.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 198,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium truncate text-white/90",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                        lineNumber: 201,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/60 truncate",
                                        children: deviceName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            mediaImageSrc ? !expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setExpanded(true),
                                className: "h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/20 hover:border-white/40 hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50",
                                "aria-label": "Uitklappen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: mediaImageSrc,
                                    alt: "",
                                    className: "h-full w-full object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 213,
                                    columnNumber: 15
                                }, this)
                            }, trackKey, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: mediaImageSrc,
                                    alt: "",
                                    className: "h-full w-full object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this)
                            }, trackKey, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this) : !expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setExpanded(true),
                                className: "h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center hover:border-white/40 hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50",
                                "aria-label": "Uitklappen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
                                    className: "h-5 w-5 text-white/30",
                                    strokeWidth: 1.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 235,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
                                    className: "h-5 w-5 text-white/30",
                                    strokeWidth: 1.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 238,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 px-4 py-3 bg-black/20 dark:bg-black/30 backdrop-blur-md rounded-b-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium truncate text-sm",
                                children: mediaTitle || "—"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60 truncate",
                                children: mediaArtist || "—"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handlePrevious,
                                disabled: loading || !isOn,
                                className: "p-2 rounded-full text-white/80 hover:bg-white/10 disabled:opacity-40",
                                "aria-label": "Previous",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__["SkipBack"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 256,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handlePlayPause,
                                disabled: loading || !isOn,
                                className: "p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-40",
                                "aria-label": isPlaying ? "Pause" : "Play",
                                children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 273,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                    className: "h-4 w-4 ml-0.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 275,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleNext,
                                disabled: loading || !isOn,
                                className: "p-2 rounded-full text-white/80 hover:bg-white/10 disabled:opacity-40",
                                "aria-label": "Next",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__["SkipForward"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 285,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 255,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_s(MediaCardWidget, "+N+ScMdllq6l/yeL1g4CYHINhiE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = MediaCardWidget;
var _c;
__turbopack_context__.k.register(_c, "MediaCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Snap grid voor zwevende kaarten (weather, media, climate, etc.).
 * Zorgt dat kaarten op dezelfde afstand van elkaar kunnen staan bij neerzetten.
 */ __turbopack_context__.s([
    "FLOATING_CARD_GRID_STEP",
    ()=>FLOATING_CARD_GRID_STEP,
    "snapToGrid",
    ()=>snapToGrid
]);
const FLOATING_CARD_GRID_STEP = 16;
function snapToGrid(position, bounds) {
    const step = FLOATING_CARD_GRID_STEP;
    let left = Math.round(position.left / step) * step;
    let bottom = Math.round(position.bottom / step) * step;
    if (bounds != null) {
        left = Math.max(0, Math.min(left, bounds.maxLeft));
        bottom = Math.max(0, Math.min(bottom, bounds.maxBottom));
    }
    return {
        left,
        bottom
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-media-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingMediaCard",
    ()=>FloatingMediaCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/media-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const STORAGE_KEY = "dashboard.floatingMediaCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;
function loadPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (!s) return null;
        const p = JSON.parse(s);
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.bottom) === "number") return {
            left: p.left,
            bottom: p.bottom
        };
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.top) === "number") {
            return {
                left: p.left,
                bottom: window.innerHeight - p.top - 200
            };
        }
    } catch (e) {
    // ignore
    }
    return null;
}
function savePosition(p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        left: window.innerWidth - CARD_WIDTH - DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET
    };
}
function FloatingMediaCard(param) {
    let { title, entity_id, editMode = false, onRemove, onEdit } = param;
    _s();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingMediaCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition()) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                top: 0
            };
        }
    }["FloatingMediaCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingMediaCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition();
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
            setPosition(p);
            savePosition(p);
        }
    }["FloatingMediaCard.useEffect"], []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingMediaCard.useCallback[handlePointerDown]": (e)=>{
            var _setPointerCapture, _this;
            if (!editMode) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this = e.target).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
        }
    }["FloatingMediaCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingMediaCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            }));
        }
    }["FloatingMediaCard.useCallback[handlePointerMove]"], [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingMediaCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
                const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
                const raw = {
                    left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                    maxLeft,
                    maxBottom
                });
                setPosition(next);
                savePosition(next);
            }
            (_releasePointerCapture = (_this = e.target).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingMediaCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10",
        style: {
            left: position.left,
            bottom: position.bottom
        },
        children: [
            editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 border-b border-white/10 py-1.5 px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "button",
                        tabIndex: 0,
                        onPointerDown: handlePointerDown,
                        onPointerMove: handlePointerMove,
                        onPointerUp: handlePointerUp,
                        onPointerLeave: (e)=>{
                            if (isDragging) handlePointerUp(e);
                        },
                        className: "select-none touch-none flex-1 flex items-center justify-center text-white/50 text-xs hover:text-white/70 cursor-grab active:cursor-grabbing",
                        "aria-label": "Drag to move",
                        children: "Sleep om te verplaatsen"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-media-card.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onEdit,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Edit media card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-media-card.tsx",
                            lineNumber: 166,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-media-card.tsx",
                        lineNumber: 160,
                        columnNumber: 13
                    }, this),
                    onRemove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onRemove,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Remove media card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-media-card.tsx",
                            lineNumber: 176,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-media-card.tsx",
                        lineNumber: 170,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/floating-media-card.tsx",
                lineNumber: 144,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MediaCardWidget"], {
                    title: title,
                    entity_id: entity_id,
                    size: "md"
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/floating-media-card.tsx",
                    lineNumber: 182,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-media-card.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/floating-media-card.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_s(FloatingMediaCard, "MzuwgivlV7eqAhJNlHB2UCrj+Uw=");
_c = FloatingMediaCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingMediaCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/climate-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClimateCardWidget",
    ()=>ClimateCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function formatTemp(value) {
    if (value == null || Number.isNaN(value)) return "—";
    return "".concat(Math.round(value), "°");
}
const TEMP_STEP = 0.5;
const TEMP_MIN = 5;
const TEMP_MAX = 35;
function ClimateCardWidget(param) {
    let { title = "Climate", entity_id, size = "md", className } = param;
    var _entity_attributes, _entity_attributes1, _entity_attributes2, _entity_attributes3, _entity_attributes4, _entity_attributes5, _entity_attributes6, _entity_attributes7, _entity_attributes8;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "ClimateCardWidget.useEntityStateStore[entity]": (s)=>s.getState(entity_id)
    }["ClimateCardWidget.useEntityStateStore[entity]"]);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "ClimateCardWidget.useEntityStateStore[setStates]": (s)=>s.setStates
    }["ClimateCardWidget.useEntityStateStore[setStates]"]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const currentTemperature = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.current_temperature) || undefined;
    var _Number, _ref;
    const targetTemperature = (_ref = (_Number = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes1 = entity.attributes) === null || _entity_attributes1 === void 0 ? void 0 : _entity_attributes1.temperature)) !== null && _Number !== void 0 ? _Number : Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes2 = entity.attributes) === null || _entity_attributes2 === void 0 ? void 0 : _entity_attributes2.target_temp_high)) !== null && _ref !== void 0 ? _ref : undefined;
    const minTemp = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes3 = entity.attributes) === null || _entity_attributes3 === void 0 ? void 0 : _entity_attributes3.min_temp) || TEMP_MIN;
    const maxTemp = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes4 = entity.attributes) === null || _entity_attributes4 === void 0 ? void 0 : _entity_attributes4.max_temp) || TEMP_MAX;
    const tempStep = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes5 = entity.attributes) === null || _entity_attributes5 === void 0 ? void 0 : _entity_attributes5.target_temp_step) || TEMP_STEP;
    var _ref1;
    const hvacModes = (_ref1 = entity === null || entity === void 0 ? void 0 : (_entity_attributes6 = entity.attributes) === null || _entity_attributes6 === void 0 ? void 0 : _entity_attributes6.hvac_modes) !== null && _ref1 !== void 0 ? _ref1 : [];
    var _ref2;
    const state = (_ref2 = entity === null || entity === void 0 ? void 0 : entity.state) !== null && _ref2 !== void 0 ? _ref2 : "";
    const hvacModeFromAttr = entity === null || entity === void 0 ? void 0 : (_entity_attributes7 = entity.attributes) === null || _entity_attributes7 === void 0 ? void 0 : _entity_attributes7.hvac_mode;
    const stateToMode = {
        heating: "heat",
        cooling: "cool",
        heat: "heat",
        cool: "cool",
        off: "off",
        auto: "auto",
        idle: "auto",
        dry: "dry",
        fan_only: "fan_only"
    };
    var _ref3;
    const resolvedMode = (_ref3 = hvacModeFromAttr !== null && hvacModeFromAttr !== void 0 ? hvacModeFromAttr : stateToMode[state]) !== null && _ref3 !== void 0 ? _ref3 : state;
    const activeHvacMode = resolvedMode && hvacModes.includes(resolvedMode) ? resolvedMode : null;
    async function setTemperature(temperature) {
        const value = Math.round(temperature / tempStep) * tempStep;
        const clamped = Math.min(maxTemp, Math.max(minTemp, value));
        setLoading(true);
        try {
            const res = await fetch("/api/ha/call-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entity_id,
                    domain: "climate",
                    service: "set_temperature",
                    service_data: {
                        temperature: clamped
                    }
                })
            });
            if (res.ok) {
                const data = await fetch("/api/ha/state").then((r)=>r.json());
                if (Array.isArray(data)) setStates(data);
            }
        } finally{
            setLoading(false);
        }
    }
    async function setHvacMode(hvac_mode) {
        setLoading(true);
        try {
            const res = await fetch("/api/ha/call-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entity_id,
                    domain: "climate",
                    service: "set_hvac_mode",
                    service_data: {
                        hvac_mode
                    }
                })
            });
            if (res.ok) {
                const data = await fetch("/api/ha/state").then((r)=>r.json());
                if (Array.isArray(data)) setStates(data);
            }
        } finally{
            setLoading(false);
        }
    }
    var _ref4;
    const targetForButtons = (_ref4 = targetTemperature !== null && targetTemperature !== void 0 ? targetTemperature : currentTemperature) !== null && _ref4 !== void 0 ? _ref4 : 20;
    const canDecrease = targetForButtons > minTemp;
    const canIncrease = targetForButtons < maxTemp;
    const stateLabel = {
        idle: "Idle",
        heating: "Verwarmen",
        cooling: "Koelen",
        off: "Uit",
        heat: "Verwarmen",
        cool: "Koelen",
        auto: "Auto",
        dry: "Droog",
        fan_only: "Alleen ventilator",
        unknown: "—"
    };
    var _ref5;
    const friendlyName = (_ref5 = entity === null || entity === void 0 ? void 0 : (_entity_attributes8 = entity.attributes) === null || _entity_attributes8 === void 0 ? void 0 : _entity_attributes8.friendly_name) !== null && _ref5 !== void 0 ? _ref5 : entity_id;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 px-4 py-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0 flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium truncate text-white/90",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-white/60 truncate",
                            children: friendlyName
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3 px-4 pt-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-5xl font-bold tabular-nums text-white",
                        children: formatTemp(currentTemperature)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 shrink-0",
                        children: hvacModes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: activeHvacMode !== null && activeHvacMode !== void 0 ? activeHvacMode : "",
                            onChange: (e)=>{
                                const v = e.target.value;
                                if (v) setHvacMode(v);
                            },
                            disabled: loading,
                            className: "rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-medium text-white focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:opacity-50 [&>option]:bg-gray-800 [&>option]:text-white",
                            "aria-label": "HVAC-modus",
                            children: hvacModes.map((mode)=>{
                                var _stateLabel_mode;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: mode,
                                    children: (_stateLabel_mode = stateLabel[mode]) !== null && _stateLabel_mode !== void 0 ? _stateLabel_mode : mode
                                }, mode, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                                    lineNumber: 149,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                            lineNumber: 138,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4 pt-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setTemperature(targetForButtons - tempStep),
                            disabled: loading || !canDecrease,
                            className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 disabled:opacity-40 disabled:pointer-events-none",
                            "aria-label": "Temperatuur verlagen",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-[4rem] text-center text-lg font-semibold tabular-nums text-white/90",
                            children: targetTemperature != null ? formatTemp(targetTemperature) : "—"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setTemperature(targetForButtons + tempStep),
                            disabled: loading || !canIncrease,
                            className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 disabled:opacity-40 disabled:pointer-events-none",
                            "aria-label": "Temperatuur verhogen",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/climate-card-widget.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
_s(ClimateCardWidget, "ffizQcQ8TKtfKDItuwQoNQu19wo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = ClimateCardWidget;
var _c;
__turbopack_context__.k.register(_c, "ClimateCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/climate-card-2-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClimateCard2Widget",
    ()=>ClimateCard2Widget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flame.js [app-client] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/snowflake.js [app-client] (ecmascript) <export default as Snowflake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-client] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const SELECTOR_MIN = 18;
const SELECTOR_STEP = 0.5;
const SWIPE_THRESHOLD_PX = 36;
function formatTemp(value) {
    if (value == null || Number.isNaN(value)) return "—";
    const rounded = Math.round(value * 2) / 2;
    return rounded % 1 === 0.5 ? "".concat(rounded, "°") : "".concat(Math.round(rounded), "°");
}
const TEMP_MIN = 5;
const TEMP_MAX = 35;
const MODE_CONFIG = [
    {
        mode: "fan_only",
        label: "Wind",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"]
    },
    {
        mode: "cool",
        label: "Cooling",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__["Snowflake"]
    },
    {
        mode: "heat",
        label: "Heat",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"]
    }
];
const STATE_LABELS = {
    idle: "Idle",
    heating: "Verwarmen…",
    cooling: "Koelen…",
    off: "Uit",
    heat: "Verwarmen",
    cool: "Koelen",
    auto: "Auto",
    dry: "Droog",
    fan_only: "Ventilator",
    unknown: "—"
};
function ClimateCard2Widget(param) {
    let { title = "Air Conditioner", entity_id, size = "md", className, onMoreClick } = param;
    var _entity_attributes, _entity_attributes1, _entity_attributes2, _entity_attributes3, _entity_attributes4, _entity_attributes5, _entity_attributes6, _entity_attributes7;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "ClimateCard2Widget.useEntityStateStore[entity]": (s)=>s.getState(entity_id)
    }["ClimateCard2Widget.useEntityStateStore[entity]"]);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "ClimateCard2Widget.useEntityStateStore[setStates]": (s)=>s.setStates
    }["ClimateCard2Widget.useEntityStateStore[setStates]"]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const currentTemperature = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.current_temperature) || undefined;
    var _Number, _ref;
    const targetTemperature = (_ref = (_Number = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes1 = entity.attributes) === null || _entity_attributes1 === void 0 ? void 0 : _entity_attributes1.temperature)) !== null && _Number !== void 0 ? _Number : Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes2 = entity.attributes) === null || _entity_attributes2 === void 0 ? void 0 : _entity_attributes2.target_temp_high)) !== null && _ref !== void 0 ? _ref : undefined;
    const minTemp = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes3 = entity.attributes) === null || _entity_attributes3 === void 0 ? void 0 : _entity_attributes3.min_temp) || TEMP_MIN;
    const maxTemp = Number(entity === null || entity === void 0 ? void 0 : (_entity_attributes4 = entity.attributes) === null || _entity_attributes4 === void 0 ? void 0 : _entity_attributes4.max_temp) || TEMP_MAX;
    var _ref1;
    const hvacModes = (_ref1 = entity === null || entity === void 0 ? void 0 : (_entity_attributes5 = entity.attributes) === null || _entity_attributes5 === void 0 ? void 0 : _entity_attributes5.hvac_modes) !== null && _ref1 !== void 0 ? _ref1 : [];
    var _ref2;
    const state = (_ref2 = entity === null || entity === void 0 ? void 0 : entity.state) !== null && _ref2 !== void 0 ? _ref2 : "";
    const hvacModeFromAttr = entity === null || entity === void 0 ? void 0 : (_entity_attributes6 = entity.attributes) === null || _entity_attributes6 === void 0 ? void 0 : _entity_attributes6.hvac_mode;
    const stateToMode = {
        heating: "heat",
        cooling: "cool",
        heat: "heat",
        cool: "cool",
        off: "off",
        auto: "auto",
        idle: "auto",
        dry: "dry",
        fan_only: "fan_only"
    };
    var _ref3;
    const resolvedMode = (_ref3 = hvacModeFromAttr !== null && hvacModeFromAttr !== void 0 ? hvacModeFromAttr : stateToMode[state]) !== null && _ref3 !== void 0 ? _ref3 : state;
    var _hvacModes_;
    const activeHvacMode = resolvedMode && hvacModes.includes(resolvedMode) ? resolvedMode : (_hvacModes_ = hvacModes[0]) !== null && _hvacModes_ !== void 0 ? _hvacModes_ : null;
    const isOff = state === "off" || !state;
    var _ref4;
    const displayTemp = (_ref4 = targetTemperature !== null && targetTemperature !== void 0 ? targetTemperature : currentTemperature) !== null && _ref4 !== void 0 ? _ref4 : 20;
    const selectorMin = Math.max(SELECTOR_MIN, minTemp);
    const tempOptions = Array.from({
        length: Math.round((maxTemp - selectorMin) / SELECTOR_STEP) + 1
    }, (_, i)=>Math.round((selectorMin + i * SELECTOR_STEP) * 2) / 2);
    const swipeStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const didSwipeThisGesture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const handleSwipeStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ClimateCard2Widget.useCallback[handleSwipeStart]": (clientX)=>{
            if (loading || isOff) return;
            swipeStart.current = {
                x: clientX,
                temp: displayTemp
            };
        }
    }["ClimateCard2Widget.useCallback[handleSwipeStart]"], [
        loading,
        isOff,
        displayTemp
    ]);
    const handleSwipeEnd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ClimateCard2Widget.useCallback[handleSwipeEnd]": ()=>{
            swipeStart.current = null;
            if (didSwipeThisGesture.current) {
                setTimeout({
                    "ClimateCard2Widget.useCallback[handleSwipeEnd]": ()=>{
                        didSwipeThisGesture.current = false;
                    }
                }["ClimateCard2Widget.useCallback[handleSwipeEnd]"], 0);
            }
        }
    }["ClimateCard2Widget.useCallback[handleSwipeEnd]"], []);
    const setTemperature = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ClimateCard2Widget.useCallback[setTemperature]": async (temperature)=>{
            const rounded = Math.round(temperature * 2) / 2;
            const clamped = Math.min(maxTemp, Math.max(selectorMin, rounded));
            setLoading(true);
            try {
                const res = await fetch("/api/ha/call-service", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        entity_id,
                        domain: "climate",
                        service: "set_temperature",
                        service_data: {
                            temperature: clamped
                        }
                    })
                });
                if (res.ok) {
                    const data = await fetch("/api/ha/state").then({
                        "ClimateCard2Widget.useCallback[setTemperature]": (r)=>r.json()
                    }["ClimateCard2Widget.useCallback[setTemperature]"]);
                    if (Array.isArray(data)) setStates(data);
                }
            } finally{
                setLoading(false);
            }
        }
    }["ClimateCard2Widget.useCallback[setTemperature]"], [
        entity_id,
        maxTemp,
        selectorMin,
        setStates
    ]);
    const handleSwipeMoveWithSetTemp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ClimateCard2Widget.useCallback[handleSwipeMoveWithSetTemp]": (clientX)=>{
            if (!swipeStart.current) return;
            const delta = clientX - swipeStart.current.x;
            if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
                didSwipeThisGesture.current = true;
                const steps = Math.floor(delta / SWIPE_THRESHOLD_PX);
                const newTemp = Math.min(maxTemp, Math.max(selectorMin, Math.round((swipeStart.current.temp + steps * SELECTOR_STEP) * 2) / 2));
                setTemperature(newTemp);
                swipeStart.current = {
                    x: clientX,
                    temp: newTemp
                };
            }
        }
    }["ClimateCard2Widget.useCallback[handleSwipeMoveWithSetTemp]"], [
        maxTemp,
        selectorMin,
        setTemperature
    ]);
    async function setHvacMode(hvac_mode) {
        setLoading(true);
        try {
            const res = await fetch("/api/ha/call-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entity_id,
                    domain: "climate",
                    service: "set_hvac_mode",
                    service_data: {
                        hvac_mode
                    }
                })
            });
            if (res.ok) {
                const data = await fetch("/api/ha/state").then((r)=>r.json());
                if (Array.isArray(data)) setStates(data);
            }
        } finally{
            setLoading(false);
        }
    }
    async function setPower(on) {
        setLoading(true);
        try {
            const service = on ? "turn_on" : "turn_off";
            const res = await fetch("/api/ha/call-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entity_id,
                    domain: "climate",
                    service
                })
            });
            if (res.ok) {
                const data = await fetch("/api/ha/state").then((r)=>r.json());
                if (Array.isArray(data)) setStates(data);
            }
        } finally{
            setLoading(false);
        }
    }
    const availableModes = MODE_CONFIG.filter((c)=>hvacModes.includes(c.mode));
    if (availableModes.length === 0 && hvacModes.length > 0) {
        availableModes.push(...hvacModes.slice(0, 3).map((mode)=>{
            var _STATE_LABELS_mode;
            return {
                mode,
                label: (_STATE_LABELS_mode = STATE_LABELS[mode]) !== null && _STATE_LABELS_mode !== void 0 ? _STATE_LABELS_mode : mode,
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"]
            };
        }));
    }
    var _ref5;
    const friendlyName = (_ref5 = entity === null || entity === void 0 ? void 0 : (_entity_attributes7 = entity.attributes) === null || _entity_attributes7 === void 0 ? void 0 : _entity_attributes7.friendly_name) !== null && _ref5 !== void 0 ? _ref5 : entity_id;
    var _STATE_LABELS_state;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/15 dark:bg-black/40 text-gray-900 dark:text-white shadow-xl backdrop-blur-2xl border border-white/30 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 dark:bg-white/10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
                                    className: "h-5 w-5 text-amber-600 dark:text-amber-400",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium truncate text-gray-900 dark:text-white/90",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 dark:text-white/60 truncate",
                                        children: friendlyName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setPower(!isOff),
                                disabled: loading,
                                role: "switch",
                                "aria-checked": !isOff,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50", !isOff ? "bg-amber-500 dark:bg-amber-500" : "bg-gray-300 dark:bg-gray-600"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition", !isOff ? "translate-x-5" : "translate-x-1")
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 241,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this),
                            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onMoreClick,
                                className: "p-1.5 rounded-lg text-gray-500 hover:bg-white/20 dark:text-gray-400 dark:hover:bg-white/10",
                                "aria-label": "More options",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 255,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 249,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-2 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-5xl font-bold tabular-nums text-gray-900 dark:text-white",
                        children: formatTemp(displayTemp)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5",
                        children: isOff ? "Uit" : (_STATE_LABELS_state = STATE_LABELS[state]) !== null && _STATE_LABELS_state !== void 0 ? _STATE_LABELS_state : state
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this),
            availableModes.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex rounded-xl bg-gray-200/50 dark:bg-white/10 p-1",
                    role: "tablist",
                    children: availableModes.map((param)=>{
                        let { mode, label, icon: Icon } = param;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            role: "tab",
                            "aria-selected": activeHvacMode === mode,
                            onClick: ()=>setHvacMode(mode),
                            disabled: loading || isOff,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-50", activeHvacMode === mode ? "bg-amber-400 dark:bg-amber-500 text-gray-900 shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "h-4 w-4",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 293,
                                    columnNumber: 17
                                }, this),
                                label
                            ]
                        }, mode, true, {
                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                            lineNumber: 279,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                    lineNumber: 274,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                lineNumber: 273,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4 pt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 overflow-x-auto overflow-y-hidden pb-1 touch-none select-none min-w-0 scrollbar-hide",
                        onTouchStart: (e)=>handleSwipeStart(e.touches[0].clientX),
                        onTouchMove: (e)=>handleSwipeMoveWithSetTemp(e.touches[0].clientX),
                        onTouchEnd: handleSwipeEnd,
                        onTouchCancel: handleSwipeEnd,
                        onMouseDown: (e)=>{
                            e.preventDefault();
                            handleSwipeStart(e.clientX);
                        },
                        onMouseMove: (e)=>{
                            if (swipeStart.current) handleSwipeMoveWithSetTemp(e.clientX);
                        },
                        onMouseUp: handleSwipeEnd,
                        onMouseLeave: handleSwipeEnd,
                        children: tempOptions.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    if (didSwipeThisGesture.current) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return;
                                    }
                                    setTemperature(t);
                                },
                                disabled: loading || isOff,
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors disabled:opacity-50", Math.round(displayTemp * 2) / 2 === t ? "bg-amber-400 dark:bg-amber-500 text-gray-900 ring-2 ring-amber-600/50 dark:ring-amber-400/50" : "text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/10"),
                                children: t
                            }, t, false, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 320,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 303,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500 dark:text-gray-400 mt-1.5 text-center",
                        children: "Tik op een getal of veeg om temperatuur aan te passen"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 343,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
        lineNumber: 207,
        columnNumber: 5
    }, this);
}
_s(ClimateCard2Widget, "FibslF6ZdPpgnQ1rkhzoqX+M2HM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = ClimateCard2Widget;
var _c;
__turbopack_context__.k.register(_c, "ClimateCard2Widget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/solar-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SolarCardWidget",
    ()=>SolarCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
function formatValue(value, unit) {
    if (value == null || Number.isNaN(value)) return "—";
    const rounded = Math.round(value * 10) / 10;
    return unit ? "".concat(rounded, " ").concat(unit) : String(rounded);
}
function useEntityValue(entityId) {
    var _entity_attributes, _entity_attributes1;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "useEntityValue.useEntityStateStore[entity]": (s)=>s.getState(entityId)
    }["useEntityValue.useEntityStateStore[entity]"]);
    const raw = entity === null || entity === void 0 ? void 0 : entity.state;
    const value = raw != null && raw !== "unavailable" && raw !== "unknown" ? Number(raw) : undefined;
    var _ref;
    const unit = (_ref = entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.unit_of_measurement) !== null && _ref !== void 0 ? _ref : "W";
    var _ref1;
    const friendlyName = (_ref1 = entity === null || entity === void 0 ? void 0 : (_entity_attributes1 = entity.attributes) === null || _entity_attributes1 === void 0 ? void 0 : _entity_attributes1.friendly_name) !== null && _ref1 !== void 0 ? _ref1 : entityId;
    return {
        value,
        unit,
        friendlyName
    };
}
_s(useEntityValue, "0Dpq8XOPxr5+xoZU8oNJeWvn+/k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
function SolarCardWidget(param) {
    let { title = "Zonnepanelen", entity_id, consumption_entity_id, size = "md", className } = param;
    _s1();
    const yieldData = useEntityValue(entity_id);
    const consumptionData = useEntityValue(consumption_entity_id !== null && consumption_entity_id !== void 0 ? consumption_entity_id : "");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 px-4 py-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-w-0 flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-medium truncate text-white/90",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-white/60 truncate",
                            children: yieldData.friendlyName
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4 pt-0 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60 mb-0.5",
                                children: "Yield"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold tabular-nums text-amber-400/95",
                                children: formatValue(yieldData.value, yieldData.unit)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    consumption_entity_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-2 border-t border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60 mb-0.5",
                                children: "Consumption"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold tabular-nums text-white/95",
                                children: formatValue(consumptionData.value, consumptionData.unit)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s1(SolarCardWidget, "FIjGR2nonM3XEt18a3TD8VCXxx0=", false, function() {
    return [
        useEntityValue,
        useEntityValue
    ];
});
_c = SolarCardWidget;
var _c;
__turbopack_context__.k.register(_c, "SolarCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-solar-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingSolarCard",
    ()=>FloatingSolarCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const STORAGE_KEY = "dashboard.floatingSolarCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;
function loadPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (!s) return null;
        const p = JSON.parse(s);
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.bottom) === "number") return {
            left: p.left,
            bottom: p.bottom
        };
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.top) === "number") {
            return {
                left: p.left,
                bottom: window.innerHeight - p.top - 200
            };
        }
    } catch (e) {
    // ignore
    }
    return null;
}
function savePosition(p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        left: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET
    };
}
function FloatingSolarCard(param) {
    let { title, entity_id, consumption_entity_id, editMode = false, onRemove, onEdit } = param;
    _s();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingSolarCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition()) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                top: 0
            };
        }
    }["FloatingSolarCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingSolarCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition();
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
            setPosition(p);
            savePosition(p);
        }
    }["FloatingSolarCard.useEffect"], []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSolarCard.useCallback[handlePointerDown]": (e)=>{
            var _setPointerCapture, _this;
            if (!editMode) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this = e.target).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
        }
    }["FloatingSolarCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSolarCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            }));
        }
    }["FloatingSolarCard.useCallback[handlePointerMove]"], [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSolarCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
                const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
                const raw = {
                    left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                    maxLeft,
                    maxBottom
                });
                setPosition(next);
                savePosition(next);
            }
            (_releasePointerCapture = (_this = e.target).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingSolarCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10",
        style: {
            left: position.left,
            bottom: position.bottom
        },
        children: [
            editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 border-b border-white/10 py-1.5 px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "button",
                        tabIndex: 0,
                        onPointerDown: handlePointerDown,
                        onPointerMove: handlePointerMove,
                        onPointerUp: handlePointerUp,
                        onPointerLeave: (e)=>{
                            if (isDragging) handlePointerUp(e);
                        },
                        className: "select-none touch-none flex-1 flex items-center justify-center text-white/50 text-xs hover:text-white/70 cursor-grab active:cursor-grabbing",
                        "aria-label": "Drag to move",
                        children: "Sleep om te verplaatsen"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this),
                    onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onEdit,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Edit solar card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
                            lineNumber: 168,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
                        lineNumber: 162,
                        columnNumber: 13
                    }, this),
                    onRemove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onRemove,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Remove solar card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
                            lineNumber: 178,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
                        lineNumber: 172,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
                lineNumber: 146,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SolarCardWidget"], {
                    title: title,
                    entity_id: entity_id,
                    consumption_entity_id: consumption_entity_id,
                    size: "md"
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_s(FloatingSolarCard, "MzuwgivlV7eqAhJNlHB2UCrj+Uw=");
_c = FloatingSolarCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingSolarCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/weather-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WeatherCardWidget",
    ()=>WeatherCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-client] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-fog.js [app-client] (ecmascript) <export default as CloudFog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-lightning.js [app-client] (ecmascript) <export default as CloudLightning>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-rain.js [app-client] (ecmascript) <export default as CloudRain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-snow.js [app-client] (ecmascript) <export default as CloudSnow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-client] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function WeatherIcon(param) {
    let { state, className } = param;
    var _state_toLowerCase;
    const s = (_state_toLowerCase = state === null || state === void 0 ? void 0 : state.toLowerCase()) !== null && _state_toLowerCase !== void 0 ? _state_toLowerCase : "";
    const iconClass = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0", className !== null && className !== void 0 ? className : "h-8 w-8");
    if (s === "sunny" || s === "clear") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 21,
        columnNumber: 46
    }, this);
    if (s === "clear-night") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 22,
        columnNumber: 35
    }, this);
    if (s === "fog" || s === "mist") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__["CloudFog"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 23,
        columnNumber: 43
    }, this);
    if (s === "rainy" || s === "pouring" || s === "hail") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__["CloudRain"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 24,
        columnNumber: 64
    }, this);
    if (s === "snowy" || s === "snowy-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__["CloudSnow"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 25,
        columnNumber: 52
    }, this);
    if (s === "lightning" || s === "lightning-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__["CloudLightning"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 26,
        columnNumber: 60
    }, this);
    if (s === "windy" || s === "windy-variant") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 27,
        columnNumber: 54
    }, this);
    if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 28,
        columnNumber: 77
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 29,
        columnNumber: 10
    }, this);
}
_c = WeatherIcon;
function formatTemp(value) {
    if (value == null || Number.isNaN(value)) return "—";
    return "".concat(Math.round(value), "°");
}
/** Achtergrondgradient per weertoestand (fallback als er geen afbeelding is). */ function getWeatherBackground(condition) {
    var _condition_toLowerCase;
    const s = (_condition_toLowerCase = condition === null || condition === void 0 ? void 0 : condition.toLowerCase()) !== null && _condition_toLowerCase !== void 0 ? _condition_toLowerCase : "";
    switch(s){
        case "sunny":
        case "clear":
            return "from-amber-300/50 via-yellow-200/30 to-sky-300/40";
        case "clear-night":
            return "from-indigo-950/70 via-slate-900/60 to-indigo-950/80";
        case "cloudy":
        case "partlycloudy":
        case "exceptional":
            return "from-slate-400/40 via-slate-300/30 to-slate-500/40";
        case "rainy":
        case "pouring":
        case "hail":
            return "from-slate-500/50 via-sky-700/40 to-slate-600/50";
        case "snowy":
        case "snowy-rainy":
            return "from-sky-200/40 via-white/30 to-slate-300/40";
        case "fog":
        case "mist":
            return "from-slate-400/35 to-slate-500/40";
        case "lightning":
        case "lightning-rainy":
            return "from-slate-800/60 via-slate-900/50 to-slate-950/70";
        case "windy":
        case "windy-variant":
            return "from-slate-300/35 via-sky-400/30 to-slate-400/35";
        default:
            return "from-sky-400/35 via-sky-500/30 to-sky-600/40";
    }
}
/** Pad naar custom achtergrondafbeelding per weertoestand (in public/). */ function getWeatherBackgroundImage(condition) {
    var _condition_toLowerCase;
    const s = (_condition_toLowerCase = condition === null || condition === void 0 ? void 0 : condition.toLowerCase()) !== null && _condition_toLowerCase !== void 0 ? _condition_toLowerCase : "";
    switch(s){
        case "fog":
        case "mist":
            return "/weather-fog.png";
        case "sunny":
        case "clear":
            return "/weather-sunny.png";
        case "rainy":
        case "pouring":
        case "hail":
            return "/weather-rainy.png";
        case "cloudy":
        case "partlycloudy":
        case "exceptional":
            return "/weather-partlycloudy.png";
        default:
            return null;
    }
}
function WeatherCardWidget(param) {
    let { title = "Weather", entity_id, size = "md", show_icon = true, className } = param;
    var _entity_attributes, _entity_attributes1, _entity_attributes2;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "WeatherCardWidget.useEntityStateStore[entity]": (s)=>s.getState(entity_id)
    }["WeatherCardWidget.useEntityStateStore[entity]"]);
    var _ref;
    const condition = (_ref = entity === null || entity === void 0 ? void 0 : entity.state) !== null && _ref !== void 0 ? _ref : "";
    const temperature = (entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.temperature) != null ? Number(entity.attributes.temperature) : undefined;
    const humidity = (entity === null || entity === void 0 ? void 0 : (_entity_attributes1 = entity.attributes) === null || _entity_attributes1 === void 0 ? void 0 : _entity_attributes1.humidity) != null ? Number(entity.attributes.humidity) : undefined;
    const bgGradient = getWeatherBackground(condition);
    const bgImage = getWeatherBackgroundImage(condition);
    var _ref1;
    const friendlyName = (_ref1 = entity === null || entity === void 0 ? void 0 : (_entity_attributes2 = entity.attributes) === null || _entity_attributes2 === void 0 ? void 0 : _entity_attributes2.friendly_name) !== null && _ref1 !== void 0 ? _ref1 : entity_id;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full flex-col overflow-hidden rounded-2xl text-white shadow-xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute inset-0 bg-gradient-to-b rounded-2xl", bgGradient)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            bgImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 rounded-2xl overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: bgImage,
                    alt: "",
                    className: "absolute inset-0 w-full h-full object-cover object-center"
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                    lineNumber: 133,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 132,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/25 dark:bg-black/35 rounded-2xl"
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex flex-col z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-3 px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 min-w-0 flex-1",
                                children: [
                                    show_icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white drop-shadow-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WeatherIcon, {
                                            state: condition,
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                            lineNumber: 146,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium truncate text-white/90 drop-shadow-sm",
                                                children: title
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                                lineNumber: 150,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-white/60 truncate drop-shadow-sm",
                                                children: friendlyName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                                lineNumber: 151,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            humidity != null && !Number.isNaN(humidity) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-white/90 drop-shadow-sm shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"], {
                                        className: "h-4 w-4",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            Math.round(humidity),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pb-4 pt-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-3xl font-bold tabular-nums text-white drop-shadow-md",
                            children: formatTemp(temperature)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
_s(WeatherCardWidget, "0Dpq8XOPxr5+xoZU8oNJeWvn+/k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c1 = WeatherCardWidget;
var _c, _c1;
__turbopack_context__.k.register(_c, "WeatherIcon");
__turbopack_context__.k.register(_c1, "WeatherCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-weather-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingWeatherCard",
    ()=>FloatingWeatherCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/weather-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const STORAGE_KEY = "dashboard.floatingWeatherCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;
function loadPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (!s) return null;
        const p = JSON.parse(s);
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.bottom) === "number") return {
            left: p.left,
            bottom: p.bottom
        };
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.top) === "number") {
            return {
                left: p.left,
                bottom: window.innerHeight - p.top - 200
            };
        }
    } catch (e) {
    // ignore
    }
    return null;
}
function savePosition(p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        left: window.innerWidth - CARD_WIDTH - DEFAULT_OFFSET - 80,
        bottom: DEFAULT_OFFSET
    };
}
function FloatingWeatherCard(param) {
    let { title, entity_id, show_icon = true, editMode = false, onRemove, onEdit } = param;
    _s();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingWeatherCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition()) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                top: 0
            };
        }
    }["FloatingWeatherCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingWeatherCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition();
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
            setPosition(p);
            savePosition(p);
        }
    }["FloatingWeatherCard.useEffect"], []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingWeatherCard.useCallback[handlePointerDown]": (e)=>{
            var _setPointerCapture, _this;
            if (!editMode) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this = e.target).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
        }
    }["FloatingWeatherCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingWeatherCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            }));
        }
    }["FloatingWeatherCard.useCallback[handlePointerMove]"], [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingWeatherCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
                const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
                const raw = {
                    left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                    maxLeft,
                    maxBottom
                });
                setPosition(next);
                savePosition(next);
            }
            (_releasePointerCapture = (_this = e.target).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingWeatherCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10",
        style: {
            left: position.left,
            bottom: position.bottom
        },
        children: [
            editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 border-b border-white/10 py-1.5 px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "button",
                        tabIndex: 0,
                        onPointerDown: handlePointerDown,
                        onPointerMove: handlePointerMove,
                        onPointerUp: handlePointerUp,
                        onPointerLeave: (e)=>{
                            if (isDragging) handlePointerUp(e);
                        },
                        className: "select-none touch-none flex-1 flex items-center justify-center text-white/50 text-xs hover:text-white/70 cursor-grab active:cursor-grabbing",
                        "aria-label": "Drag to move",
                        children: "Sleep om te verplaatsen"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this),
                    onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onEdit,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Edit weather card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                            lineNumber: 168,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                        lineNumber: 162,
                        columnNumber: 13
                    }, this),
                    onRemove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onRemove,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Remove weather card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                            lineNumber: 178,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                        lineNumber: 172,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                lineNumber: 146,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WeatherCardWidget"], {
                    title: title,
                    entity_id: entity_id,
                    show_icon: show_icon,
                    size: "md"
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_s(FloatingWeatherCard, "MzuwgivlV7eqAhJNlHB2UCrj+Uw=");
_c = FloatingWeatherCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingWeatherCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/vacuum-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VACUUM_ICON_OPTIONS",
    ()=>VACUUM_ICON_OPTIONS,
    "VacuumCardWidget",
    ()=>VacuumCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-dot.js [app-client] (ecmascript) <export default as CircleDot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car.js [app-client] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sofa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sofa$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sofa.js [app-client] (ecmascript) <export default as Sofa>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp.js [app-client] (ecmascript) <export default as Lamp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tree-pine.js [app-client] (ecmascript) <export default as TreePine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shirt.js [app-client] (ecmascript) <export default as Shirt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils-crossed.js [app-client] (ecmascript) <export default as UtensilsCrossed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bed$2d$double$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BedDouble$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bed-double.js [app-client] (ecmascript) <export default as BedDouble>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bath$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bath.js [app-client] (ecmascript) <export default as Bath>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$door$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DoorOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/door-open.js [app-client] (ecmascript) <export default as DoorOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const VACUUM_ICONS = {
    Activity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
    Bath: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bath$3e$__["Bath"],
    BedDouble: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bed$2d$double$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BedDouble$3e$__["BedDouble"],
    Bot: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"],
    Box: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"],
    Building2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"],
    Car: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"],
    Circle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"],
    CircleDot: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__["CircleDot"],
    DoorOpen: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$door$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DoorOpen$3e$__["DoorOpen"],
    Home: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
    Lamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__["Lamp"],
    Shirt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__["Shirt"],
    Sofa: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sofa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sofa$3e$__["Sofa"],
    Sparkles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
    Star: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"],
    TreePine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__["TreePine"],
    UtensilsCrossed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__["UtensilsCrossed"],
    Zap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
};
const VACUUM_ICON_OPTIONS = Object.keys(VACUUM_ICONS).sort();
const STATE_LABELS = {
    idle: "Inactief",
    cleaning: "Bezig met stofzuigen",
    docked: "In basis",
    returning: "Keert terug",
    paused: "Gepauzeerd",
    error: "Fout",
    unknown: "—"
};
function VacuumCardWidget(param) {
    let { title = "Stofzuiger", entity_id, script_ids = [], script_names = {}, cleaned_area_entity_id, icon: iconName, size = "md", className } = param;
    var _entity_attributes, _this;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "VacuumCardWidget.useEntityStateStore[entity]": (s)=>s.getState(entity_id)
    }["VacuumCardWidget.useEntityStateStore[entity]"]);
    const cleanedAreaEntity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "VacuumCardWidget.useEntityStateStore[cleanedAreaEntity]": (s)=>cleaned_area_entity_id ? s.getState(cleaned_area_entity_id) : null
    }["VacuumCardWidget.useEntityStateStore[cleanedAreaEntity]"]);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "VacuumCardWidget.useEntityStateStore[setStates]": (s)=>s.setStates
    }["VacuumCardWidget.useEntityStateStore[setStates]"]);
    const [loadingScript, setLoadingScript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /** Script die gestart is; blijft actief tot vacuum weer "docked" is. */ const [activeScriptId, setActiveScriptId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [roomsExpanded, setRoomsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    var _ref;
    const state = (_ref = entity === null || entity === void 0 ? void 0 : entity.state) !== null && _ref !== void 0 ? _ref : "unknown";
    var _ref1;
    const friendlyName = (_ref1 = entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.friendly_name) !== null && _ref1 !== void 0 ? _ref1 : entity_id;
    var _STATE_LABELS_state;
    const statusLabel = (_STATE_LABELS_state = STATE_LABELS[state]) !== null && _STATE_LABELS_state !== void 0 ? _STATE_LABELS_state : state;
    const cleanedAreaValue = cleanedAreaEntity === null || cleanedAreaEntity === void 0 ? void 0 : cleanedAreaEntity.state;
    var _unit_of_measurement;
    const cleanedAreaUnit = (_unit_of_measurement = (_this = cleanedAreaEntity === null || cleanedAreaEntity === void 0 ? void 0 : cleanedAreaEntity.attributes) === null || _this === void 0 ? void 0 : _this.unit_of_measurement) !== null && _unit_of_measurement !== void 0 ? _unit_of_measurement : "";
    const showCleanedArea = cleaned_area_entity_id && cleanedAreaValue != null && cleanedAreaValue !== "";
    const IconComponent = iconName && VACUUM_ICONS[iconName] ? VACUUM_ICONS[iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"];
    const isActive = state === "cleaning" || activeScriptId != null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VacuumCardWidget.useEffect": ()=>{
            if (state === "docked" && activeScriptId) {
                setActiveScriptId(null);
            }
        }
    }["VacuumCardWidget.useEffect"], [
        state,
        activeScriptId
    ]);
    async function runScript(scriptEntityId) {
        setLoadingScript(scriptEntityId);
        try {
            const res = await fetch("/api/ha/call-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entity_id: scriptEntityId,
                    domain: "script",
                    service: "turn_on"
                })
            });
            if (res.ok) {
                const data = await fetch("/api/ha/state").then((r)=>r.json());
                if (Array.isArray(data)) setStates(data);
                setActiveScriptId(scriptEntityId);
            }
        } finally{
            setLoadingScript(null);
        }
    }
    const isAnyScriptActive = activeScriptId != null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white", isActive && "animate-vacuum"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                    lineNumber: 144,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium truncate text-white/90",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/60 truncate",
                                        children: friendlyName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-end shrink-0 min-w-0 max-w-[45%]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium truncate w-full text-right", state === "cleaning" && "text-amber-400", state === "docked" && "text-green-400", state === "error" && "text-red-400", ![
                                    "cleaning",
                                    "docked",
                                    "error"
                                ].includes(state) && "text-white/80"),
                                title: statusLabel,
                                children: statusLabel
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            showCleanedArea && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60 truncate w-full text-right",
                                children: [
                                    cleanedAreaValue,
                                    cleanedAreaUnit ? " ".concat(cleanedAreaUnit) : ""
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            script_ids.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-3 pt-4 mt-4 border-t border-white/10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setRoomsExpanded((v)=>!v),
                        className: "flex items-center gap-1.5 w-full text-left text-[11px] text-white/60 hover:text-white/80 transition-colors",
                        "aria-expanded": roomsExpanded,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Rooms"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this),
                            roomsExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                className: "h-3.5 w-3.5 shrink-0",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 182,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "h-3.5 w-3.5 shrink-0",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 184,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this),
                    roomsExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-1 mt-1.5",
                        children: script_ids.map((scriptId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScriptTag, {
                                entityId: scriptId,
                                displayName: script_names === null || script_names === void 0 ? void 0 : script_names[scriptId],
                                onRun: ()=>runScript(scriptId),
                                loading: loadingScript === scriptId,
                                active: activeScriptId === scriptId,
                                disabled: isAnyScriptActive && activeScriptId !== scriptId
                            }, scriptId, false, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 190,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                        lineNumber: 188,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                lineNumber: 173,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_s(VacuumCardWidget, "NgPbg1A0Xr4gHF2hPMxyyYnbaLk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = VacuumCardWidget;
function ScriptTag(param) {
    let { entityId, displayName, onRun, loading, active, disabled } = param;
    var _entity_attributes;
    _s1();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "ScriptTag.useEntityStateStore[entity]": (s)=>s.getState(entityId)
    }["ScriptTag.useEntityStateStore[entity]"]);
    var _ref;
    const label = (_ref = displayName !== null && displayName !== void 0 ? displayName : entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.friendly_name) !== null && _ref !== void 0 ? _ref : entityId.replace(/^script\./, "");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onRun,
        disabled: loading || disabled,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors", active ? "border-amber-400/60 bg-amber-500/25 text-amber-200" : "border-white/25 bg-white/10 text-white/95 hover:bg-white/20 hover:border-white/40", (loading || disabled) && !active && "opacity-50 cursor-not-allowed"),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "truncate max-w-[7rem]",
            children: loading ? "…" : active ? "".concat(label, " (bezig)") : label
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
            lineNumber: 240,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, this);
}
_s1(ScriptTag, "0Dpq8XOPxr5+xoZU8oNJeWvn+/k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c1 = ScriptTag;
var _c, _c1;
__turbopack_context__.k.register(_c, "VacuumCardWidget");
__turbopack_context__.k.register(_c1, "ScriptTag");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-vacuum-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingVacuumCard",
    ()=>FloatingVacuumCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/vacuum-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const STORAGE_KEY = "dashboard.floatingVacuumCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;
function loadPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (!s) return null;
        const p = JSON.parse(s);
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.bottom) === "number") return {
            left: p.left,
            bottom: p.bottom
        };
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.top) === "number") {
            return {
                left: p.left,
                bottom: window.innerHeight - p.top - 200
            };
        }
    } catch (e) {
    // ignore
    }
    return null;
}
function savePosition(p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        left: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET + 120
    };
}
function FloatingVacuumCard(param) {
    let { title, entity_id, script_ids = [], script_names = {}, cleaned_area_entity_id, icon, editMode = false, onRemove, onEdit } = param;
    _s();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingVacuumCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition()) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                top: 0
            };
        }
    }["FloatingVacuumCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingVacuumCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition();
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
            setPosition(p);
            savePosition(p);
        }
    }["FloatingVacuumCard.useEffect"], []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingVacuumCard.useCallback[handlePointerDown]": (e)=>{
            var _setPointerCapture, _this;
            if (!editMode) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this = e.target).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
        }
    }["FloatingVacuumCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingVacuumCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            }));
        }
    }["FloatingVacuumCard.useCallback[handlePointerMove]"], [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingVacuumCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
                const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
                const raw = {
                    left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                    maxLeft,
                    maxBottom
                });
                setPosition(next);
                savePosition(next);
            }
            (_releasePointerCapture = (_this = e.target).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingVacuumCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10",
        style: {
            left: position.left,
            bottom: position.bottom
        },
        children: [
            editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 border-b border-white/10 py-1.5 px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "button",
                        tabIndex: 0,
                        onPointerDown: handlePointerDown,
                        onPointerMove: handlePointerMove,
                        onPointerUp: handlePointerUp,
                        onPointerLeave: (e)=>{
                            if (isDragging) handlePointerUp(e);
                        },
                        className: "select-none touch-none flex-1 flex items-center justify-center text-white/50 text-xs hover:text-white/70 cursor-grab active:cursor-grabbing",
                        "aria-label": "Sleep om te verplaatsen",
                        children: "Sleep om te verplaatsen"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onEdit,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Edit vacuum card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
                            lineNumber: 156,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
                        lineNumber: 155,
                        columnNumber: 13
                    }, this),
                    onRemove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onRemove,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Remove vacuum card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
                            lineNumber: 161,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
                        lineNumber: 160,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VacuumCardWidget"], {
                    title: title,
                    entity_id: entity_id,
                    script_ids: script_ids,
                    script_names: script_names,
                    cleaned_area_entity_id: cleaned_area_entity_id,
                    icon: icon,
                    size: "md"
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
_s(FloatingVacuumCard, "MzuwgivlV7eqAhJNlHB2UCrj+Uw=");
_c = FloatingVacuumCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingVacuumCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/sensor-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SENSOR_CONDITION_COLORS",
    ()=>SENSOR_CONDITION_COLORS,
    "SENSOR_CONDITION_OPERATORS",
    ()=>SENSOR_CONDITION_OPERATORS,
    "SENSOR_ICON_OPTIONS",
    ()=>SENSOR_ICON_OPTIONS,
    "SensorCardWidget",
    ()=>SensorCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-client] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-client] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-client] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GaugeCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-gauge.js [app-client] (ecmascript) <export default as GaugeCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const CONDITION_COLORS = {
    red: "border-red-400/50 dark:border-red-400/40 bg-red-500/25 dark:bg-red-900/30",
    amber: "border-amber-400/50 dark:border-amber-400/40 bg-amber-500/25 dark:bg-amber-900/30",
    green: "border-green-400/50 dark:border-green-400/40 bg-green-500/25 dark:bg-green-900/30",
    emerald: "border-emerald-400/50 dark:border-emerald-400/40 bg-emerald-500/25 dark:bg-emerald-900/30",
    blue: "border-blue-400/50 dark:border-blue-400/40 bg-blue-500/25 dark:bg-blue-900/30",
    violet: "border-violet-400/50 dark:border-violet-400/40 bg-violet-500/25 dark:bg-violet-900/30",
    slate: "border-slate-400/50 dark:border-slate-400/40 bg-slate-500/25 dark:bg-slate-900/30"
};
const SENSOR_CONDITION_COLORS = Object.keys(CONDITION_COLORS);
_c = SENSOR_CONDITION_COLORS;
const SENSOR_CONDITION_OPERATORS = [
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "contains"
];
function matchCondition(state, conditions) {
    if (state == null || state === "unavailable" || state === "unknown" || !(conditions === null || conditions === void 0 ? void 0 : conditions.length)) return null;
    const numState = Number(state);
    const isNumeric = !Number.isNaN(numState);
    for (const c of conditions){
        const condValue = c.value.trim();
        const numCond = Number(condValue);
        const isNumericCond = condValue !== "" && !Number.isNaN(numCond);
        if (isNumeric && isNumericCond) {
            switch(c.operator){
                case "gt":
                    if (numState > numCond) return c.color;
                    break;
                case "gte":
                    if (numState >= numCond) return c.color;
                    break;
                case "lt":
                    if (numState < numCond) return c.color;
                    break;
                case "lte":
                    if (numState <= numCond) return c.color;
                    break;
                case "eq":
                    if (numState === numCond) return c.color;
                    break;
                case "neq":
                    if (numState !== numCond) return c.color;
                    break;
                default:
                    break;
            }
        } else {
            const s = String(state).toLowerCase();
            const v = condValue.toLowerCase();
            switch(c.operator){
                case "eq":
                    if (s === v) return c.color;
                    break;
                case "neq":
                    if (s !== v) return c.color;
                    break;
                case "contains":
                    if (s.includes(v) || v.includes(s)) return c.color;
                    break;
                case "gt":
                case "gte":
                case "lt":
                case "lte":
                    if (isNumeric && isNumericCond) {
                        if (c.operator === "gt" && numState > numCond) return c.color;
                        if (c.operator === "gte" && numState >= numCond) return c.color;
                        if (c.operator === "lt" && numState < numCond) return c.color;
                        if (c.operator === "lte" && numState <= numCond) return c.color;
                    }
                    break;
                default:
                    break;
            }
        }
    }
    return null;
}
const SENSOR_ICONS = {
    Activity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
    Droplets: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
    Eye: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"],
    Gauge: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
    GaugeCircle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GaugeCircle$3e$__["GaugeCircle"],
    Lightbulb: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
    Sun: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"],
    Thermometer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"],
    Wind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"],
    Zap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
};
const SENSOR_ICON_OPTIONS = Object.keys(SENSOR_ICONS).sort();
function formatValue(state) {
    if (state == null || state === "unavailable" || state === "unknown") return "—";
    const num = Number(state);
    if (!Number.isNaN(num)) {
        if (Number.isInteger(num)) return String(num);
        return String(Math.round(num * 100) / 100);
    }
    return String(state);
}
function SensorCardWidget(param) {
    let { title = "Sensor", entity_id, icon: iconName, size = "md", conditions, className } = param;
    var _entity_attributes, _entity_attributes1;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "SensorCardWidget.useEntityStateStore[entity]": (s)=>s.getState(entity_id)
    }["SensorCardWidget.useEntityStateStore[entity]"]);
    const state = entity === null || entity === void 0 ? void 0 : entity.state;
    var _ref;
    const unit = (_ref = entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.unit_of_measurement) !== null && _ref !== void 0 ? _ref : "";
    var _ref1;
    const friendlyName = (_ref1 = entity === null || entity === void 0 ? void 0 : (_entity_attributes1 = entity.attributes) === null || _entity_attributes1 === void 0 ? void 0 : _entity_attributes1.friendly_name) !== null && _ref1 !== void 0 ? _ref1 : entity_id;
    const IconComponent = iconName && SENSOR_ICONS[iconName] ? SENSOR_ICONS[iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"];
    const displayValue = formatValue(state);
    const matchedColor = matchCondition(state, conditions);
    const conditionClass = matchedColor && CONDITION_COLORS[matchedColor] ? CONDITION_COLORS[matchedColor] : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl text-white shadow-xl backdrop-blur-2xl border", conditionClass !== null && conditionClass !== void 0 ? conditionClass : "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium truncate text-white/90",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/60 truncate",
                                        children: friendlyName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                                        lineNumber: 137,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0 rounded-full p-1 text-white/50 hover:text-white/70",
                        "aria-label": "Info",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                            className: "h-4 w-4",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4 pt-3 flex flex-col gap-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-baseline gap-2 flex-wrap",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-bold tabular-nums text-white", size === "sm" && "text-2xl", size === "md" && "text-3xl", size === "lg" && "text-4xl"),
                            children: displayValue
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this),
                        unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex items-center rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300/95",
                            children: unit
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, this);
}
_s(SensorCardWidget, "0Dpq8XOPxr5+xoZU8oNJeWvn+/k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c1 = SensorCardWidget;
var _c, _c1;
__turbopack_context__.k.register(_c, "SENSOR_CONDITION_COLORS");
__turbopack_context__.k.register(_c1, "SensorCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-sensor-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingSensorCard",
    ()=>FloatingSensorCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/sensor-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const STORAGE_KEY = "dashboard.floatingSensorCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;
function loadPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (!s) return null;
        const p = JSON.parse(s);
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.bottom) === "number") return {
            left: p.left,
            bottom: p.bottom
        };
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.top) === "number") {
            return {
                left: p.left,
                bottom: window.innerHeight - p.top - 200
            };
        }
    } catch (e) {
    // ignore
    }
    return null;
}
function savePosition(p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        left: window.innerWidth - CARD_WIDTH - DEFAULT_OFFSET - 160,
        bottom: DEFAULT_OFFSET
    };
}
function FloatingSensorCard(param) {
    let { title, entity_id, icon, size = "md", conditions, editMode = false, onRemove, onEdit } = param;
    _s();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingSensorCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition()) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                top: 0
            };
        }
    }["FloatingSensorCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingSensorCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition();
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
            setPosition(p);
            savePosition(p);
        }
    }["FloatingSensorCard.useEffect"], []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSensorCard.useCallback[handlePointerDown]": (e)=>{
            var _setPointerCapture, _this;
            if (!editMode) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this = e.target).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
        }
    }["FloatingSensorCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSensorCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            }));
        }
    }["FloatingSensorCard.useCallback[handlePointerMove]"], [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSensorCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
                const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
                const raw = {
                    left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                    maxLeft,
                    maxBottom
                });
                setPosition(next);
                savePosition(next);
            }
            (_releasePointerCapture = (_this = e.target).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingSensorCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10",
        style: {
            left: position.left,
            bottom: position.bottom
        },
        children: [
            editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 border-b border-white/10 py-1.5 px-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "button",
                        tabIndex: 0,
                        onPointerDown: handlePointerDown,
                        onPointerMove: handlePointerMove,
                        onPointerUp: handlePointerUp,
                        onPointerLeave: (e)=>{
                            if (isDragging) handlePointerUp(e);
                        },
                        className: "select-none touch-none flex-1 flex items-center justify-center text-white/50 text-xs hover:text-white/70 cursor-grab active:cursor-grabbing",
                        "aria-label": "Drag to move",
                        children: "Sleep om te verplaatsen"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this),
                    onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onEdit,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Edit sensor card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
                            lineNumber: 174,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
                        lineNumber: 168,
                        columnNumber: 13
                    }, this),
                    onRemove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onRemove,
                        className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                        "aria-label": "Remove sensor card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-3.5 w-3.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
                            lineNumber: 184,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
                        lineNumber: 178,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
                lineNumber: 152,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SensorCardWidget"], {
                    title: title,
                    entity_id: entity_id,
                    icon: icon,
                    size: size,
                    conditions: conditions
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
                    lineNumber: 190,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_s(FloatingSensorCard, "MzuwgivlV7eqAhJNlHB2UCrj+Uw=");
_c = FloatingSensorCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingSensorCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-climate-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLIMATE_ICON_OPTIONS",
    ()=>CLIMATE_ICON_OPTIONS,
    "FloatingClimateCard",
    ()=>FloatingClimateCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-client] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/snowflake.js [app-client] (ecmascript) <export default as Snowflake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flame.js [app-client] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$air$2d$vent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AirVent$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/air-vent.js [app-client] (ecmascript) <export default as AirVent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-2-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const CLIMATE_ICONS = {
    AirVent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$air$2d$vent$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AirVent$3e$__["AirVent"], {
        className: "h-3.5 w-3.5",
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 11,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0)),
    Thermometer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
        className: "h-3.5 w-3.5",
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 12,
        columnNumber: 16
    }, ("TURBOPACK compile-time value", void 0)),
    Snowflake: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__["Snowflake"], {
        className: "h-3.5 w-3.5",
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 13,
        columnNumber: 14
    }, ("TURBOPACK compile-time value", void 0)),
    Flame: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"], {
        className: "h-3.5 w-3.5",
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 14,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0)),
    Wind: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
        className: "h-3.5 w-3.5",
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)),
    Sun: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
        className: "h-3.5 w-3.5",
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 16,
        columnNumber: 8
    }, ("TURBOPACK compile-time value", void 0)),
    Home: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
        className: "h-3.5 w-3.5",
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 17,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0))
};
const CLIMATE_ICON_OPTIONS = Object.keys(CLIMATE_ICONS).sort();
const STORAGE_KEY = "dashboard.floatingClimateCardPosition";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 320;
const PILL_BAR_WIDTH = 52;
function loadPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY);
        if (!s) return null;
        const p = JSON.parse(s);
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.bottom) === "number") return {
            left: p.left,
            bottom: p.bottom
        };
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.top) === "number") {
            return {
                left: p.left,
                bottom: window.innerHeight - p.top - 200
            };
        }
    } catch (e) {
    // ignore
    }
    return null;
}
function savePosition(p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        left: window.innerWidth - CARD_WIDTH - DEFAULT_OFFSET - 344,
        bottom: DEFAULT_OFFSET
    };
}
function FloatingClimateCard(param) {
    let { widgets: widgetsProp, title: titleProp, entity_id: entityIdProp, editMode = false, onRemove, onEdit } = param;
    var _widgets_;
    _s();
    const widgets = widgetsProp !== null && widgetsProp !== void 0 ? widgetsProp : titleProp != null && entityIdProp != null ? [
        {
            id: "",
            title: titleProp,
            entity_id: entityIdProp,
            type: "climate_card"
        }
    ] : [];
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingClimateCard.useEffect": ()=>{
            if (widgets.length === 0) return;
            setSelectedId({
                "FloatingClimateCard.useEffect": (prev)=>{
                    var _widgets_;
                    const stillValid = prev != null && widgets.some({
                        "FloatingClimateCard.useEffect": (w)=>w.id === prev
                    }["FloatingClimateCard.useEffect"]);
                    if (stillValid) return prev;
                    var _widgets__id;
                    return (_widgets__id = (_widgets_ = widgets[0]) === null || _widgets_ === void 0 ? void 0 : _widgets_.id) !== null && _widgets__id !== void 0 ? _widgets__id : null;
                }
            }["FloatingClimateCard.useEffect"]);
        }
    }["FloatingClimateCard.useEffect"], [
        widgets
    ]);
    var _ref;
    const effectiveSelectedId = (_ref = selectedId !== null && selectedId !== void 0 ? selectedId : (_widgets_ = widgets[0]) === null || _widgets_ === void 0 ? void 0 : _widgets_.id) !== null && _ref !== void 0 ? _ref : null;
    var _widgets_find;
    const selected = (_widgets_find = widgets.find((w)=>w.id === effectiveSelectedId)) !== null && _widgets_find !== void 0 ? _widgets_find : widgets[0];
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingClimateCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition()) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                bottom: DEFAULT_OFFSET
            };
        }
    }["FloatingClimateCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const hasPills = widgets.length > 1;
    const totalWidth = hasPills ? CARD_WIDTH + PILL_BAR_WIDTH : CARD_WIDTH;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingClimateCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition();
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
            setPosition(p);
            savePosition(p);
        }
    }["FloatingClimateCard.useEffect"], [
        totalWidth
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[handlePointerDown]": (e)=>{
            var _setPointerCapture, _this;
            if (!editMode) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this = e.target).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
        }
    }["FloatingClimateCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            }));
        }
    }["FloatingClimateCard.useCallback[handlePointerMove]"], [
        isDragging,
        maxLeft
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
                const raw = {
                    left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                    maxLeft,
                    maxBottom
                });
                setPosition(next);
                savePosition(next);
            }
            (_releasePointerCapture = (_this = e.target).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingClimateCard.useCallback[handlePointerUp]"], [
        isDragging,
        maxLeft
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed z-30 flex shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10",
        style: {
            left: position.left,
            bottom: position.bottom,
            width: totalWidth
        },
        children: [
            hasPills && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-0.5 py-2 pl-2 pr-1.5 border-r border-white/10 shrink-0 w-[52px]",
                children: widgets.map((w)=>{
                    var _w_title_charAt, _w_title;
                    const isSelected = w.id === effectiveSelectedId;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setSelectedId(w.id),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center rounded-lg p-2 text-xs font-medium transition-colors", isSelected ? "bg-[#4D2FB2] text-white shadow-md" : "text-white/70 hover:text-white hover:bg-white/10"),
                        "aria-label": w.title || "Climate",
                        title: w.title || "Climate",
                        children: w.icon && CLIMATE_ICONS[w.icon] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex shrink-0",
                            children: CLIMATE_ICONS[w.icon]
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                            lineNumber: 218,
                            columnNumber: 19
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: ((_w_title = w.title) === null || _w_title === void 0 ? void 0 : (_w_title_charAt = _w_title.charAt(0)) === null || _w_title_charAt === void 0 ? void 0 : _w_title_charAt.toUpperCase()) || "—"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                            lineNumber: 220,
                            columnNumber: 19
                        }, this)
                    }, w.id, false, {
                        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                        lineNumber: 204,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                lineNumber: 200,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col min-w-0 flex-1 w-[320px]",
                children: [
                    editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2 border-b border-white/10 py-1.5 px-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                role: "button",
                                tabIndex: 0,
                                onPointerDown: handlePointerDown,
                                onPointerMove: handlePointerMove,
                                onPointerUp: handlePointerUp,
                                onPointerLeave: (e)=>{
                                    if (isDragging) handlePointerUp(e);
                                },
                                className: "select-none touch-none flex-1 flex items-center justify-center text-white/50 text-xs hover:text-white/70 cursor-grab active:cursor-grabbing",
                                "aria-label": "Sleep om te verplaatsen",
                                children: "Sleep om te verplaatsen"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this),
                            onEdit && selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>onEdit(selected.id),
                                className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                                "aria-label": "Edit climate card",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                    lineNumber: 251,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                lineNumber: 245,
                                columnNumber: 15
                            }, this),
                            onRemove && selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>onRemove(selected.id),
                                className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white",
                                "aria-label": "Remove climate card",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                    lineNumber: 261,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                lineNumber: 255,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                        lineNumber: 229,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
                        children: selected && selected.type === "climate_card_2" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateCard2Widget"], {
                            title: selected.title,
                            entity_id: selected.entity_id,
                            size: "md",
                            onMoreClick: editMode ? ()=>selected.id && (onEdit === null || onEdit === void 0 ? void 0 : onEdit(selected.id)) : undefined
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                            lineNumber: 268,
                            columnNumber: 13
                        }, this) : selected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateCardWidget"], {
                            title: selected.title,
                            entity_id: selected.entity_id,
                            size: "md"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                            lineNumber: 275,
                            columnNumber: 13
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
}
_s(FloatingClimateCard, "BnW6mpFbKgkA0tdqJqiKXoxfHu8=");
_c = FloatingClimateCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingClimateCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/widget-types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$usage$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/energy-usage-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$control$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/light-control-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$wifi$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/wifi-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$charge$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-charge-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$lighting$2d$brightness$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/lighting-brightness-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/media-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$media$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-media-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-2-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$solar$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-solar-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/weather-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$weather$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-weather-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/vacuum-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$vacuum$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-vacuum-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/sensor-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$sensor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-sensor-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-climate-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$widget$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/widget-types.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLIMATE_ICON_OPTIONS",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLIMATE_ICON_OPTIONS"],
    "ClimateCard2Widget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateCard2Widget"],
    "ClimateCardWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateCardWidget"],
    "ClimateWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateWidget"],
    "EnergyUsageWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$usage$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyUsageWidget"],
    "FloatingClimateCard",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingClimateCard"],
    "FloatingMediaCard",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$media$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingMediaCard"],
    "FloatingSensorCard",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$sensor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingSensorCard"],
    "FloatingSolarCard",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$solar$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingSolarCard"],
    "FloatingVacuumCard",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$vacuum$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingVacuumCard"],
    "FloatingWeatherCard",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$weather$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingWeatherCard"],
    "LightControlWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$control$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LightControlWidget"],
    "LightingBrightnessWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$lighting$2d$brightness$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LightingBrightnessWidget"],
    "MediaCardWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MediaCardWidget"],
    "SENSOR_ICON_OPTIONS",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SENSOR_ICON_OPTIONS"],
    "SensorCardWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SensorCardWidget"],
    "SolarCardWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SolarCardWidget"],
    "SolarChargeWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$charge$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SolarChargeWidget"],
    "VACUUM_ICON_OPTIONS",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VACUUM_ICON_OPTIONS"],
    "VacuumCardWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VacuumCardWidget"],
    "WeatherCardWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WeatherCardWidget"],
    "WifiWidget",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$wifi$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WifiWidget"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$usage$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/energy-usage-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$control$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/light-control-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$wifi$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/wifi-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$charge$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-charge-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$lighting$2d$brightness$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/lighting-brightness-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/media-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$media$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-media-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-2-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$solar$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-solar-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/weather-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$weather$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-weather-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/vacuum-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$vacuum$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-vacuum-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/sensor-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$sensor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-sensor-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-climate-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$widget$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/widget-types.ts [app-client] (ecmascript)");
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
}
_s(useEntityStatePolling, "EnyhyBPbRAx8ceOIyQyyEytFHbI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/offline-pill.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfflinePill",
    ()=>OfflinePill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function OfflinePill(param) {
    let { className } = param;
    _s();
    const isOffline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "OfflinePill.useEntityStateStore[isOffline]": (s)=>s.error != null
    }["OfflinePill.useEntityStateStore[isOffline]"]);
    if (!isOffline) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center rounded-full bg-red-500/90 px-2.5 py-0.5 text-xs font-medium text-white", className),
        children: "Offline"
    }, void 0, false, {
        fileName: "[project]/src/components/offline-pill.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_s(OfflinePill, "jdpR3xitAUtnc0FyQH8Vo5sqxF4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = OfflinePill;
var _c;
__turbopack_context__.k.register(_c, "OfflinePill");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/dashboards/[id]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardEditPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/app-shell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$grid$2d$layout$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-grid-layout/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$usage$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/energy-usage-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$control$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/light-control-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$wifi$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/wifi-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$charge$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-charge-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$lighting$2d$brightness$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/lighting-brightness-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/media-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$media$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-media-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-2-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-climate-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$solar$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-solar-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$weather$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-weather-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/weather-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/vacuum-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$vacuum$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-vacuum-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/sensor-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$sensor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-sensor-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-entity-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$offline$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/offline-pill.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
/** Alleen deze types kunnen als tile worden toegevoegd (floating cards). */ const ADDABLE_WIDGET_TYPES = [
    "climate_card",
    "climate_card_2",
    "media_card",
    "solar_card",
    "sensor_card",
    "weather_card",
    "vacuum_card"
];
/** Map widget type to HA domain for filtering entities */ const WIDGET_TYPE_DOMAIN = {
    energy_usage: "sensor",
    light_control: "light",
    wifi: "sensor",
    solar_charge: "sensor",
    climate: "climate",
    climate_card: "climate",
    climate_card_2: "climate",
    lighting_brightness: "light",
    media_card: "media_player",
    solar_card: "sensor",
    sensor_card: "sensor",
    weather_card: "weather",
    vacuum_card: "vacuum"
};
function parseLayout(layout) {
    if (!layout) return [];
    try {
        const arr = JSON.parse(layout);
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        return [];
    }
}
function parseWidgets(widgets) {
    if (!widgets) return [];
    try {
        const arr = JSON.parse(widgets);
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        return [];
    }
}
function WidgetByType(param) {
    let { type, title, entity_id, consumption_entity_id, show_icon, script_ids, script_names, cleaned_area_entity_id, icon, size, conditions } = param;
    _s();
    var _ref;
    const sizeProp = (_ref = size) !== null && _ref !== void 0 ? _ref : "md";
    const live = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "WidgetByType.useEntityStateStore[live]": (s)=>s.getState(entity_id)
    }["WidgetByType.useEntityStateStore[live]"]);
    const num = (live === null || live === void 0 ? void 0 : live.state) != null ? Number(live.state) : undefined;
    const onOff = (live === null || live === void 0 ? void 0 : live.state) === "on" ? "on" : "off";
    switch(type){
        case "energy_usage":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$usage$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyUsageWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp,
                value: num
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 129,
                columnNumber: 14
            }, this);
        case "light_control":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$control$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LightControlWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp,
                value: num,
                state: (live === null || live === void 0 ? void 0 : live.state) === "on" ? "on" : "off"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 132,
                columnNumber: 9
            }, this);
        case "wifi":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$wifi$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WifiWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp,
                value: onOff
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 141,
                columnNumber: 14
            }, this);
        case "solar_charge":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$charge$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SolarChargeWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp,
                value: num
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 143,
                columnNumber: 14
            }, this);
        case "climate":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp,
                value: num
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 145,
                columnNumber: 14
            }, this);
        case "lighting_brightness":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$lighting$2d$brightness$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LightingBrightnessWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp,
                value: num
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 147,
                columnNumber: 14
            }, this);
        case "media_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MediaCardWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 149,
                columnNumber: 14
            }, this);
        case "climate_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateCardWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 151,
                columnNumber: 14
            }, this);
        case "climate_card_2":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateCard2Widget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 153,
                columnNumber: 14
            }, this);
        case "solar_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SolarCardWidget"], {
                title: title,
                entity_id: entity_id,
                consumption_entity_id: consumption_entity_id,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 156,
                columnNumber: 9
            }, this);
        case "weather_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WeatherCardWidget"], {
                title: title,
                entity_id: entity_id,
                show_icon: show_icon,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 165,
                columnNumber: 9
            }, this);
        case "vacuum_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VacuumCardWidget"], {
                title: title,
                entity_id: entity_id,
                script_ids: script_ids,
                script_names: script_names,
                cleaned_area_entity_id: cleaned_area_entity_id,
                icon: icon,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 174,
                columnNumber: 9
            }, this);
        case "sensor_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SensorCardWidget"], {
                title: title,
                entity_id: entity_id,
                icon: icon,
                size: sizeProp,
                conditions: conditions
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 186,
                columnNumber: 9
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-card border border-dashed p-4 text-sm text-gray-500",
                children: title || type
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 196,
                columnNumber: 9
            }, this);
    }
}
_s(WidgetByType, "A2C5bVxIrYFQDm6RL1CKuPUwCYM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = WidgetByType;
function DashboardEditPage() {
    _s1();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const id = params === null || params === void 0 ? void 0 : params.id;
    const [editMode, setEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [layout, setLayout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [widgets, setWidgets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [welcomeTitle, setWelcomeTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [welcomeSubtitle, setWelcomeSubtitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [initialized, setInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [entities, setEntities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [addTileOpen, setAddTileOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [addTileStep, setAddTileStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("type");
    const [addTileSelectedType, setAddTileSelectedType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editingWidgetId, setEditingWidgetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: "",
        entity_id: "",
        consumption_entity_id: "",
        show_icon: true,
        script_ids: [],
        script_names: {},
        cleaned_area_entity_id: "",
        icon: "",
        size: "md",
        conditions: []
    });
    const addTileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [iconSearch, setIconSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [vacuumIconSearch, setVacuumIconSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sensorIconSearch, setSensorIconSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sensorCardEditTab, setSensorCardEditTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("general");
    const editingWidget = editingWidgetId ? widgets.find((w)=>w.id === editingWidgetId) : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardEditPage.useEffect": ()=>{
            if (editingWidget) {
                var _editingWidget_title, _editingWidget_entity_id, _editingWidget_consumption_entity_id, _editingWidget_script_ids, _editingWidget_script_names, _editingWidget_cleaned_area_entity_id, _editingWidget_icon, _editingWidget_size, _editingWidget_conditions;
                setEditForm({
                    title: (_editingWidget_title = editingWidget.title) !== null && _editingWidget_title !== void 0 ? _editingWidget_title : "",
                    entity_id: (_editingWidget_entity_id = editingWidget.entity_id) !== null && _editingWidget_entity_id !== void 0 ? _editingWidget_entity_id : "",
                    consumption_entity_id: (_editingWidget_consumption_entity_id = editingWidget.consumption_entity_id) !== null && _editingWidget_consumption_entity_id !== void 0 ? _editingWidget_consumption_entity_id : "",
                    show_icon: editingWidget.show_icon !== false,
                    script_ids: (_editingWidget_script_ids = editingWidget.script_ids) !== null && _editingWidget_script_ids !== void 0 ? _editingWidget_script_ids : [],
                    script_names: (_editingWidget_script_names = editingWidget.script_names) !== null && _editingWidget_script_names !== void 0 ? _editingWidget_script_names : {},
                    cleaned_area_entity_id: (_editingWidget_cleaned_area_entity_id = editingWidget.cleaned_area_entity_id) !== null && _editingWidget_cleaned_area_entity_id !== void 0 ? _editingWidget_cleaned_area_entity_id : "",
                    icon: (_editingWidget_icon = editingWidget.icon) !== null && _editingWidget_icon !== void 0 ? _editingWidget_icon : "",
                    size: (_editingWidget_size = editingWidget.size) !== null && _editingWidget_size !== void 0 ? _editingWidget_size : "md",
                    conditions: (_editingWidget_conditions = editingWidget.conditions) !== null && _editingWidget_conditions !== void 0 ? _editingWidget_conditions : []
                });
                setIconSearch("");
                var _editingWidget_icon1;
                setVacuumIconSearch(editingWidget.type === "vacuum_card" ? (_editingWidget_icon1 = editingWidget.icon) !== null && _editingWidget_icon1 !== void 0 ? _editingWidget_icon1 : "" : "");
                var _editingWidget_icon2;
                setSensorIconSearch(editingWidget.type === "sensor_card" ? (_editingWidget_icon2 = editingWidget.icon) !== null && _editingWidget_icon2 !== void 0 ? _editingWidget_icon2 : "" : "");
                if (editingWidget.type === "sensor_card") setSensorCardEditTab("general");
            }
        }
    }["DashboardEditPage.useEffect"], [
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.id,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.title,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.entity_id,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.consumption_entity_id,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.show_icon,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.script_ids,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.script_names,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.cleaned_area_entity_id,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.icon,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.size,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.conditions,
        editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.type
    ]);
    const { data, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "dashboard",
            id
        ],
        queryFn: {
            "DashboardEditPage.useQuery": async ()=>{
                const res = await fetch("/api/dashboards/".concat(id));
                if (!res.ok) throw new Error("Failed to load");
                return res.json();
            }
        }["DashboardEditPage.useQuery"],
        enabled: !!id
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStatePolling"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardEditPage.useEffect": ()=>{
            if (!data || initialized) return;
            const w = parseWidgets(data.widgets);
            setWidgets(w);
            const parsed = parseLayout(data.layout);
            if (parsed.length > 0) {
                setLayout(parsed);
            } else if (w.length > 0) {
                setLayout(w.map({
                    "DashboardEditPage.useEffect": (widget, i)=>({
                            i: widget.id,
                            x: i % 3 * 4,
                            y: Math.floor(i / 3) * 2,
                            w: 4,
                            h: 2
                        })
                }["DashboardEditPage.useEffect"]));
            }
            var _data_welcomeTitle;
            setWelcomeTitle((_data_welcomeTitle = data.welcomeTitle) !== null && _data_welcomeTitle !== void 0 ? _data_welcomeTitle : "");
            var _data_welcomeSubtitle;
            setWelcomeSubtitle((_data_welcomeSubtitle = data.welcomeSubtitle) !== null && _data_welcomeSubtitle !== void 0 ? _data_welcomeSubtitle : "");
            setInitialized(true);
        }
    }["DashboardEditPage.useEffect"], [
        data,
        initialized
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardEditPage.useEffect": ()=>{
            if (!editMode) return;
            fetch("/api/ha/entities").then({
                "DashboardEditPage.useEffect": (r)=>r.json()
            }["DashboardEditPage.useEffect"]).then({
                "DashboardEditPage.useEffect": (data)=>Array.isArray(data) ? setEntities(data) : setEntities([])
            }["DashboardEditPage.useEffect"]).catch({
                "DashboardEditPage.useEffect": ()=>setEntities([])
            }["DashboardEditPage.useEffect"]);
        }
    }["DashboardEditPage.useEffect"], [
        editMode
    ]);
    const saveMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "DashboardEditPage.useMutation[saveMutation]": async (payload)=>{
                const res = await fetch("/api/dashboards/".concat(id), {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        layout: JSON.stringify(payload.layout),
                        widgets: JSON.stringify(payload.widgets),
                        ...payload.welcomeTitle !== undefined && {
                            welcomeTitle: payload.welcomeTitle || null
                        },
                        ...payload.welcomeSubtitle !== undefined && {
                            welcomeSubtitle: payload.welcomeSubtitle || null
                        }
                    })
                });
                if (!res.ok) throw new Error("Save failed");
                return res.json();
            }
        }["DashboardEditPage.useMutation[saveMutation]"],
        onSuccess: {
            "DashboardEditPage.useMutation[saveMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        "dashboard",
                        id
                    ]
                });
            }
        }["DashboardEditPage.useMutation[saveMutation]"]
    });
    const onLayoutChange = (newLayout)=>{
        setLayout((prev)=>{
            const floatingItems = prev.filter((item)=>{
                var _widgets_find;
                const type = (_widgets_find = widgets.find((w)=>w.id === item.i)) === null || _widgets_find === void 0 ? void 0 : _widgets_find.type;
                return type === "media_card" || type === "climate_card";
            });
            return [
                ...newLayout,
                ...floatingItems
            ];
        });
    };
    const layoutForGrid = layout.filter((item)=>{
        var _widgets_find;
        const type = (_widgets_find = widgets.find((w)=>w.id === item.i)) === null || _widgets_find === void 0 ? void 0 : _widgets_find.type;
        return type !== "media_card" && type !== "climate_card" && type !== "climate_card_2" && type !== "solar_card" && type !== "sensor_card" && type !== "weather_card" && type !== "vacuum_card";
    });
    const layoutMap = new Map(layout.map((item)=>[
            item.i,
            item
        ]));
    const handleSave = ()=>{
        saveMutation.mutate({
            layout,
            widgets,
            welcomeTitle,
            welcomeSubtitle
        });
        setEditMode(false);
    };
    function handleAddTile(type, entityId) {
        const newId = crypto.randomUUID();
        const newWidget = {
            id: newId,
            type,
            title: type.replace(/_/g, " "),
            entity_id: entityId
        };
        const maxY = layout.length === 0 ? 0 : Math.max(...layout.map((item)=>item.y + item.h));
        const newLayoutItem = {
            i: newId,
            x: 0,
            y: maxY,
            w: 4,
            h: 2
        };
        const newWidgets = [
            ...widgets,
            newWidget
        ];
        const newLayout = type === "solar_card" || type === "sensor_card" || type === "weather_card" || type === "climate_card" || type === "climate_card_2" || type === "vacuum_card" ? layout : [
            ...layout,
            newLayoutItem
        ];
        setWidgets(newWidgets);
        setLayout(newLayout);
        setAddTileOpen(false);
        setAddTileStep("type");
        setAddTileSelectedType(null);
        saveMutation.mutate({
            layout: newLayout,
            widgets: newWidgets,
            welcomeTitle,
            welcomeSubtitle
        });
    }
    const domain = addTileSelectedType ? WIDGET_TYPE_DOMAIN[addTileSelectedType] : null;
    const entitiesToShow = domain != null ? entities.filter((e)=>e.entity_id.startsWith(domain + ".")) : entities;
    function handleRemoveTile(widgetId) {
        setWidgets((prev)=>prev.filter((w)=>w.id !== widgetId));
        setLayout((prev)=>prev.filter((item)=>item.i !== widgetId));
    }
    function handleUpdateTile(widgetId, updates) {
        setWidgets((prev)=>prev.map((w)=>w.id === widgetId ? {
                    ...w,
                    ...updates
                } : w));
        setEditingWidgetId(null);
    }
    if (!id) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppShell"], {
            activeTab: "/dashboards",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500",
                children: "Invalid dashboard id."
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 417,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
            lineNumber: 416,
            columnNumber: 7
        }, this);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardEditPage.useEffect": ()=>{
            if (error && id) router.replace("/dashboards");
        }
    }["DashboardEditPage.useEffect"], [
        error,
        id,
        router
    ]);
    if (isLoading || error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppShell"], {
            activeTab: "/dashboards",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500",
                children: error ? "Dashboard not found, redirecting…" : "Loading…"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 429,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
            lineNumber: 428,
            columnNumber: 7
        }, this);
    }
    const headerEndAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: editMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    ref: addTileRef,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setAddTileOpen((o)=>!o),
                            className: "flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-90",
                            style: {
                                backgroundColor: "#4D2FB2"
                            },
                            "aria-label": "Add tile",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                lineNumber: 448,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                            lineNumber: 441,
                            columnNumber: 13
                        }, this),
                        addTileOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "fixed inset-0 z-20",
                                    "aria-hidden": true,
                                    onClick: ()=>{
                                        setAddTileOpen(false);
                                        setAddTileStep("type");
                                        setAddTileSelectedType(null);
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                    lineNumber: 452,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute right-0 top-full z-30 mt-1 w-64 max-h-80 flex flex-col rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-800",
                                    children: addTileStep === "type" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-1",
                                        children: ADDABLE_WIDGET_TYPES.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setAddTileSelectedType(type);
                                                    setAddTileStep("entity");
                                                },
                                                className: "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10",
                                                children: type.replace(/_/g, " ")
                                            }, type, false, {
                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                lineNumber: 465,
                                                columnNumber: 25
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                        lineNumber: 463,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setAddTileStep("type");
                                                    setAddTileSelectedType(null);
                                                },
                                                className: "sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border-b border-gray-100 dark:border-white/10",
                                                children: [
                                                    "← ",
                                                    addTileSelectedType === null || addTileSelectedType === void 0 ? void 0 : addTileSelectedType.replace(/_/g, " "),
                                                    " – choose entity"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                lineNumber: 480,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "overflow-auto py-1 max-h-56",
                                                children: entitiesToShow.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "px-4 py-3 text-sm text-gray-500 dark:text-gray-400",
                                                    children: "No entities found. Check Settings for your HA connection."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 492,
                                                    columnNumber: 27
                                                }, this) : entitiesToShow.map((e)=>{
                                                    var _this;
                                                    var _friendly_name;
                                                    const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>addTileSelectedType && handleAddTile(addTileSelectedType, e.entity_id),
                                                        className: "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10 truncate",
                                                        title: e.entity_id,
                                                        children: name
                                                    }, e.entity_id, false, {
                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                        lineNumber: 501,
                                                        columnNumber: 31
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                lineNumber: 490,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                    lineNumber: 461,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                    lineNumber: 440,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: handleSave,
                    disabled: saveMutation.isPending,
                    className: "flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-white/20",
                    "aria-label": "Done editing",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 530,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                    lineNumber: 523,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: ()=>setEditMode(true),
            className: "flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-90",
            style: {
                backgroundColor: "#4D2FB2"
            },
            "aria-label": "Edit dashboard",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 541,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
            lineNumber: 534,
            columnNumber: 9
        }, this)
    }, void 0, false);
    var _editForm_consumption_entity_id, _editForm_script_ids, _editForm_script_ids1, _editForm_cleaned_area_entity_id, _editForm_size, _editForm_conditions;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppShell"], {
        activeTab: "/dashboards",
        headerEndAction: headerEndAction,
        welcomeTitle: welcomeTitle || undefined,
        welcomeSubtitle: welcomeSubtitle || undefined,
        welcomeEditable: editMode,
        onWelcomeChange: editMode ? (param)=>{
            let { title, subtitle } = param;
            setWelcomeTitle(title);
            setWelcomeSubtitle(subtitle);
        } : undefined,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$offline$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OfflinePill"], {}, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 561,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                    lineNumber: 560,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-card overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$grid$2d$layout$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        className: "layout",
                        layout: layoutForGrid,
                        onLayoutChange: onLayoutChange,
                        cols: 12,
                        rowHeight: 52,
                        width: 1200,
                        margin: [
                            6,
                            4
                        ],
                        containerPadding: [
                            0,
                            0
                        ],
                        isDraggable: editMode,
                        isResizable: editMode,
                        draggableHandle: editMode ? ".tile-drag-handle" : undefined,
                        children: widgets.filter((w)=>w.type !== "media_card" && w.type !== "climate_card" && w.type !== "climate_card_2" && w.type !== "solar_card" && w.type !== "weather_card" && w.type !== "vacuum_card").map((w)=>{
                            const item = layoutMap.get(w.id);
                            if (!item) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-full w-full",
                                children: [
                                    editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setEditingWidgetId(w.id),
                                                className: "absolute -right-8 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-white shadow hover:bg-gray-700",
                                                "aria-label": "Edit tile",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 593,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                lineNumber: 587,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleRemoveTile(w.id),
                                                className: "absolute -right-1 -top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600",
                                                "aria-label": "Remove tile",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 601,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                lineNumber: 595,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-full w-full", editMode && "tile-drag-handle cursor-grab"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WidgetByType, {
                                            type: w.type,
                                            title: w.title,
                                            entity_id: w.entity_id,
                                            consumption_entity_id: w.consumption_entity_id,
                                            show_icon: w.show_icon,
                                            script_ids: w.script_ids,
                                            script_names: w.script_names,
                                            cleaned_area_entity_id: w.cleaned_area_entity_id,
                                            icon: w.icon,
                                            size: w.size,
                                            conditions: w.conditions
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 606,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                        lineNumber: 605,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, w.id, true, {
                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                lineNumber: 584,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 565,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                    lineNumber: 564,
                    columnNumber: 9
                }, this),
                (()=>{
                    const firstMedia = widgets.find((w)=>w.type === "media_card");
                    var _firstMedia_title;
                    return firstMedia ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$media$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingMediaCard"], {
                        title: (_firstMedia_title = firstMedia.title) !== null && _firstMedia_title !== void 0 ? _firstMedia_title : "Media",
                        entity_id: firstMedia.entity_id,
                        editMode: editMode,
                        onEdit: editMode ? ()=>setEditingWidgetId(firstMedia.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstMedia.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 629,
                        columnNumber: 13
                    }, this) : null;
                })(),
                (()=>{
                    const climateCards = widgets.filter((w)=>w.type === "climate_card" || w.type === "climate_card_2");
                    return climateCards.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingClimateCard"], {
                        widgets: climateCards.map((w)=>{
                            var _w_title;
                            return {
                                id: w.id,
                                title: (_w_title = w.title) !== null && _w_title !== void 0 ? _w_title : "Climate",
                                entity_id: w.entity_id,
                                icon: w.icon,
                                type: w.type === "climate_card_2" ? "climate_card_2" : "climate_card"
                            };
                        }),
                        editMode: editMode,
                        onEdit: editMode ? (id)=>setEditingWidgetId(id) : undefined,
                        onRemove: editMode ? (id)=>handleRemoveTile(id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 652,
                        columnNumber: 13
                    }, this) : null;
                })(),
                (()=>{
                    const firstSolar = widgets.find((w)=>w.type === "solar_card");
                    var _firstSolar_title;
                    return firstSolar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$solar$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingSolarCard"], {
                        title: (_firstSolar_title = firstSolar.title) !== null && _firstSolar_title !== void 0 ? _firstSolar_title : "Zonnepanelen",
                        entity_id: firstSolar.entity_id,
                        consumption_entity_id: firstSolar.consumption_entity_id,
                        editMode: editMode,
                        onEdit: editMode ? ()=>setEditingWidgetId(firstSolar.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstSolar.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 670,
                        columnNumber: 13
                    }, this) : null;
                })(),
                (()=>{
                    const firstSensor = widgets.find((w)=>w.type === "sensor_card");
                    var _firstSensor_title, _ref;
                    return firstSensor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$sensor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingSensorCard"], {
                        title: (_firstSensor_title = firstSensor.title) !== null && _firstSensor_title !== void 0 ? _firstSensor_title : "Sensor",
                        entity_id: firstSensor.entity_id,
                        icon: firstSensor.icon,
                        size: (_ref = firstSensor.size) !== null && _ref !== void 0 ? _ref : "md",
                        conditions: firstSensor.conditions,
                        editMode: editMode,
                        onEdit: editMode ? ()=>setEditingWidgetId(firstSensor.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstSensor.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 692,
                        columnNumber: 13
                    }, this) : null;
                })(),
                (()=>{
                    const firstWeather = widgets.find((w)=>w.type === "weather_card");
                    var _firstWeather_title;
                    return firstWeather ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$weather$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingWeatherCard"], {
                        title: (_firstWeather_title = firstWeather.title) !== null && _firstWeather_title !== void 0 ? _firstWeather_title : "Weather",
                        entity_id: firstWeather.entity_id,
                        show_icon: firstWeather.show_icon,
                        editMode: editMode,
                        onEdit: editMode ? ()=>setEditingWidgetId(firstWeather.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstWeather.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 716,
                        columnNumber: 13
                    }, this) : null;
                })(),
                (()=>{
                    const firstVacuum = widgets.find((w)=>w.type === "vacuum_card");
                    var _firstVacuum_title;
                    return firstVacuum ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$vacuum$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingVacuumCard"], {
                        title: (_firstVacuum_title = firstVacuum.title) !== null && _firstVacuum_title !== void 0 ? _firstVacuum_title : "Stofzuiger",
                        entity_id: firstVacuum.entity_id,
                        script_ids: firstVacuum.script_ids,
                        script_names: firstVacuum.script_names,
                        cleaned_area_entity_id: firstVacuum.cleaned_area_entity_id,
                        icon: firstVacuum.icon,
                        editMode: editMode,
                        onEdit: editMode ? ()=>setEditingWidgetId(firstVacuum.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstVacuum.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 738,
                        columnNumber: 13
                    }, this) : null;
                })(),
                editingWidgetId && editingWidget && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 z-40 bg-black/50",
                            "aria-hidden": true,
                            onClick: ()=>setEditingWidgetId(null)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                            lineNumber: 762,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-gray-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100",
                                    children: "Edit tile"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                    lineNumber: 768,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                    children: "Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 773,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editForm.title,
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                title: e.target.value
                                                            })),
                                                    placeholder: "Tile name",
                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 776,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 772,
                                            columnNumber: 17
                                        }, this),
                                        editingWidget.type === "climate_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                    children: "Icoon (optioneel, i.p.v. naam in tab)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 788,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: iconSearch,
                                                    onChange: (e)=>setIconSearch(e.target.value),
                                                    onFocus: ()=>{
                                                        var _editForm_icon;
                                                        return setIconSearch((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : "");
                                                    },
                                                    placeholder: "Zoek icoon (bijv. air, therm…)",
                                                    className: "mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 791,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                setEditForm((prev)=>({
                                                                        ...prev,
                                                                        icon: undefined
                                                                    }));
                                                                setIconSearch("");
                                                            },
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", !editForm.icon ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                            children: "Geen"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 800,
                                                            columnNumber: 23
                                                        }, this),
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLIMATE_ICON_OPTIONS"].filter((name)=>name.toLowerCase().includes((iconSearch || "").toLowerCase())).map((name)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    setEditForm((prev)=>({
                                                                            ...prev,
                                                                            icon: name
                                                                        }));
                                                                    setIconSearch(name);
                                                                },
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", editForm.icon === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                children: name
                                                            }, name, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 818,
                                                                columnNumber: 25
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 799,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 787,
                                            columnNumber: 19
                                        }, this),
                                        editingWidget.entity_id != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                    children: editingWidget.type === "solar_card" ? "Yield (opbrengst)" : "Entity"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 840,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: editForm.entity_id,
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                entity_id: e.target.value
                                                            })),
                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100",
                                                    children: (()=>{
                                                        var _WIDGET_TYPE_DOMAIN_editingWidget_type;
                                                        const domain = (_WIDGET_TYPE_DOMAIN_editingWidget_type = WIDGET_TYPE_DOMAIN[editingWidget.type]) !== null && _WIDGET_TYPE_DOMAIN_editingWidget_type !== void 0 ? _WIDGET_TYPE_DOMAIN_editingWidget_type : "sensor";
                                                        const options = entities.filter((e)=>e.entity_id.startsWith(domain + "."));
                                                        return options.map((e)=>{
                                                            var _this;
                                                            var _friendly_name;
                                                            const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: e.entity_id,
                                                                children: name
                                                            }, e.entity_id, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 861,
                                                                columnNumber: 29
                                                            }, this);
                                                        });
                                                    })()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 843,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 839,
                                            columnNumber: 19
                                        }, this),
                                        editingWidget.type === "solar_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                    children: "Consumption (verbruik, optioneel)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 872,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: (_editForm_consumption_entity_id = editForm.consumption_entity_id) !== null && _editForm_consumption_entity_id !== void 0 ? _editForm_consumption_entity_id : "",
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                consumption_entity_id: e.target.value || undefined
                                                            })),
                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Geen"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 885,
                                                            columnNumber: 23
                                                        }, this),
                                                        entities.filter((e)=>e.entity_id.startsWith("sensor.")).map((e)=>{
                                                            var _this;
                                                            var _friendly_name;
                                                            const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: e.entity_id,
                                                                children: name
                                                            }, e.entity_id, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 893,
                                                                columnNumber: 29
                                                            }, this);
                                                        })
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 875,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 871,
                                            columnNumber: 19
                                        }, this),
                                        editingWidget.type === "vacuum_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                    children: "Vacuum Room (scripts)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 903,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 dark:text-gray-400 mb-2",
                                                    children: "Kies scripts en geef ze optioneel een weergavenaam."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 906,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 p-2 space-y-1 mb-2",
                                                    children: [
                                                        entities.filter((e)=>e.entity_id.startsWith("script.")).map((e)=>{
                                                            var _this;
                                                            var _friendly_name;
                                                            const defaultName = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                            var _editForm_script_ids;
                                                            const checked = ((_editForm_script_ids = editForm.script_ids) !== null && _editForm_script_ids !== void 0 ? _editForm_script_ids : []).includes(e.entity_id);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: checked,
                                                                        onChange: ()=>{
                                                                            var _editForm_script_ids;
                                                                            const ids = (_editForm_script_ids = editForm.script_ids) !== null && _editForm_script_ids !== void 0 ? _editForm_script_ids : [];
                                                                            var _editForm_script_names;
                                                                            const names = {
                                                                                ...(_editForm_script_names = editForm.script_names) !== null && _editForm_script_names !== void 0 ? _editForm_script_names : {}
                                                                            };
                                                                            if (checked) {
                                                                                delete names[e.entity_id];
                                                                            }
                                                                            setEditForm((prev)=>({
                                                                                    ...prev,
                                                                                    script_ids: checked ? ids.filter((id)=>id !== e.entity_id) : [
                                                                                        ...ids,
                                                                                        e.entity_id
                                                                                    ],
                                                                                    script_names: names
                                                                                }));
                                                                        },
                                                                        className: "h-4 w-4 rounded border-gray-300 dark:border-white/20 text-[#4D2FB2] focus:ring-[#4D2FB2]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 920,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm truncate shrink-0 max-w-[140px]",
                                                                        title: e.entity_id,
                                                                        children: defaultName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 939,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, e.entity_id, true, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 916,
                                                                columnNumber: 29
                                                            }, this);
                                                        }),
                                                        entities.filter((e)=>e.entity_id.startsWith("script.")).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 py-2",
                                                            children: "Geen scripts gevonden. Sla eerst een verbinding op."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 944,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 909,
                                                    columnNumber: 21
                                                }, this),
                                                ((_editForm_script_ids = editForm.script_ids) !== null && _editForm_script_ids !== void 0 ? _editForm_script_ids : []).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Naam per script (optioneel)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 949,
                                                            columnNumber: 25
                                                        }, this),
                                                        ((_editForm_script_ids1 = editForm.script_ids) !== null && _editForm_script_ids1 !== void 0 ? _editForm_script_ids1 : []).map((scriptId)=>{
                                                            var _this, _editForm_script_names;
                                                            const e = entities.find((x)=>x.entity_id === scriptId);
                                                            var _friendly_name;
                                                            const defaultName = (_friendly_name = (_this = e === null || e === void 0 ? void 0 : e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : scriptId;
                                                            var _editForm_script_names_scriptId;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-gray-500 dark:text-gray-400 w-28 truncate shrink-0",
                                                                        title: scriptId,
                                                                        children: defaultName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 955,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: (_editForm_script_names_scriptId = (_editForm_script_names = editForm.script_names) === null || _editForm_script_names === void 0 ? void 0 : _editForm_script_names[scriptId]) !== null && _editForm_script_names_scriptId !== void 0 ? _editForm_script_names_scriptId : "",
                                                                        onChange: (e)=>setEditForm((prev)=>{
                                                                                var _prev_script_names;
                                                                                return {
                                                                                    ...prev,
                                                                                    script_names: {
                                                                                        ...(_prev_script_names = prev.script_names) !== null && _prev_script_names !== void 0 ? _prev_script_names : {},
                                                                                        [scriptId]: e.target.value || undefined
                                                                                    }
                                                                                };
                                                                            }),
                                                                        placeholder: defaultName,
                                                                        className: "flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 px-2 py-1.5 text-sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 956,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, scriptId, true, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 954,
                                                                columnNumber: 29
                                                            }, this);
                                                        })
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 948,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Sensor onder status (bijv. cleaned area)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 977,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: (_editForm_cleaned_area_entity_id = editForm.cleaned_area_entity_id) !== null && _editForm_cleaned_area_entity_id !== void 0 ? _editForm_cleaned_area_entity_id : "",
                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                        ...prev,
                                                                        cleaned_area_entity_id: e.target.value || undefined
                                                                    })),
                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "",
                                                                    children: "Geen"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 990,
                                                                    columnNumber: 25
                                                                }, this),
                                                                entities.filter((e)=>e.entity_id.startsWith("sensor.")).map((e)=>{
                                                                    var _this;
                                                                    var _friendly_name;
                                                                    const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: e.entity_id,
                                                                        children: name
                                                                    }, e.entity_id, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 996,
                                                                        columnNumber: 31
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 980,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 976,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Icoon"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1004,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: vacuumIconSearch,
                                                            onChange: (e)=>setVacuumIconSearch(e.target.value),
                                                            onFocus: ()=>{
                                                                var _ref;
                                                                return setVacuumIconSearch((_ref = vacuumIconSearch || editForm.icon) !== null && _ref !== void 0 ? _ref : "");
                                                            },
                                                            placeholder: "Zoek icoon (bijv. home, bot, sparkles…)",
                                                            className: "mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1007,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>{
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                icon: undefined
                                                                            }));
                                                                        setVacuumIconSearch("");
                                                                    },
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", !editForm.icon ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                    children: "Geen (Sparkles)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1016,
                                                                    columnNumber: 25
                                                                }, this),
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VACUUM_ICON_OPTIONS"].filter((name)=>name.toLowerCase().includes((vacuumIconSearch || "").toLowerCase())).map((name)=>{
                                                                    var _editForm_icon;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            setEditForm((prev)=>({
                                                                                    ...prev,
                                                                                    icon: name
                                                                                }));
                                                                            setVacuumIconSearch(name);
                                                                        },
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : "Sparkles") === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                        children: name
                                                                    }, name, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1034,
                                                                        columnNumber: 27
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1015,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1003,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 902,
                                            columnNumber: 19
                                        }, this),
                                        editingWidget.type === "sensor_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex rounded-lg border border-gray-200 dark:border-white/10 p-0.5 mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setSensorCardEditTab("general"),
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-md py-1.5 text-xs font-medium transition-colors", sensorCardEditTab === "general" ? "bg-[#4D2FB2] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"),
                                                            children: "Algemeen"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1058,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setSensorCardEditTab("conditions"),
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-md py-1.5 text-xs font-medium transition-colors", sensorCardEditTab === "conditions" ? "bg-[#4D2FB2] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"),
                                                            children: "Conditionele voorwaarden"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1070,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1057,
                                                    columnNumber: 21
                                                }, this),
                                                sensorCardEditTab === "general" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Icoon"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1085,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: sensorIconSearch,
                                                            onChange: (e)=>setSensorIconSearch(e.target.value),
                                                            onFocus: ()=>{
                                                                var _ref;
                                                                return setSensorIconSearch((_ref = sensorIconSearch || editForm.icon) !== null && _ref !== void 0 ? _ref : "");
                                                            },
                                                            placeholder: "Zoek icoon (bijv. gauge, thermometer…)",
                                                            className: "mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1088,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>{
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                icon: undefined
                                                                            }));
                                                                        setSensorIconSearch("");
                                                                    },
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", !editForm.icon ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                    children: "Default (Gauge)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1097,
                                                                    columnNumber: 27
                                                                }, this),
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SENSOR_ICON_OPTIONS"].filter((name)=>name.toLowerCase().includes((sensorIconSearch || "").toLowerCase())).map((name)=>{
                                                                    var _editForm_icon;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            setEditForm((prev)=>({
                                                                                    ...prev,
                                                                                    icon: name
                                                                                }));
                                                                            setSensorIconSearch(name);
                                                                        },
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : "Gauge") === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                        children: name
                                                                    }, name, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1115,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1096,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Grootte"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1134,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: (_editForm_size = editForm.size) !== null && _editForm_size !== void 0 ? _editForm_size : "md",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                size: e.target.value
                                                                            })),
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-gray-700 dark:text-gray-100",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "sm",
                                                                            children: "Klein"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1144,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "md",
                                                                            children: "Normaal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1145,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "lg",
                                                                            children: "Groot"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1146,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1137,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1133,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                sensorCardEditTab === "conditions" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                                            children: "Eerste voorwaarde die klopt bepaalt de kaartkleur. Getallen en tekst worden ondersteund."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1153,
                                                            columnNumber: 25
                                                        }, this),
                                                        ((_editForm_conditions = editForm.conditions) !== null && _editForm_conditions !== void 0 ? _editForm_conditions : []).map((cond, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: cond.operator,
                                                                        onChange: (e)=>setEditForm((prev)=>{
                                                                                var _prev_conditions;
                                                                                return {
                                                                                    ...prev,
                                                                                    conditions: ((_prev_conditions = prev.conditions) !== null && _prev_conditions !== void 0 ? _prev_conditions : []).map((c, i)=>i === idx ? {
                                                                                            ...c,
                                                                                            operator: e.target.value
                                                                                        } : c)
                                                                                };
                                                                            }),
                                                                        className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 px-2 py-1 text-xs",
                                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SENSOR_CONDITION_OPERATORS"].map((op)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: op,
                                                                                children: op === "eq" ? "=" : op === "neq" ? "≠" : op === "gte" ? "≥" : op === "lte" ? "≤" : op === "gt" ? ">" : op === "lt" ? "<" : "bevat"
                                                                            }, op, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 1174,
                                                                                columnNumber: 33
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1161,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: cond.value,
                                                                        onChange: (e)=>setEditForm((prev)=>{
                                                                                var _prev_conditions;
                                                                                return {
                                                                                    ...prev,
                                                                                    conditions: ((_prev_conditions = prev.conditions) !== null && _prev_conditions !== void 0 ? _prev_conditions : []).map((c, i)=>i === idx ? {
                                                                                            ...c,
                                                                                            value: e.target.value
                                                                                        } : c)
                                                                                };
                                                                            }),
                                                                        placeholder: "Waarde",
                                                                        className: "w-20 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 px-2 py-1 text-xs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1179,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: cond.color,
                                                                        onChange: (e)=>setEditForm((prev)=>{
                                                                                var _prev_conditions;
                                                                                return {
                                                                                    ...prev,
                                                                                    conditions: ((_prev_conditions = prev.conditions) !== null && _prev_conditions !== void 0 ? _prev_conditions : []).map((c, i)=>i === idx ? {
                                                                                            ...c,
                                                                                            color: e.target.value
                                                                                        } : c)
                                                                                };
                                                                            }),
                                                                        className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-700 px-2 py-1 text-xs",
                                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SENSOR_CONDITION_COLORS"].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: color,
                                                                                children: color
                                                                            }, color, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 1206,
                                                                                columnNumber: 33
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1193,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setEditForm((prev)=>{
                                                                                var _prev_conditions;
                                                                                return {
                                                                                    ...prev,
                                                                                    conditions: ((_prev_conditions = prev.conditions) !== null && _prev_conditions !== void 0 ? _prev_conditions : []).filter((_, i)=>i !== idx)
                                                                                };
                                                                            }),
                                                                        className: "p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                                                                        "aria-label": "Verwijder voorwaarde",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                            className: "h-4 w-4"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1222,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1211,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 1157,
                                                                columnNumber: 27
                                                            }, this)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setEditForm((prev)=>{
                                                                    var _prev_conditions;
                                                                    return {
                                                                        ...prev,
                                                                        conditions: [
                                                                            ...(_prev_conditions = prev.conditions) !== null && _prev_conditions !== void 0 ? _prev_conditions : [],
                                                                            {
                                                                                operator: "gte",
                                                                                value: "",
                                                                                color: "green"
                                                                            }
                                                                        ]
                                                                    };
                                                                }),
                                                            className: "rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full",
                                                            children: "+ Voeg voorwaarde toe"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1226,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1152,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 1056,
                                            columnNumber: 19
                                        }, this),
                                        editingWidget.type === "weather_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                                    children: "Toon icoon"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1244,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    role: "switch",
                                                    "aria-checked": editForm.show_icon !== false,
                                                    onClick: ()=>setEditForm((prev)=>({
                                                                ...prev,
                                                                show_icon: !(prev.show_icon !== false)
                                                            })),
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D2FB2] focus:ring-offset-2", editForm.show_icon !== false ? "bg-[#4D2FB2]" : "bg-gray-200 dark:bg-gray-600"),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition", editForm.show_icon !== false ? "translate-x-5" : "translate-x-1")
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                        lineNumber: 1261,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1247,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 1243,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-end gap-2 pt-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setEditingWidgetId(null),
                                                    className: "rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300",
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1271,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        var _editForm_script_ids, _editForm_script_names;
                                                        const updates = {
                                                            title: editForm.title,
                                                            ...editingWidget.entity_id != null && {
                                                                entity_id: editForm.entity_id
                                                            },
                                                            ...editingWidget.type === "climate_card" && {
                                                                icon: editForm.icon || undefined
                                                            },
                                                            ...editingWidget.type === "solar_card" && {
                                                                consumption_entity_id: editForm.consumption_entity_id || undefined
                                                            },
                                                            ...editingWidget.type === "weather_card" && {
                                                                show_icon: editForm.show_icon !== false
                                                            },
                                                            ...editingWidget.type === "vacuum_card" && {
                                                                script_ids: (_editForm_script_ids = editForm.script_ids) !== null && _editForm_script_ids !== void 0 ? _editForm_script_ids : [],
                                                                script_names: (_editForm_script_names = editForm.script_names) !== null && _editForm_script_names !== void 0 ? _editForm_script_names : {},
                                                                cleaned_area_entity_id: editForm.cleaned_area_entity_id || undefined,
                                                                icon: editForm.icon || undefined
                                                            },
                                                            ...editingWidget.type === "sensor_card" && {
                                                                icon: editForm.icon || undefined,
                                                                size: editForm.size || undefined
                                                            }
                                                        };
                                                        handleUpdateTile(editingWidgetId, updates);
                                                        const newWidgets = widgets.map((w)=>w.id === editingWidgetId ? {
                                                                ...w,
                                                                ...updates
                                                            } : w);
                                                        saveMutation.mutate({
                                                            layout,
                                                            widgets: newWidgets,
                                                            welcomeTitle,
                                                            welcomeSubtitle
                                                        });
                                                    },
                                                    className: "rounded-lg bg-[#4D2FB2] px-3 py-1.5 text-sm text-white hover:opacity-90",
                                                    children: "Save"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1278,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 1270,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                    lineNumber: 771,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                            lineNumber: 767,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
            lineNumber: 559,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
        lineNumber: 548,
        columnNumber: 5
    }, this);
}
_s1(DashboardEditPage, "DkcJBx2qsO4z7Ujah8TACywg1E0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStatePolling"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
_c1 = DashboardEditPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "WidgetByType");
__turbopack_context__.k.register(_c1, "DashboardEditPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_c0025065._.js.map