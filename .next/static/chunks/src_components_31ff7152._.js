(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/layout/top-tabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopTabs",
    ()=>TopTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$door$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DoorOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/door-open.js [app-client] (ecmascript) <export default as DoorOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
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
        href: "/rooms",
        label: "Kamers",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$door$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DoorOpen$3e$__["DoorOpen"]
    }
];
function TopTabs(param) {
    let { activeHref, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-1 rounded-full bg-black/5 px-1 py-1 dark:bg-white/5", className),
        role: "tablist",
        children: tabs.map((param)=>{
            let { href, label, icon: Icon } = param;
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
                        lineNumber: 44,
                        columnNumber: 13
                    }, this),
                    label
                ]
            }, href, true, {
                fileName: "[project]/src/components/layout/top-tabs.tsx",
                lineNumber: 32,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/layout/top-tabs.tsx",
        lineNumber: 22,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
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
    let { title = "Media", entity_id, size = "md", className, onMoreClick, onExpandedChange } = param;
    var _entity_attributes, _entity_attributes1, _entity_attributes2, _entity_attributes3, _entity_attributes4, _entity_attributes5;
    _s();
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const setExpandedWithCallback = (value)=>{
        setExpanded(value);
        onExpandedChange === null || onExpandedChange === void 0 ? void 0 : onExpandedChange(value);
    };
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
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-gray-900 dark:text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pt-4 pb-2",
                        children: [
                            mediaImageSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setExpandedWithCallback(false),
                                className: "block relative w-full aspect-square max-h-48 mx-auto rounded-xl overflow-hidden bg-white/5 hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50",
                                "aria-label": "Inklappen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: mediaImageSrc,
                                    alt: "",
                                    className: "w-full h-full object-cover pointer-events-none"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 146,
                                    columnNumber: 17
                                }, this)
                            }, trackKey, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 139,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full aspect-square max-h-48 mx-auto rounded-xl bg-white/5 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
                                    className: "h-16 w-16 text-white/20"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 154,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 153,
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
                                            lineNumber: 165,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-xs text-white/60",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: formatTime(displayPosition)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: formatTime(duration)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                                lineNumber: 172,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                        lineNumber: 170,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setExpandedWithCallback(false),
                        className: "flex items-center justify-center gap-1 py-1 text-white/50 hover:text-white/80 transition-colors",
                        "aria-label": "Inklappen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                            lineNumber: 182,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 176,
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
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-black/40"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 196,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 190,
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
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 200,
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
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/60 truncate",
                                        children: deviceName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                        lineNumber: 210,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this),
                            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onMoreClick();
                                },
                                className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                                "aria-label": "Opties",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 219,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this),
                            mediaImageSrc ? !expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setExpandedWithCallback(true),
                                className: "h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/20 hover:border-white/40 hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50",
                                "aria-label": "Uitklappen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: mediaImageSrc,
                                    alt: "",
                                    className: "h-full w-full object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 231,
                                    columnNumber: 15
                                }, this)
                            }, trackKey, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 224,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: mediaImageSrc,
                                    alt: "",
                                    className: "h-full w-full object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 239,
                                    columnNumber: 15
                                }, this)
                            }, trackKey, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this) : !expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setExpandedWithCallback(true),
                                className: "h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center hover:border-white/40 hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50",
                                "aria-label": "Uitklappen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
                                    className: "h-5 w-5 text-white/30",
                                    strokeWidth: 1.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
                                    className: "h-5 w-5 text-white/30",
                                    strokeWidth: 1.5
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 256,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 px-4 py-3 bg-black/10 dark:bg-black/30 backdrop-blur-md rounded-b-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium truncate text-sm text-gray-900 dark:text-white",
                                children: mediaTitle || "—"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-600 dark:text-white/60 truncate",
                                children: mediaArtist || "—"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 265,
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
                                    lineNumber: 281,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 274,
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
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                    className: "h-4 w-4 ml-0.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 293,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 283,
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
                                    lineNumber: 303,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 296,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
        lineNumber: 125,
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
"[project]/src/components/layout/header-media-playing.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeaderMediaPlaying",
    ()=>HeaderMediaPlaying
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/disc-3.js [app-client] (ecmascript) <export default as Disc3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/media-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function HeaderMediaPlaying() {
    _s();
    const states = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "HeaderMediaPlaying.useEntityStateStore[states]": (s)=>s.states
    }["HeaderMediaPlaying.useEntityStateStore[states]"]);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "HeaderMediaPlaying.useEntityStateStore[setStates]": (s)=>s.setStates
    }["HeaderMediaPlaying.useEntityStateStore[setStates]"]);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const playingEntities = Object.values(states).filter((e)=>e.entity_id.startsWith("media_player.") && (e.state === "playing" || e.state === "paused"));
    // Bij meerdere spelers: geef voorrang aan TV Woonkamer
    const playingEntity = playingEntities.length === 0 ? null : playingEntities.length === 1 ? playingEntities[0].entity_id : (()=>{
        const woonkamer = playingEntities.find((e)=>{
            var _this, _e_attributes;
            return ((_this = (_e_attributes = e.attributes) === null || _e_attributes === void 0 ? void 0 : _e_attributes.friendly_name) === null || _this === void 0 ? void 0 : _this.toLowerCase().includes("woonkamer")) || e.entity_id.toLowerCase().includes("woonkamer");
        });
        var _woonkamer_entity_id;
        return (_woonkamer_entity_id = woonkamer === null || woonkamer === void 0 ? void 0 : woonkamer.entity_id) !== null && _woonkamer_entity_id !== void 0 ? _woonkamer_entity_id : playingEntities[0].entity_id;
    })();
    const isActivelyPlaying = playingEntities.some((e)=>e.state === "playing");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderMediaPlaying.useEffect": ()=>{
            let cancelled = false;
            ({
                "HeaderMediaPlaying.useEffect": async ()=>{
                    try {
                        const res = await fetch("/api/ha/state");
                        if (!res.ok || cancelled) return;
                        const data = await res.json();
                        if (Array.isArray(data)) setStates(data);
                    } catch (e) {
                    // ignore
                    }
                }
            })["HeaderMediaPlaying.useEffect"]();
            const t = setInterval({
                "HeaderMediaPlaying.useEffect.t": async ()=>{
                    if (cancelled) return;
                    try {
                        const res = await fetch("/api/ha/state");
                        if (!res.ok || cancelled) return;
                        const data = await res.json();
                        if (Array.isArray(data)) setStates(data);
                    } catch (e) {
                    // ignore
                    }
                }
            }["HeaderMediaPlaying.useEffect.t"], 5000);
            return ({
                "HeaderMediaPlaying.useEffect": ()=>{
                    cancelled = true;
                    clearInterval(t);
                }
            })["HeaderMediaPlaying.useEffect"];
        }
    }["HeaderMediaPlaying.useEffect"], [
        setStates
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeaderMediaPlaying.useEffect": ()=>{
            if (!open) return;
            function handleClickOutside(e) {
                if (panelRef.current && !panelRef.current.contains(e.target)) {
                    setOpen(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "HeaderMediaPlaying.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["HeaderMediaPlaying.useEffect"];
        }
    }["HeaderMediaPlaying.useEffect"], [
        open
    ]);
    if (playingEntity == null) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex items-center",
        ref: panelRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((v)=>!v),
                className: "flex h-9 w-9 items-center justify-center rounded-lg text-accent-purple dark:text-accent-purple hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D2FB2]",
                "aria-label": "Media afspelen",
                "aria-expanded": open,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-5 w-5", isActivelyPlaying && "animate-spin"),
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/header-media-playing.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/header-media-playing.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            open && playingEntity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-full z-[100] mt-1 w-[336px] p-2 rounded-xl border border-gray-200 bg-white/95 dark:bg-black/80 shadow-xl dark:border-white/10 dark:backdrop-blur-xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MediaCardWidget"], {
                    entity_id: playingEntity,
                    size: "md"
                }, void 0, false, {
                    fileName: "[project]/src/components/layout/header-media-playing.tsx",
                    lineNumber: 95,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/header-media-playing.tsx",
                lineNumber: 94,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/header-media-playing.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(HeaderMediaPlaying, "O2Q6LUkCswy9jPdVyP/B44uxsdo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = HeaderMediaPlaying;
var _c;
__turbopack_context__.k.register(_c, "HeaderMediaPlaying");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/screensaver-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$header$2d$media$2d$playing$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/header-media-playing.tsx [app-client] (ecmascript)");
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
        lineNumber: 71,
        columnNumber: 46
    }, this);
    if (s === "clear-night") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 72,
        columnNumber: 35
    }, this);
    if (s === "fog" || s === "mist") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__["CloudFog"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 73,
        columnNumber: 43
    }, this);
    if (s === "rainy" || s === "pouring" || s === "hail") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__["CloudRain"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 74,
        columnNumber: 64
    }, this);
    if (s === "snowy" || s === "snowy-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__["CloudSnow"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 75,
        columnNumber: 52
    }, this);
    if (s === "lightning" || s === "lightning-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__["CloudLightning"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 76,
        columnNumber: 60
    }, this);
    if (s === "windy" || s === "windy-variant") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 77,
        columnNumber: 54
    }, this);
    if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 78,
        columnNumber: 77
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 79,
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
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-[102] w-full max-w-sm rounded-2xl border-0 bg-white p-5 shadow-xl dark:bg-black/50 dark:backdrop-blur-xl dark:border dark:border-white/10",
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
                                lineNumber: 120,
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
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 dark:text-gray-400",
                        children: "Loading…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 133,
                        columnNumber: 11
                    }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-red-600 dark:text-red-400",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this) : entities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 dark:text-gray-400",
                        children: "No weather entities found. Check your Home Assistant connection."
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 137,
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
                                    lineNumber: 147,
                                    columnNumber: 19
                                }, this)
                            }, e.entity_id, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 146,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s(TemperatureEntityModal, "W3g9ajxtOr3Ca7U2mhWuL/xEN5U=");
_c1 = TemperatureEntityModal;
function useHeaderClock() {
    _s1();
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useHeaderClock.useEffect": ()=>{
            function update() {
                const now = new Date();
                const use24h = "object" !== "undefined" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$screensaver$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScreensaverClock24h"])();
                setTime(use24h ? now.toLocaleTimeString("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                }) : now.toLocaleTimeString("nl-NL", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                }));
            }
            update();
            const id = setInterval(update, 1000);
            return ({
                "useHeaderClock.useEffect": ()=>clearInterval(id)
            })["useHeaderClock.useEffect"];
        }
    }["useHeaderClock.useEffect"], []);
    return time;
}
_s1(useHeaderClock, "BOCfeVG4OKCNzybCuynup9cQfu8=");
function AppShell(param) {
    let { children, activeTab = "/dashboards", showSidebar = true, showFloatingToolbar = false, welcomeBarAction, headerEndAction, welcomeTitle: welcomeTitleProp, welcomeSubtitle: welcomeSubtitleProp, welcomeEditable = false, onWelcomeChange, temperatureEntityId, contentNoScroll = false, className } = param;
    var _temperatureState_attributes;
    _s2();
    const welcomeTitle = welcomeTitleProp !== null && welcomeTitleProp !== void 0 ? welcomeTitleProp : "";
    const welcomeSubtitle = welcomeSubtitleProp !== null && welcomeSubtitleProp !== void 0 ? welcomeSubtitleProp : "";
    const hasWelcomeText = Boolean(welcomeTitle || welcomeSubtitle);
    const pageBackground = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$page$2d$background$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageBackground"])();
    const headerTime = useHeaderClock();
    const [temperatureModalOpen, setTemperatureModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chosenTemperatureEntityId, setChosenTemperatureEntityId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
                            showSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setSidebarOpen((v)=>!v),
                                className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors",
                                "aria-label": sidebarOpen ? "Menu sluiten" : "Menu openen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 262,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 256,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300",
                                "aria-live": "polite",
                                children: headerTime
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 265,
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
                                        lineNumber: 276,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
                                        className: "h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/app-shell.tsx",
                                        lineNumber: 278,
                                        columnNumber: 17
                                    }, this),
                                    temperatureDisplay !== null && temperatureDisplay !== void 0 ? temperatureDisplay : "—"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center px-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$top$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TopTabs"], {
                            activeHref: activeTab
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/app-shell.tsx",
                            lineNumber: 285,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex items-center justify-end gap-2 min-w-0",
                        children: [
                            headerEndAction,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$header$2d$media$2d$playing$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeaderMediaPlaying"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 289,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeSwitcher"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 287,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 253,
                columnNumber: 7
            }, this),
            temperatureModalOpen && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TemperatureEntityModal, {
                onClose: ()=>setTemperatureModalOpen(false),
                onSelect: saveChosenTemperatureEntity
            }, void 0, false, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 297,
                columnNumber: 11
            }, this), document.body),
            hasWelcomeText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    lineNumber: 309,
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
                                    lineNumber: 321,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/app-shell.tsx",
                            lineNumber: 308,
                            columnNumber: 13
                        }, this) : hasWelcomeText ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight",
                                    children: welcomeTitle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 336,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base md:text-lg font-normal text-gray-600 dark:text-gray-300 mt-1.5",
                                    children: welcomeSubtitle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 339,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : null
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 306,
                        columnNumber: 9
                    }, this),
                    welcomeBarAction != null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 shrink-0",
                        children: welcomeBarAction
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 346,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 overflow-hidden relative",
                children: [
                    showSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-0 top-[8rem] bottom-0 z-[60] w-[88px] pl-8 flex flex-col items-center justify-center transition-[transform,opacity] duration-200 ease-out", sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                            activeHref: activeTab
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/app-shell.tsx",
                            lineNumber: 361,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 355,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 p-4 min-w-0 transition-[margin] duration-200", contentNoScroll ? "overflow-hidden" : "overflow-auto", showSidebar && sidebarOpen && "ml-[88px]"),
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 364,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 353,
                columnNumber: 7
            }, this),
            showFloatingToolbar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$floating$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingToolbar"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 375,
                columnNumber: 31
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 244,
        columnNumber: 5
    }, this);
}
_s2(AppShell, "VoBQM43h8B2uuQygwechpiApmv4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$page$2d$background$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageBackground"],
        useHeaderClock,
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
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-6 w-6 text-accent-orange dark:text-accent-green", !on && "opacity-50 text-gray-400 dark:text-gray-500")
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
                className: "text-2xl font-bold text-accent-orange dark:text-accent-green mb-4",
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
"[project]/src/components/widgets/floating-media-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingMediaCard",
    ()=>FloatingMediaCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
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
    const maxLeft = window.innerWidth - CARD_WIDTH;
    const maxBottom = window.innerHeight - 120;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingMediaCard(param) {
    let { title, entity_id, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
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
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingMediaCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingMediaCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingMediaCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingMediaCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingMediaCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingMediaCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingMediaCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingMediaCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
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
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
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
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingMediaCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", isExpanded ? "z-50" : "z-30", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MediaCardWidget"], {
                title: title,
                entity_id: entity_id,
                size: "md",
                onMoreClick: editMode ? onEdit : undefined,
                onExpandedChange: setIsExpanded
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-media-card.tsx",
                lineNumber: 199,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-media-card.tsx",
            lineNumber: 198,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-media-card.tsx",
        lineNumber: 169,
        columnNumber: 5
    }, this);
}
_s(FloatingMediaCard, "qS/647TVzbBLvvSKfU9rB1G/jbc=");
_c = FloatingMediaCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingMediaCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/light-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LIGHT_ICON_OPTIONS",
    ()=>LIGHT_ICON_OPTIONS,
    "LightCardWidget",
    ()=>LightCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp.js [app-client] (ecmascript) <export default as Lamp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$ceiling$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampCeiling$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-ceiling.js [app-client] (ecmascript) <export default as LampCeiling>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$desk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampDesk$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-desk.js [app-client] (ecmascript) <export default as LampDesk>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$floor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampFloor$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-floor.js [app-client] (ecmascript) <export default as LampFloor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$wall$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampWallDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-wall-down.js [app-client] (ecmascript) <export default as LampWallDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$wall$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampWallUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-wall-up.js [app-client] (ecmascript) <export default as LampWallUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
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
const LIGHT_ICON_MAP = {
    lightbulb: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
    spotlight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__["Lamp"],
    lamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__["Lamp"],
    "lamp-ceiling": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$ceiling$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampCeiling$3e$__["LampCeiling"],
    "lamp-desk": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$desk$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampDesk$3e$__["LampDesk"],
    "lamp-floor": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$floor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampFloor$3e$__["LampFloor"],
    "lamp-wall-down": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$wall$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampWallDown$3e$__["LampWallDown"],
    "lamp-wall-up": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$wall$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LampWallUp$3e$__["LampWallUp"]
};
const LIGHT_ICON_OPTIONS = [
    "lightbulb",
    "spotlight",
    "lamp",
    "lamp-ceiling",
    "lamp-desk",
    "lamp-floor",
    "lamp-wall-down",
    "lamp-wall-up"
];
function LightCardWidget(param) {
    let { title = "Lamp", entity_id, icon: iconKey = "lightbulb", size = "md", className, onMoreClick } = param;
    var _entity_attributes, _entity_attributes1;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "LightCardWidget.useEntityStateStore[entity]": (s)=>s.getState(entity_id)
    }["LightCardWidget.useEntityStateStore[entity]"]);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "LightCardWidget.useEntityStateStore[setStates]": (s)=>s.setStates
    }["LightCardWidget.useEntityStateStore[setStates]"]);
    const updateEntityState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "LightCardWidget.useEntityStateStore[updateEntityState]": (s)=>s.updateEntityState
    }["LightCardWidget.useEntityStateStore[updateEntityState]"]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sliderBrightness, setSliderBrightness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(100);
    const brightnessDebounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [slidePosition, setSlidePosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const dragStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const SWITCH_TRACK_PX = 72;
    const SWITCH_AREA_HEIGHT_PX = 200; /* hoogte van het sleepgebied; doos wordt hierop + padding berekend */ 
    const isOn = (entity === null || entity === void 0 ? void 0 : entity.state) === "on";
    const displayPosition = slidePosition !== null && slidePosition !== void 0 ? slidePosition : isOn ? 1 : 0;
    var _ref;
    /* 0 = bottom (uit), 1 = top (aan); transform uses (1 - position) so thumb moves up when on */ const brightnessRaw = (_ref = entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.brightness) !== null && _ref !== void 0 ? _ref : 255;
    const brightnessPct = Math.round(brightnessRaw / 255 * 100);
    var _ref1;
    const supportedFeatures = (_ref1 = entity === null || entity === void 0 ? void 0 : (_entity_attributes1 = entity.attributes) === null || _entity_attributes1 === void 0 ? void 0 : _entity_attributes1.supported_features) !== null && _ref1 !== void 0 ? _ref1 : 0;
    const supportsBrightness = (supportedFeatures & 1) !== 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LightCardWidget.useEffect": ()=>{
            setSliderBrightness(brightnessPct);
        }
    }["LightCardWidget.useEffect"], [
        brightnessPct
    ]);
    const refreshState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LightCardWidget.useCallback[refreshState]": async ()=>{
            const res = await fetch("/api/ha/state").then({
                "LightCardWidget.useCallback[refreshState]": (r)=>r.json()
            }["LightCardWidget.useCallback[refreshState]"]);
            if (Array.isArray(res)) setStates(res);
        }
    }["LightCardWidget.useCallback[refreshState]"], [
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
        } finally{
            setLoading(false);
        }
    }
    function handleToggle() {
        const nextOn = !isOn;
        updateEntityState(entity_id, {
            state: nextOn ? "on" : "off"
        });
        callLight(nextOn ? "turn_on" : "turn_off", nextOn ? {
            brightness_pct: brightnessPct || 100
        } : undefined);
    }
    function handleBrightnessChange(pct) {
        setSliderBrightness(pct);
        if (brightnessDebounceRef.current) clearTimeout(brightnessDebounceRef.current);
        brightnessDebounceRef.current = setTimeout(()=>{
            callLight("turn_on", {
                brightness_pct: pct
            });
            brightnessDebounceRef.current = null;
        }, 80);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LightCardWidget.useEffect": ()=>({
                "LightCardWidget.useEffect": ()=>{
                    if (brightnessDebounceRef.current) clearTimeout(brightnessDebounceRef.current);
                }
            })["LightCardWidget.useEffect"]
    }["LightCardWidget.useEffect"], []);
    var _LIGHT_ICON_MAP_iconKey;
    const IconComponent = (_LIGHT_ICON_MAP_iconKey = LIGHT_ICON_MAP[iconKey]) !== null && _LIGHT_ICON_MAP_iconKey !== void 0 ? _LIGHT_ICON_MAP_iconKey : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"];
    const statusText = isOn ? supportsBrightness ? "".concat(brightnessPct, "%") : "Aan" : "Uit";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl transition-colors duration-200", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", isOn ? "text-gray-900" : "text-gray-800 dark:text-gray-200 opacity-95", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleToggle,
                        disabled: loading,
                        className: "flex shrink-0 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-70 h-10 w-10",
                        "aria-label": isOn ? "Lamp uitzetten" : "Lamp aanzetten",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200", isOn ? "bg-[#FFD41D] shadow-sm" : "bg-white/30 dark:bg-white/10 shadow-inner"),
                            "aria-hidden": true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-5 w-5 shrink-0 transition-colors", isOn ? "text-white drop-shadow" : "text-gray-500 dark:text-gray-400"),
                                strokeWidth: 1.5,
                                fill: isOn ? "currentColor" : "none",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setModalOpen(true),
                        className: "flex flex-1 min-w-0 items-center gap-2 text-left rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 -mx-1 px-1 py-0.5 transition-colors",
                        "aria-label": "Verlichting bedienen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1 flex flex-col justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium truncate text-inherit",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs truncate", isOn ? "text-gray-600" : "text-gray-500 dark:text-gray-400"),
                                    children: statusText
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.stopPropagation();
                            onMoreClick();
                        },
                        className: "p-1.5 rounded-lg shrink-0 text-inherit opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                        "aria-label": "Opties",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                            className: "h-5 w-5",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 186,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            modalOpen && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "absolute inset-0 z-[100] bg-black/40 dark:bg-black/50 backdrop-blur-md cursor-pointer",
                        "aria-label": "Modal sluiten",
                        onClick: ()=>setModalOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 201,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-[101] w-full max-w-sm p-5 flex flex-col items-center text-center", isOn && supportsBrightness ? "min-h-[420px]" : "min-h-[380px]"),
                        onClick: (e)=>e.stopPropagation(),
                        children: isOn && supportsBrightness ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-1",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 216,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-300 mb-6",
                                    children: [
                                        sliderBrightness,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 219,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center gap-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex flex-col items-center w-20 h-64",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-0 left-1/2 -translate-x-1/2 w-16 h-64 rounded-2xl bg-gray-700/80 dark:bg-gray-800/80 flex flex-col justify-end overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full rounded-b-2xl bg-[#FFD41D] min-h-0 transition-[height] duration-150 ease-out",
                                                    style: {
                                                        height: "".concat(sliderBrightness, "%")
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                                lineNumber: 224,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "range",
                                                min: 0,
                                                max: 100,
                                                value: sliderBrightness,
                                                onChange: (e)=>handleBrightnessChange(Number(e.target.value)),
                                                onInput: (e)=>handleBrightnessChange(Number(e.target.value)),
                                                disabled: loading,
                                                className: "absolute top-1/2 left-1/2 w-64 h-20 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize opacity-0 [&::-webkit-slider-thumb]:cursor-ns-resize",
                                                style: {
                                                    transform: "translate(-50%, -50%) rotate(-90deg)"
                                                },
                                                "aria-label": "Helderheid"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                                lineNumber: 230,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center w-10 h-10 rounded-full bg-amber-400/40",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                                    className: "h-5 w-5 text-white drop-shadow",
                                                    strokeWidth: 1.5,
                                                    fill: "currentColor",
                                                    "aria-hidden": true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                                lineNumber: 242,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                        lineNumber: 223,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 222,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true) : supportsBrightness ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-1",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 250,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-300 mb-4",
                                    children: isOn ? "Aan" : "Uit"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 253,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 w-full max-w-xs mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                if (!isOn) handleToggle();
                                                setModalOpen(false);
                                            },
                                            disabled: loading,
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-xl py-3 px-4 text-sm font-medium transition-colors", isOn ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" : "bg-[#FFD41D] text-gray-900 hover:opacity-90"),
                                            children: "Aan"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                            lineNumber: 257,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                if (isOn) handleToggle();
                                                setModalOpen(false);
                                            },
                                            disabled: loading,
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-xl py-3 px-4 text-sm font-medium transition-colors", !isOn ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" : "bg-gray-800 text-white dark:bg-gray-600 dark:text-white hover:opacity-90"),
                                            children: "Uit"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                            lineNumber: 268,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 256,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-1",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 283,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-300 mb-6",
                                    children: isOn ? "Aan" : "Uit"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 286,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center rounded-3xl bg-gradient-to-br from-gray-600/60 to-gray-700/80 dark:from-gray-800/70 dark:to-gray-900/90 pt-3 pb-4 w-[100px]",
                                    style: {
                                        height: SWITCH_AREA_HEIGHT_PX + 12 + 16
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-[100px] flex flex-col justify-end select-none shrink-0",
                                        style: {
                                            height: SWITCH_AREA_HEIGHT_PX,
                                            paddingBottom: SWITCH_TRACK_PX,
                                            touchAction: "none"
                                        },
                                        onPointerDown: (e)=>{
                                            var _setPointerCapture, _this;
                                            if (loading) return;
                                            e.preventDefault();
                                            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
                                            dragStartRef.current = {
                                                y: e.clientY,
                                                position: displayPosition
                                            };
                                            setSlidePosition(displayPosition);
                                        },
                                        onPointerMove: (e)=>{
                                            if (dragStartRef.current == null) return;
                                            e.preventDefault();
                                            const deltaY = dragStartRef.current.y - e.clientY;
                                            const deltaPos = deltaY / SWITCH_TRACK_PX;
                                            const next = Math.max(0, Math.min(1, dragStartRef.current.position + deltaPos));
                                            setSlidePosition(next);
                                        },
                                        onPointerUp: (e)=>{
                                            var _releasePointerCapture, _this;
                                            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
                                            if (dragStartRef.current == null) return;
                                            const startPos = dragStartRef.current.position;
                                            const moved = Math.abs(displayPosition - startPos) > 0.15;
                                            if (!moved) {
                                                handleToggle();
                                            } else {
                                                const committedOn = displayPosition > 0.5;
                                                if (committedOn !== isOn) {
                                                    updateEntityState(entity_id, {
                                                        state: committedOn ? "on" : "off"
                                                    });
                                                    callLight(committedOn ? "turn_on" : "turn_off", committedOn ? {
                                                        brightness_pct: 100
                                                    } : undefined);
                                                }
                                            }
                                            dragStartRef.current = null;
                                            setSlidePosition(null);
                                        },
                                        onPointerCancel: (e)=>{
                                            var _releasePointerCapture, _this;
                                            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
                                            dragStartRef.current = null;
                                            setSlidePosition(null);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none",
                                                style: {
                                                    height: SWITCH_TRACK_PX
                                                },
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                                lineNumber: 334,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: loading,
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute left-1/2 -translate-x-1/2 w-20 h-[131px] rounded-xl flex items-center justify-center shadow-lg select-none touch-none", "transition-colors duration-200 disabled:opacity-70", displayPosition > 0.5 ? "bg-[#FFD41D]" : "bg-gray-600/80 dark:bg-gray-700/80"),
                                                style: {
                                                    bottom: SWITCH_TRACK_PX,
                                                    transform: "translate(-50%, ".concat((1 - displayPosition) * SWITCH_TRACK_PX, "px)"),
                                                    transition: slidePosition != null ? "none" : "transform 0.15s ease-out"
                                                },
                                                "aria-label": displayPosition > 0.5 ? "Lamp uitzetten" : "Lamp aanzetten",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-9 w-9 shrink-0 transition-colors", displayPosition > 0.5 ? "text-white drop-shadow" : "text-white/70"),
                                                    strokeWidth: 1.5,
                                                    fill: displayPosition > 0.5 ? "currentColor" : "none",
                                                    "aria-hidden": true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                                lineNumber: 339,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                        lineNumber: 293,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 289,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 207,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                lineNumber: 200,
                columnNumber: 11
            }, this), document.body),
            isOn && supportsBrightness && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-3 pt-0 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-500 dark:text-gray-600 shrink-0 w-10",
                        children: "Helderheid"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 375,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: 0,
                        max: 100,
                        value: sliderBrightness,
                        onChange: (e)=>handleBrightnessChange(Number(e.target.value)),
                        disabled: loading,
                        className: "flex-1 h-2 rounded-full appearance-none bg-gray-200 dark:bg-gray-300 accent-amber-500 disabled:opacity-50",
                        "aria-label": "Helderheid"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 376,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs tabular-nums text-gray-600 dark:text-gray-700 w-8",
                        children: [
                            sliderBrightness,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 386,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                lineNumber: 374,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_s(LightCardWidget, "NtivO+nC7wCoIK0cyly7ooFhEp0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = LightCardWidget;
var _c;
__turbopack_context__.k.register(_c, "LightCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-light-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingLightCard",
    ()=>FloatingLightCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/light-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const STORAGE_KEY_PREFIX = "dashboard.floatingLightCardPosition.";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 240;
function loadPosition(widgetId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
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
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition(_widgetIndex) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const maxLeft = window.innerWidth - CARD_WIDTH;
    const maxBottom = window.innerHeight - 120;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingLightCard(param) {
    let { widget, widgetIndex = 0, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "FloatingLightCard.useEntityStateStore[entity]": (s)=>s.getState(widget.entity_id)
    }["FloatingLightCard.useEntityStateStore[entity]"]);
    const isSelectedOn = (entity === null || entity === void 0 ? void 0 : entity.state) === "on";
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingLightCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition(widget.id)) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                bottom: DEFAULT_OFFSET
            };
        }
    }["FloatingLightCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const isPointerDownOnCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingLightCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingLightCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingLightCard.useCallback[startLongPress]": (e)=>{
            var _target_closest, _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            const target = e.target;
            var _target_closest1;
            if ((_target_closest1 = target === null || target === void 0 ? void 0 : (_target_closest = target.closest) === null || _target_closest === void 0 ? void 0 : _target_closest.call(target, "button")) !== null && _target_closest1 !== void 0 ? _target_closest1 : false) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingLightCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingLightCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingLightCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingLightCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingLightCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    const totalWidth = CARD_WIDTH;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingLightCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition(widget.id);
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(widgetIndex), bounds);
            setPosition(p);
            savePosition(widget.id, p);
        }
    }["FloatingLightCard.useEffect"], [
        totalWidth,
        widget.id,
        widgetIndex
    ]);
    const DRAG_THRESHOLD_PX = 6;
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingLightCard.useCallback[handlePointerDown]": (e)=>{
            var _setPointerCapture, _this;
            if (!editMode) return;
            isPointerDownOnCard.current = true;
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
        }
    }["FloatingLightCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingLightCard.useCallback[handlePointerMove]": (e)=>{
            if (!isPointerDownOnCard.current) return;
            if (!isDragging) {
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                if (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX) {
                    e.preventDefault();
                    setIsDragging(true);
                } else return;
            }
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
    }["FloatingLightCard.useCallback[handlePointerMove]"], [
        isDragging,
        maxLeft
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingLightCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            isPointerDownOnCard.current = false;
            if (isDragging) {
                e.preventDefault();
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
                savePosition(widget.id, next);
            }
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingLightCard.useCallback[handlePointerUp]"], [
        isDragging,
        maxLeft,
        widget.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 shadow-xl rounded-2xl overflow-hidden backdrop-blur-2xl border flex transition-colors duration-200", isSelectedOn ? "bg-white/25 dark:bg-black/60 border-white/30 dark:border-white/15" : "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            width: totalWidth,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                isPointerDownOnCard.current = false;
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "shrink-0 flex flex-col",
            style: {
                width: CARD_WIDTH
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LightCardWidget"], {
                    title: widget.title,
                    entity_id: widget.entity_id,
                    icon: widget.icon,
                    size: "md",
                    onMoreClick: onEdit
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/floating-light-card.tsx",
                    lineNumber: 229,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-light-card.tsx",
                lineNumber: 228,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-light-card.tsx",
            lineNumber: 227,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-light-card.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
}
_s(FloatingLightCard, "P2chI8hs/nknfMhq+PIqBy29oiA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = FloatingLightCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingLightCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CARD_ICONS",
    ()=>CARD_ICONS,
    "CARD_ICON_OPTIONS",
    ()=>CARD_ICON_OPTIONS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bath$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bath.js [app-client] (ecmascript) <export default as Bath>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bed$2d$double$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BedDouble$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bed-double.js [app-client] (ecmascript) <export default as BedDouble>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car.js [app-client] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-dot.js [app-client] (ecmascript) <export default as CircleDot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$door$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DoorOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/door-open.js [app-client] (ecmascript) <export default as DoorOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-client] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fuel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Fuel$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/fuel.js [app-client] (ecmascript) <export default as Fuel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-client] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GaugeCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-gauge.js [app-client] (ecmascript) <export default as GaugeCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp.js [app-client] (ecmascript) <export default as Lamp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shirt.js [app-client] (ecmascript) <export default as Shirt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sofa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sofa$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sofa.js [app-client] (ecmascript) <export default as Sofa>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-client] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tree-pine.js [app-client] (ecmascript) <export default as TreePine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils-crossed.js [app-client] (ecmascript) <export default as UtensilsCrossed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
"use client";
;
const CARD_ICONS = {
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
    Droplets: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
    Eye: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"],
    Fuel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fuel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Fuel$3e$__["Fuel"],
    Gauge: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
    GaugeCircle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GaugeCircle$3e$__["GaugeCircle"],
    Home: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
    Lamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__["Lamp"],
    Lightbulb: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
    Shirt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__["Shirt"],
    Sofa: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sofa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sofa$3e$__["Sofa"],
    Sparkles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
    Star: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"],
    Sun: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"],
    Thermometer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"],
    TreePine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__["TreePine"],
    Trash2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"],
    UtensilsCrossed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__["UtensilsCrossed"],
    Wind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"],
    Zap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
};
const CARD_ICON_OPTIONS = Object.keys(CARD_ICONS).sort();
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-client] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flame.js [app-client] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/snowflake.js [app-client] (ecmascript) <export default as Snowflake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/power.js [app-client] (ecmascript) <export default as Power>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-client] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const SELECTOR_STEP = 0.5;
function formatTemp(value) {
    if (value == null || Number.isNaN(value)) return "—";
    const rounded = Math.round(value * 2) / 2;
    return rounded % 1 === 0.5 ? "".concat(rounded, "°") : "".concat(Math.round(rounded), "°");
}
const TEMP_MIN = 5;
const TEMP_MAX = 35;
const MODE_CONFIG = [
    {
        mode: "auto",
        label: "Auto",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"]
    },
    {
        mode: "heat",
        label: "Verwarmen",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"]
    },
    {
        mode: "off",
        label: "Uit",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__["Power"]
    },
    {
        mode: "fan_only",
        label: "Wind",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"]
    },
    {
        mode: "cool",
        label: "Koelen",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__["Snowflake"]
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
    let { title = "Air Conditioner", entity_id, humidity_entity_id, icon: iconName, size = "md", className, onMoreClick } = param;
    var _entity_attributes, _entity_attributes1, _entity_attributes2, _entity_attributes3, _entity_attributes4, _entity_attributes5, _entity_attributes6, _entity_attributes7, _entity_attributes8;
    _s();
    const IconComponent = iconName && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"];
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "ClimateCard2Widget.useEntityStateStore[entity]": (s)=>s.getState(entity_id)
    }["ClimateCard2Widget.useEntityStateStore[entity]"]);
    const humidityEntity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "ClimateCard2Widget.useEntityStateStore[humidityEntity]": (s)=>humidity_entity_id ? s.getState(humidity_entity_id) : null
    }["ClimateCard2Widget.useEntityStateStore[humidityEntity]"]);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "ClimateCard2Widget.useEntityStateStore[setStates]": (s)=>s.setStates
    }["ClimateCard2Widget.useEntityStateStore[setStates]"]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modeMenuOpen, setModeMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const modeButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [menuPosition, setMenuPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClimateCard2Widget.useEffect": ()=>{
            if (!modeMenuOpen || !modeButtonRef.current) {
                setMenuPosition(null);
                return;
            }
            const rect = modeButtonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width
            });
        }
    }["ClimateCard2Widget.useEffect"], [
        modeMenuOpen
    ]);
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
    const setTemperature = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ClimateCard2Widget.useCallback[setTemperature]": async (temperature)=>{
            const rounded = Math.round(temperature * 2) / 2;
            const clamped = Math.min(maxTemp, Math.max(minTemp, rounded));
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
        minTemp,
        setStates
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
    if (availableModes.length < hvacModes.length) {
        const configuredModes = new Set(availableModes.map((c)=>c.mode));
        availableModes.push(...hvacModes.filter((mode)=>!configuredModes.has(mode)).map((mode)=>{
            var _STATE_LABELS_mode;
            return {
                mode,
                label: (_STATE_LABELS_mode = STATE_LABELS[mode]) !== null && _STATE_LABELS_mode !== void 0 ? _STATE_LABELS_mode : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["capitalizeFirst"])(mode),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"]
            };
        }));
    }
    var _ref5;
    const friendlyName = (_ref5 = entity === null || entity === void 0 ? void 0 : (_entity_attributes7 = entity.attributes) === null || _entity_attributes7 === void 0 ? void 0 : _entity_attributes7.friendly_name) !== null && _ref5 !== void 0 ? _ref5 : entity_id;
    const humidityFromAttr = (entity === null || entity === void 0 ? void 0 : (_entity_attributes8 = entity.attributes) === null || _entity_attributes8 === void 0 ? void 0 : _entity_attributes8.humidity) != null ? Number(entity.attributes.humidity) : undefined;
    const humidityFromSensor = (humidityEntity === null || humidityEntity === void 0 ? void 0 : humidityEntity.state) != null && humidityEntity.state !== "unavailable" ? Number(humidityEntity.state) : undefined;
    const humidity = humidityFromSensor !== null && humidityFromSensor !== void 0 ? humidityFromSensor : humidityFromAttr;
    const showHumidity = humidity != null && !Number.isNaN(humidity);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/15 dark:bg-black/50 text-gray-900 dark:text-white shadow-xl backdrop-blur-2xl border border-white/30 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 dark:bg-white/10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                    className: "h-5 w-5 text-amber-600 dark:text-amber-400",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 216,
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
                                        lineNumber: 220,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 dark:text-white/60 truncate",
                                        children: friendlyName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 shrink-0",
                        children: [
                            showHumidity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-gray-600 dark:text-white/90",
                                title: "Luchtvochtigheid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"], {
                                        className: "h-4 w-4",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                        lineNumber: 227,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm tabular-nums",
                                        children: [
                                            Math.round(humidity),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 226,
                                columnNumber: 13
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
                                    lineNumber: 238,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 232,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 flex items-center justify-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setTemperature(displayTemp - SELECTOR_STEP),
                        disabled: loading || isOff || displayTemp <= minTemp,
                        className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200/60 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300/60 dark:hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors",
                        "aria-label": "Temperatuur verlagen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                            className: "h-6 w-6"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                            lineNumber: 253,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-5xl font-bold tabular-nums text-gray-900 dark:text-white min-w-[4.5rem] text-center",
                        children: formatTemp(displayTemp)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 255,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setTemperature(displayTemp + SELECTOR_STEP),
                        disabled: loading || isOff || displayTemp >= maxTemp,
                        className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200/60 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300/60 dark:hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors",
                        "aria-label": "Temperatuur verhogen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-6 w-6"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                lineNumber: 245,
                columnNumber: 7
            }, this),
            availableModes.length > 0 && (()=>{
                const currentMode = isOff ? "off" : activeHvacMode;
                var _availableModes_find;
                const current = (_availableModes_find = availableModes.find((m)=>m.mode === currentMode)) !== null && _availableModes_find !== void 0 ? _availableModes_find : availableModes[0];
                const otherModes = availableModes.filter((m)=>m.mode !== currentMode);
                const offOption = MODE_CONFIG.find((m)=>m.mode === "off");
                const dropdownOptions = currentMode === "off" ? otherModes : [
                    ...otherModes,
                    ...offOption && !otherModes.some((m)=>m.mode === "off") ? [
                        offOption
                    ] : []
                ];
                const canChangeMode = dropdownOptions.length > 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 pb-4 pt-1 relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            ref: modeButtonRef,
                            type: "button",
                            onClick: ()=>setModeMenuOpen((v)=>!v),
                            disabled: loading || !canChangeMode,
                            "aria-expanded": modeMenuOpen,
                            "aria-haspopup": "listbox",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-sm font-medium transition-colors disabled:opacity-50", "bg-gray-200/60 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-300/60 dark:hover:bg-white/20"),
                            children: (()=>{
                                const Icon = current.icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "h-4 w-4 shrink-0",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                            lineNumber: 298,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: current.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                            lineNumber: 299,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4 shrink-0 transition-transform", modeMenuOpen && "rotate-180"),
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                            lineNumber: 300,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true);
                            })()
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                            lineNumber: 282,
                            columnNumber: 13
                        }, this),
                        modeMenuOpen && canChangeMode && menuPosition && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "fixed inset-0 z-[100]",
                                    "aria-hidden": true,
                                    onClick: ()=>setModeMenuOpen(false)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 312,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    role: "listbox",
                                    className: "fixed z-[101] rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 dark:backdrop-blur-xl shadow-lg py-1 max-h-48 overflow-auto",
                                    style: {
                                        top: menuPosition.top,
                                        left: menuPosition.left,
                                        width: menuPosition.width
                                    },
                                    children: dropdownOptions.map((param)=>{
                                        let { mode, label, icon: Icon } = param;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            role: "option",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    if (mode === "off") setPower(false);
                                                    else setHvacMode(mode);
                                                    setModeMenuOpen(false);
                                                },
                                                disabled: loading,
                                                className: "w-full flex items-center gap-2 rounded-lg py-2 px-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        className: "h-4 w-4 shrink-0",
                                                        "aria-hidden": true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                                        lineNumber: 338,
                                                        columnNumber: 27
                                                    }, this),
                                                    label
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                                lineNumber: 328,
                                                columnNumber: 25
                                            }, this)
                                        }, mode, false, {
                                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                            lineNumber: 327,
                                            columnNumber: 23
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 317,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true), document.body)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                    lineNumber: 281,
                    columnNumber: 11
                }, this);
            })()
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
        lineNumber: 204,
        columnNumber: 5
    }, this);
}
_s(ClimateCard2Widget, "s1NWf3DKAPvGyjTuA+6jdOwg3c8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
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
    let { title = "Zonnepanelen", entity_id, consumption_entity_id, size = "md", className, onMoreClick } = param;
    _s1();
    const yieldData = useEntityValue(entity_id);
    const consumptionData = useEntityValue(consumption_entity_id !== null && consumption_entity_id !== void 0 ? consumption_entity_id : "");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium truncate text-white/90",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60 truncate",
                                children: yieldData.friendlyName
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.stopPropagation();
                            onMoreClick();
                        },
                        className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                        "aria-label": "Opties",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                            className: "h-5 w-5",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                            lineNumber: 56,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                lineNumber: 44,
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
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold tabular-nums text-amber-400/95",
                                children: formatValue(yieldData.value, yieldData.unit)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                        lineNumber: 61,
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
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold tabular-nums text-white/95",
                                children: formatValue(consumptionData.value, consumptionData.unit)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
        lineNumber: 35,
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
    const maxLeft = window.innerWidth - CARD_WIDTH;
    const maxBottom = window.innerHeight - 120;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingSolarCard(param) {
    let { title, entity_id, consumption_entity_id, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
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
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSolarCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingSolarCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSolarCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingSolarCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingSolarCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingSolarCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSolarCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingSolarCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
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
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
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
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingSolarCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SolarCardWidget"], {
                title: title,
                entity_id: entity_id,
                consumption_entity_id: consumption_entity_id,
                size: "md",
                onMoreClick: editMode ? onEdit : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
                lineNumber: 199,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
            lineNumber: 198,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-solar-card.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
_s(FloatingSolarCard, "cqjMHnH5wpjrD9gtyuHCmwT2RFo=");
_c = FloatingSolarCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingSolarCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/energy-monitor-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnergyMonitorCardWidget",
    ()=>EnergyMonitorCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function EnergyMonitorCardWidget(param) {
    let { title = "Afbeeldingskaart", background_image, minimal = false, size = "md", className, onMoreClick } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full min-h-[200px] flex-col overflow-hidden rounded-2xl text-white", !minimal && "shadow-xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            background_image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center", !minimal && "bg-slate-900"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: background_image,
                    alt: "",
                    className: "w-full h-full object-contain object-center"
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                    lineNumber: 34,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, this) : !minimal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                lineNumber: 42,
                columnNumber: 11
            }, this),
            !minimal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/30 dark:bg-black/40 rounded-2xl"
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex flex-col z-10 flex-1 min-h-0",
                children: !minimal ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between gap-2 flex-shrink-0 px-4 pt-3 pb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/30 text-amber-400",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                        className: "h-5 w-5",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                                        lineNumber: 57,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                                    lineNumber: 56,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold text-white/95",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                            lineNumber: 55,
                            columnNumber: 13
                        }, this),
                        onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: (e)=>{
                                e.stopPropagation();
                                onMoreClick();
                            },
                            className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                            "aria-label": "Opties",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                className: "h-5 w-5",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                                lineNumber: 71,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                            lineNumber: 62,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                    lineNumber: 54,
                    columnNumber: 11
                }, this) : onMoreClick ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute right-2 top-2 z-20",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.stopPropagation();
                            onMoreClick();
                        },
                        className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                        "aria-label": "Opties",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                            className: "h-5 w-5",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                            lineNumber: 86,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                        lineNumber: 77,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this) : null
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/energy-monitor-card-widget.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
_c = EnergyMonitorCardWidget;
var _c;
__turbopack_context__.k.register(_c, "EnergyMonitorCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-energy-monitor-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingEnergyMonitorCard",
    ()=>FloatingEnergyMonitorCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$monitor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/energy-monitor-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const STORAGE_KEY = "dashboard.floatingEnergyMonitorCardPosition";
const DEFAULT_OFFSET = 24;
const DEFAULT_WIDTH = 360;
const DEFAULT_HEIGHT = 260;
const MAX_WIDTH = 420;
function loadPosition(cardHeight) {
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
                bottom: window.innerHeight - p.top - cardHeight
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
function defaultPosition(cardWidth, cardHeight) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const maxLeft = window.innerWidth - cardWidth;
    const maxBottom = window.innerHeight - cardHeight - 24;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingEnergyMonitorCard(param) {
    let { title, background_image, minimal = false, scale: scaleProp, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    _s();
    const [dimensions, setDimensions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    });
    const scale = Math.min(1.5, Math.max(0.5, scaleProp !== null && scaleProp !== void 0 ? scaleProp : 1));
    const cardWidth = Math.round(dimensions.width * scale);
    const cardHeight = Math.round(dimensions.height * scale);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingEnergyMonitorCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition(DEFAULT_HEIGHT)) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                bottom: 0
            };
        }
    }["FloatingEnergyMonitorCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingEnergyMonitorCard.useEffect": ()=>{
            if (!background_image) {
                setDimensions({
                    width: DEFAULT_WIDTH,
                    height: DEFAULT_HEIGHT
                });
                return;
            }
            const img = new Image();
            img.onload = ({
                "FloatingEnergyMonitorCard.useEffect": ()=>{
                    const w = img.naturalWidth;
                    const h = img.naturalHeight;
                    if (w > 0 && h > 0) {
                        const scale = Math.min(1, MAX_WIDTH / w);
                        const width = Math.round(w * scale);
                        const height = Math.round(h * scale);
                        setDimensions({
                            width,
                            height
                        });
                    }
                }
            })["FloatingEnergyMonitorCard.useEffect"];
            img.src = background_image;
        }
    }["FloatingEnergyMonitorCard.useEffect"], [
        background_image
    ]);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingEnergyMonitorCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingEnergyMonitorCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingEnergyMonitorCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingEnergyMonitorCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingEnergyMonitorCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingEnergyMonitorCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingEnergyMonitorCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingEnergyMonitorCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingEnergyMonitorCard.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (!initialized.current) {
                initialized.current = true;
                const saved = loadPosition(cardHeight);
                if (saved) {
                    setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved));
                    return;
                }
                const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(cardWidth, cardHeight));
                setPosition(p);
                savePosition(p);
            }
        }
    }["FloatingEnergyMonitorCard.useEffect"], [
        cardWidth,
        cardHeight
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingEnergyMonitorCard.useCallback[handlePointerDown]": (e)=>{
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
        }
    }["FloatingEnergyMonitorCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingEnergyMonitorCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const raw = {
                left: dragStart.current.left + dx,
                bottom: dragStart.current.bottom - dy
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw));
        }
    }["FloatingEnergyMonitorCard.useCallback[handlePointerMove]"], [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingEnergyMonitorCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const raw = {
                    left: dragStart.current.left + dx,
                    bottom: dragStart.current.bottom - dy
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw);
                setPosition(next);
                savePosition(next);
            }
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingEnergyMonitorCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-20 rounded-2xl", minimal ? "bg-transparent overflow-visible" : "overflow-hidden shadow-xl bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            width: cardWidth,
            height: cardHeight,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: [
            editMode && onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: (e)=>{
                    e.stopPropagation();
                    onEdit();
                },
                className: "absolute right-2 bottom-2 z-50 p-1.5 rounded-lg shrink-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors",
                "aria-label": "Opties",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                    className: "h-5 w-5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/floating-energy-monitor-card.tsx",
                    lineNumber: 241,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-energy-monitor-card.tsx",
                lineNumber: 232,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col h-full min-h-0 overflow-hidden rounded-2xl", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$monitor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyMonitorCardWidget"], {
                    title: title,
                    background_image: background_image,
                    minimal: minimal,
                    size: "md",
                    onMoreClick: undefined,
                    className: "flex-1 min-h-0"
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/floating-energy-monitor-card.tsx",
                    lineNumber: 245,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-energy-monitor-card.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/floating-energy-monitor-card.tsx",
        lineNumber: 197,
        columnNumber: 5
    }, this);
}
_s(FloatingEnergyMonitorCard, "/YZ1Hw/TDCe1i0Z2xCl9cJC/rqo=");
_c = FloatingEnergyMonitorCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingEnergyMonitorCard");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
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
        lineNumber: 22,
        columnNumber: 46
    }, this);
    if (s === "clear-night") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 23,
        columnNumber: 35
    }, this);
    if (s === "fog" || s === "mist") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__["CloudFog"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 24,
        columnNumber: 43
    }, this);
    if (s === "rainy" || s === "pouring" || s === "hail") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__["CloudRain"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 25,
        columnNumber: 64
    }, this);
    if (s === "snowy" || s === "snowy-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__["CloudSnow"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 26,
        columnNumber: 52
    }, this);
    if (s === "lightning" || s === "lightning-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__["CloudLightning"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 27,
        columnNumber: 60
    }, this);
    if (s === "windy" || s === "windy-variant") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 28,
        columnNumber: 54
    }, this);
    if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 29,
        columnNumber: 77
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 30,
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
    let { title = "Weather", entity_id, size = "md", show_icon = true, className, onMoreClick } = param;
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
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full h-full min-h-[125px] flex-col overflow-hidden rounded-2xl text-white shadow-xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute inset-0 bg-gradient-to-b rounded-2xl", bgGradient)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 126,
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
                    lineNumber: 135,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/25 dark:bg-black/50 rounded-2xl"
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex flex-col z-10 h-full min-h-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-3 px-4 py-3 flex-shrink-0",
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
                                            lineNumber: 148,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                        lineNumber: 147,
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
                                                lineNumber: 152,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-white/60 truncate drop-shadow-sm",
                                                children: friendlyName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                                lineNumber: 153,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                lineNumber: 145,
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
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            Math.round(humidity),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onMoreClick();
                                },
                                className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 drop-shadow-sm transition-colors",
                                "aria-label": "Opties",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                    lineNumber: 169,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-h-0"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pb-4 pt-2 flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-bold tabular-nums text-white drop-shadow-md", size === "sm" && "text-4xl", size === "md" && "text-5xl", size === "lg" && "text-6xl"),
                            children: formatTemp(temperature)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 116,
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
const STORAGE_KEY = "dashboard.floatingWeatherCardPosition";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 320;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const DEFAULT_CARD_HEIGHT = 180;
const MIN_HEIGHT = 100;
const MAX_HEIGHT = 400;
function clampWidth(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}
function clampHeight(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_HEIGHT;
    return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(n)));
}
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
function defaultPosition(cardWidth, cardHeight) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const maxLeft = window.innerWidth - cardWidth;
    const maxBottom = window.innerHeight - cardHeight - 24;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingWeatherCard(param) {
    let { title, entity_id, show_icon = true, width, height, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    _s();
    const totalWidth = clampWidth(width);
    const totalHeight = clampHeight(height);
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
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingWeatherCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingWeatherCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingWeatherCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingWeatherCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingWeatherCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingWeatherCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingWeatherCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingWeatherCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingWeatherCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - totalHeight - 24 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition();
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(totalWidth, totalHeight), bounds);
            setPosition(p);
            savePosition(p);
        }
    }["FloatingWeatherCard.useEffect"], [
        totalWidth,
        totalHeight
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingWeatherCard.useCallback[handlePointerDown]": (e)=>{
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
        }
    }["FloatingWeatherCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
    const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - totalHeight - 24 : "TURBOPACK unreachable";
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingWeatherCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
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
        isDragging,
        maxLeft,
        maxBottom
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingWeatherCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
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
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingWeatherCard.useCallback[handlePointerUp]"], [
        isDragging,
        maxLeft,
        maxBottom
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            width: totalWidth,
            height: totalHeight,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col h-full min-h-0", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WeatherCardWidget"], {
                title: title,
                entity_id: entity_id,
                show_icon: show_icon,
                size: "md",
                onMoreClick: editMode ? onEdit : undefined,
                className: "flex-1 min-h-0"
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                lineNumber: 223,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
            lineNumber: 222,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
        lineNumber: 192,
        columnNumber: 5
    }, this);
}
_s(FloatingWeatherCard, "cqjMHnH5wpjrD9gtyuHCmwT2RFo=");
_c = FloatingWeatherCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingWeatherCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/vacuum-card-widget.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VacuumCardWidget",
    ()=>VacuumCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
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
    let { title = "Stofzuiger", entity_id, script_ids = [], script_names = {}, cleaned_area_entity_id, icon: iconName, size = "md", className, onMoreClick } = param;
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
    var _ref;
    const state = (_ref = entity === null || entity === void 0 ? void 0 : entity.state) !== null && _ref !== void 0 ? _ref : "unknown";
    var _ref1;
    const friendlyName = (_ref1 = entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.friendly_name) !== null && _ref1 !== void 0 ? _ref1 : entity_id;
    var _STATE_LABELS_state;
    const statusLabel = (_STATE_LABELS_state = STATE_LABELS[state]) !== null && _STATE_LABELS_state !== void 0 ? _STATE_LABELS_state : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["capitalizeFirst"])(state);
    const cleanedAreaValue = cleanedAreaEntity === null || cleanedAreaEntity === void 0 ? void 0 : cleanedAreaEntity.state;
    var _unit_of_measurement;
    const cleanedAreaUnit = (_unit_of_measurement = (_this = cleanedAreaEntity === null || cleanedAreaEntity === void 0 ? void 0 : cleanedAreaEntity.attributes) === null || _this === void 0 ? void 0 : _this.unit_of_measurement) !== null && _unit_of_measurement !== void 0 ? _unit_of_measurement : "";
    const showCleanedArea = cleaned_area_entity_id && cleanedAreaValue != null && cleanedAreaValue !== "";
    const IconComponent = iconName && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"].Bot;
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
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10 min-h-[7.75rem]", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3 px-4 py-3 shrink-0",
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
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 95,
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
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/60 truncate",
                                        children: friendlyName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 shrink-0 min-w-0 max-w-[45%]",
                        children: [
                            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onMoreClick();
                                },
                                className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                                "aria-label": "Opties",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                    lineNumber: 116,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-end min-w-0 flex-1",
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
                                        lineNumber: 120,
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
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            script_ids.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-3 pt-3 border-t border-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-1.5",
                    children: script_ids.map((scriptId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScriptTag, {
                            entityId: scriptId,
                            displayName: script_names === null || script_names === void 0 ? void 0 : script_names[scriptId],
                            onRun: ()=>runScript(scriptId),
                            loading: loadingScript === scriptId,
                            active: activeScriptId === scriptId,
                            disabled: isAnyScriptActive && activeScriptId !== scriptId
                        }, scriptId, false, {
                            fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                            lineNumber: 145,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                    lineNumber: 143,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(VacuumCardWidget, "bj6ggkmlHZaM/saw4uHk9Bwj8KI=", false, function() {
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
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-normal transition-colors", active ? "border-amber-400/40 bg-amber-500/20 text-amber-200/95" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/85 hover:border-white/20", (loading || disabled) && !active && "opacity-50 cursor-not-allowed"),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "truncate max-w-[7rem]",
            children: loading ? "…" : label
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
            lineNumber: 194,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
        lineNumber: 182,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/vacuum-card-widget.tsx [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    const maxLeft = window.innerWidth - CARD_WIDTH;
    const maxBottom = window.innerHeight - 120;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingVacuumCard(param) {
    let { title, entity_id, script_ids = [], script_names = {}, cleaned_area_entity_id, icon, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
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
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingVacuumCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingVacuumCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingVacuumCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingVacuumCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingVacuumCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingVacuumCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingVacuumCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingVacuumCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
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
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
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
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingVacuumCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["VacuumCardWidget"], {
                title: title,
                entity_id: entity_id,
                script_ids: script_ids,
                script_names: script_names,
                cleaned_area_entity_id: cleaned_area_entity_id,
                icon: icon,
                size: "md",
                onMoreClick: editMode ? onEdit : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
                lineNumber: 200,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
            lineNumber: 199,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-vacuum-card.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_s(FloatingVacuumCard, "cqjMHnH5wpjrD9gtyuHCmwT2RFo=");
_c = FloatingVacuumCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingVacuumCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/sensor-card-widget.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SENSOR_CONDITION_COLORS",
    ()=>SENSOR_CONDITION_COLORS,
    "SENSOR_CONDITION_OPERATORS",
    ()=>SENSOR_CONDITION_OPERATORS,
    "SensorCardWidget",
    ()=>SensorCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
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
        if (!condValue) continue;
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
;
function formatValue(state) {
    if (state == null || state === "unavailable" || state === "unknown") return "—";
    const num = Number(state);
    if (!Number.isNaN(num)) {
        if (Number.isInteger(num)) return String(num);
        return String(Math.round(num * 100) / 100);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["capitalizeFirst"])(state);
}
function SensorCardWidget(param) {
    let { title = "Sensor", entity_id, icon: iconName, size = "md", conditions, className, onMoreClick } = param;
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
    const IconComponent = iconName && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"].Gauge;
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
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                                lineNumber: 109,
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
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/60 truncate",
                                        children: friendlyName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                                        lineNumber: 114,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    onMoreClick ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.stopPropagation();
                            onMoreClick();
                        },
                        className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                        "aria-label": "Opties",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                            className: "h-5 w-5",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0 rounded-full p-1 text-white/50 hover:text-white/70",
                        "aria-label": "Info",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                            className: "h-4 w-4",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                lineNumber: 107,
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
                            lineNumber: 134,
                            columnNumber: 11
                        }, this),
                        unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "inline-flex items-center rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300/95",
                            children: unit
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                    lineNumber: 133,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
        lineNumber: 97,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/sensor-card-widget.tsx [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    const maxLeft = window.innerWidth - CARD_WIDTH;
    const maxBottom = window.innerHeight - 120;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingSensorCard(param) {
    let { title, entity_id, icon, size = "md", conditions, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
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
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSensorCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingSensorCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSensorCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingSensorCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingSensorCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingSensorCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingSensorCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingSensorCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
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
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
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
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingSensorCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SensorCardWidget"], {
                title: title,
                entity_id: entity_id,
                icon: icon,
                size: size,
                conditions: conditions,
                onMoreClick: editMode ? onEdit : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
                lineNumber: 205,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
            lineNumber: 204,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-sensor-card.tsx",
        lineNumber: 176,
        columnNumber: 5
    }, this);
}
_s(FloatingSensorCard, "cqjMHnH5wpjrD9gtyuHCmwT2RFo=");
_c = FloatingSensorCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingSensorCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/pill-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PILL_CONDITION_COLORS",
    ()=>PILL_CONDITION_COLORS,
    "PILL_CONDITION_OPERATORS",
    ()=>PILL_CONDITION_OPERATORS,
    "PillCardWidget",
    ()=>PillCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
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
const PILL_CONDITION_COLORS = Object.keys(CONDITION_COLORS);
_c = PILL_CONDITION_COLORS;
const PILL_CONDITION_OPERATORS = [
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
        if (!condValue) continue;
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
function formatValue(state) {
    if (state == null || state === "unavailable" || state === "unknown") return "—";
    const num = Number(state);
    if (!Number.isNaN(num)) {
        if (Number.isInteger(num)) return String(num);
        return String(Math.round(num * 100) / 100);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["capitalizeFirst"])(state);
}
const TOGGLE_DOMAINS = [
    "switch",
    "light",
    "input_boolean"
];
/** Styling op basis van status wanneer geen voorwaarde matcht: aan = actief, uit = gedempt. */ const STATUS_STYLE = {
    on: "border-emerald-400/50 dark:border-emerald-400/40 bg-emerald-500/25 dark:bg-emerald-900/30",
    off: "border-white/10 dark:border-white/10 bg-white/5 dark:bg-black/40 opacity-90",
    neutral: "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10"
};
function PillCardWidget(param) {
    let { title = "Pill", entity_id, icon: iconName, conditions, show_state = true, className, onMoreClick } = param;
    var _entity_attributes;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "PillCardWidget.useEntityStateStore[entity]": (s)=>s.getState(entity_id)
    }["PillCardWidget.useEntityStateStore[entity]"]);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "PillCardWidget.useEntityStateStore[setStates]": (s)=>s.setStates
    }["PillCardWidget.useEntityStateStore[setStates]"]);
    const state = entity === null || entity === void 0 ? void 0 : entity.state;
    var _ref;
    const unit = (_ref = entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.unit_of_measurement) !== null && _ref !== void 0 ? _ref : "";
    var _entity_id_split_;
    const domain = (_entity_id_split_ = entity_id.split(".")[0]) !== null && _entity_id_split_ !== void 0 ? _entity_id_split_ : "";
    const canToggle = TOGGLE_DOMAINS.includes(domain);
    const isOn = state === "on";
    const IconComponent = iconName && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"].CircleDot;
    const displayValue = canToggle ? isOn ? "Aan" : "Uit" : formatValue(state);
    const matchedColor = matchCondition(state, conditions);
    const conditionClass = matchedColor && CONDITION_COLORS[matchedColor] ? CONDITION_COLORS[matchedColor] : canToggle ? isOn ? STATUS_STYLE.on : STATUS_STYLE.off : STATUS_STYLE.neutral;
    async function handleToggle(e) {
        e.stopPropagation();
        if (!canToggle) return;
        const nextOn = !isOn;
        try {
            const res = await fetch("/api/ha/call-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entity_id,
                    domain,
                    service: nextOn ? "turn_on" : "turn_off",
                    service_data: {
                        entity_id
                    }
                })
            });
            if (res.ok) {
                const data = await fetch("/api/ha/state").then((r)=>r.json());
                if (Array.isArray(data)) setStates(data);
            }
        } catch (e) {
        // ignore
        }
    }
    const iconOnly = !show_state;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center h-9 rounded-full border text-sm font-medium shadow-lg backdrop-blur-xl text-white min-w-0 transition-colors duration-200", conditionClass, canToggle && "cursor-pointer hover:opacity-90 transition-opacity", iconOnly ? onMoreClick ? "relative w-12 h-9 px-1.5 justify-center shrink-0" : "relative w-9 h-9 p-0 justify-center shrink-0" : "gap-2 pl-0.5 pr-3", className),
        ...canToggle && {
            onClick: handleToggle,
            role: "button",
            "aria-pressed": isOn
        },
        title: iconOnly ? "".concat(title).concat(state != null && state !== "unavailable" ? ": ".concat(displayValue) : "") : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0 items-center justify-center rounded-full bg-white/15 text-white flex", iconOnly ? "h-7 w-7" : "h-7 w-7"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                    className: "h-4 w-4",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            !iconOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate text-white/95",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "tabular-nums text-white shrink-0",
                        children: [
                            displayValue,
                            unit && !canToggle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/70 ml-0.5",
                                children: unit
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
                                lineNumber: 166,
                                columnNumber: 36
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
                lineNumber: 162,
                columnNumber: 9
            }, this),
            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: (e)=>{
                    e.stopPropagation();
                    onMoreClick();
                },
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-full shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors", iconOnly ? "absolute -right-0.5 -top-0.5 p-0.5" : "p-1"),
                "aria-label": "Opties",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                    className: "h-4 w-4",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
                    lineNumber: 180,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
                lineNumber: 171,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_s(PillCardWidget, "f4y28CP5U7KSSZ6JV2RE2+aHy+I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c1 = PillCardWidget;
var _c, _c1;
__turbopack_context__.k.register(_c, "PILL_CONDITION_COLORS");
__turbopack_context__.k.register(_c1, "PillCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-pill-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingPillCard",
    ()=>FloatingPillCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/pill-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const STORAGE_KEY_PREFIX = "dashboard.floatingPillCardPosition.";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 280;
function loadPosition(widgetId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
        if (!s) return null;
        const p = JSON.parse(s);
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.bottom) === "number") return {
            left: p.left,
            bottom: p.bottom
        };
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.top) === "number") {
            return {
                left: p.left,
                bottom: window.innerHeight - p.top - 80
            };
        }
    } catch (e) {
    // ignore
    }
    return null;
}
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition(_widgetIndex) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const maxLeft = window.innerWidth - CARD_WIDTH;
    const maxBottom = window.innerHeight - 120;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingPillCard(param) {
    let { widget, widgetIndex = 0, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    _s();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingPillCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition(widget.id)) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                bottom: DEFAULT_OFFSET
            };
        }
    }["FloatingPillCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0,
        width: CARD_WIDTH,
        height: 80
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingPillCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingPillCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingPillCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingPillCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingPillCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingPillCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingPillCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingPillCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingPillCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const w = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth : "TURBOPACK unreachable";
            const h = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight : "TURBOPACK unreachable";
            const maxLeft = w - CARD_WIDTH;
            const maxBottom = h - 80;
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition(widget.id);
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(widgetIndex), bounds);
            setPosition(p);
            savePosition(widget.id, p);
        }
    }["FloatingPillCard.useEffect"], [
        widget.id,
        widgetIndex
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingPillCard.useCallback[handlePointerDown]": (e)=>{
            var _closest, _this, _el_setPointerCapture;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            const el = e.currentTarget;
            const width = el.offsetWidth;
            const height = el.offsetHeight;
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom,
                width,
                height
            };
            (_el_setPointerCapture = el.setPointerCapture) === null || _el_setPointerCapture === void 0 ? void 0 : _el_setPointerCapture.call(el, e.pointerId);
        }
    }["FloatingPillCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingPillCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = Math.max(0, (("TURBOPACK compile-time truthy", 1) ? window.innerWidth : "TURBOPACK unreachable") - dragStart.current.width);
            const maxBottom = Math.max(0, (("TURBOPACK compile-time truthy", 1) ? window.innerHeight : "TURBOPACK unreachable") - dragStart.current.height);
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            }));
        }
    }["FloatingPillCard.useCallback[handlePointerMove]"], [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingPillCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const maxLeft = Math.max(0, (("TURBOPACK compile-time truthy", 1) ? window.innerWidth : "TURBOPACK unreachable") - dragStart.current.width);
                const maxBottom = Math.max(0, (("TURBOPACK compile-time truthy", 1) ? window.innerHeight : "TURBOPACK unreachable") - dragStart.current.height);
                const raw = {
                    left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                    maxLeft,
                    maxBottom
                });
                setPosition(next);
                savePosition(widget.id, next);
            }
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingPillCard.useCallback[handlePointerUp]"], [
        isDragging,
        widget.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-max max-w-[280px] shadow-xl rounded-2xl overflow-hidden bg-transparent", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-2xl [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PillCardWidget"], {
                title: widget.title,
                entity_id: widget.entity_id,
                icon: widget.icon,
                conditions: widget.conditions,
                show_state: widget.show_state !== false,
                onMoreClick: editMode ? onEdit : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-pill-card.tsx",
                lineNumber: 214,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-pill-card.tsx",
            lineNumber: 213,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-pill-card.tsx",
        lineNumber: 185,
        columnNumber: 5
    }, this);
}
_s(FloatingPillCard, "4Q/dqIKGGEvPJ/UgUv3i1rWJGxM=");
_c = FloatingPillCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingPillCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-card-group.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingCardGroup",
    ()=>FloatingCardGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/pill-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const STORAGE_KEY_PREFIX = "dashboard.floatingCardGroupPosition.";
const DEFAULT_OFFSET = 24;
const CARD_MIN_WIDTH = 200;
const CARD_MIN_HEIGHT = 80;
/** Extra marge links/onder zodat de kaart tot aan de rand geplaatst kan worden. Rechts/boven geen overflow zodat de kaart niet uit het scherm kan. */ const DRAG_OVERFLOW_LEFT_BOTTOM = 24;
function loadPosition(widgetId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
        if (!s) return null;
        const p = JSON.parse(s);
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.bottom) === "number") return {
            left: p.left,
            bottom: p.bottom
        };
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.top) === "number") {
            return {
                left: p.left,
                bottom: window.innerHeight - p.top - 120
            };
        }
    } catch (e) {
    // ignore
    }
    return null;
}
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition(_widgetIndex) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const maxLeft = window.innerWidth - CARD_MIN_WIDTH;
    const maxBottom = window.innerHeight - 120;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const JUSTIFY_MAP = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between"
};
const LONG_PRESS_MS = 500;
function FloatingCardGroup(param) {
    let { group, widgetIndex = 0, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    _s();
    var _ref;
    const alignment = (_ref = group.alignment) !== null && _ref !== void 0 ? _ref : "start";
    var _group_children;
    const children = (_group_children = group.children) !== null && _group_children !== void 0 ? _group_children : [];
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingCardGroup.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition(group.id)) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                bottom: DEFAULT_OFFSET
            };
        }
    }["FloatingCardGroup.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0,
        width: CARD_MIN_WIDTH,
        height: CARD_MIN_HEIGHT
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingCardGroup.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingCardGroup.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingCardGroup.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingCardGroup.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingCardGroup.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingCardGroup.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingCardGroup.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingCardGroup.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingCardGroup.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const w = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth : "TURBOPACK unreachable";
            const h = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight : "TURBOPACK unreachable";
            const maxLeft = w - CARD_MIN_WIDTH;
            const maxBottom = h - CARD_MIN_HEIGHT;
            const minLeft = -DRAG_OVERFLOW_LEFT_BOTTOM;
            const minBottom = -DRAG_OVERFLOW_LEFT_BOTTOM;
            const bounds = {
                maxLeft,
                maxBottom,
                minLeft,
                minBottom
            };
            const saved = loadPosition(group.id);
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(widgetIndex), bounds);
            setPosition(p);
            savePosition(group.id, p);
        }
    }["FloatingCardGroup.useEffect"], [
        group.id,
        widgetIndex
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingCardGroup.useCallback[handlePointerDown]": (e)=>{
            var _closest, _this, _el_setPointerCapture;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "[data-group-opts]")) return;
            e.preventDefault();
            const el = e.currentTarget;
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom,
                width: el.offsetWidth,
                height: el.offsetHeight
            };
            (_el_setPointerCapture = el.setPointerCapture) === null || _el_setPointerCapture === void 0 ? void 0 : _el_setPointerCapture.call(el, e.pointerId);
            setIsDragging(true);
        }
    }["FloatingCardGroup.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingCardGroup.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const w = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth : "TURBOPACK unreachable";
            const h = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight : "TURBOPACK unreachable";
            const maxLeft = w - dragStart.current.width;
            const maxBottom = h - dragStart.current.height;
            const minLeft = -DRAG_OVERFLOW_LEFT_BOTTOM;
            const minBottom = -DRAG_OVERFLOW_LEFT_BOTTOM;
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])({
                left: Math.max(minLeft, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(minBottom, Math.min(dragStart.current.bottom - dy, maxBottom))
            }, {
                maxLeft,
                maxBottom,
                minLeft,
                minBottom
            }));
        }
    }["FloatingCardGroup.useCallback[handlePointerMove]"], [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingCardGroup.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const w = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth : "TURBOPACK unreachable";
                const h = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight : "TURBOPACK unreachable";
                const maxLeft = w - dragStart.current.width;
                const maxBottom = h - dragStart.current.height;
                const minLeft = -DRAG_OVERFLOW_LEFT_BOTTOM;
                const minBottom = -DRAG_OVERFLOW_LEFT_BOTTOM;
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])({
                    left: Math.max(minLeft, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(minBottom, Math.min(dragStart.current.bottom - dy, maxBottom))
                }, {
                    maxLeft,
                    maxBottom,
                    minLeft,
                    minBottom
                });
                setPosition(next);
                savePosition(group.id, next);
            }
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingCardGroup.useCallback[handlePointerUp]"], [
        isDragging,
        group.id
    ]);
    var _JUSTIFY_MAP_alignment;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-max max-w-[90vw] shadow-xl rounded-2xl overflow-hidden relative", editMode && "bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: [
            editMode && onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "data-group-opts": true,
                onClick: (e)=>{
                    e.stopPropagation();
                    onEdit();
                },
                className: "absolute right-2 top-2 z-10 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                "aria-label": "Opties",
                title: "Bewerken of verwijderen",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                    className: "h-5 w-5",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/floating-card-group.tsx",
                    lineNumber: 240,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-card-group.tsx",
                lineNumber: 232,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-wrap items-center gap-2 p-2 min-h-[52px]", (_JUSTIFY_MAP_alignment = JUSTIFY_MAP[alignment]) !== null && _JUSTIFY_MAP_alignment !== void 0 ? _JUSTIFY_MAP_alignment : "justify-start"),
                children: [
                    children.filter((c)=>c.type === "pill_card").map((child)=>{
                        var _child_title, _child_entity_id;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PillCardWidget"], {
                            title: (_child_title = child.title) !== null && _child_title !== void 0 ? _child_title : "Pill",
                            entity_id: (_child_entity_id = child.entity_id) !== null && _child_entity_id !== void 0 ? _child_entity_id : "",
                            icon: child.icon,
                            conditions: child.conditions,
                            show_state: child.show_state !== false,
                            onMoreClick: undefined
                        }, child.id, false, {
                            fileName: "[project]/src/components/widgets/floating-card-group.tsx",
                            lineNumber: 252,
                            columnNumber: 13
                        }, this);
                    }),
                    editMode && children.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        "data-group-opts": true,
                        onClick: (e)=>{
                            e.stopPropagation();
                            onEdit === null || onEdit === void 0 ? void 0 : onEdit();
                        },
                        className: "text-sm text-white/60 hover:text-white/90 border border-dashed border-white/30 rounded-lg px-3 py-2",
                        children: "+ Kaart toevoegen"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-card-group.tsx",
                        lineNumber: 263,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/floating-card-group.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/floating-card-group.tsx",
        lineNumber: 203,
        columnNumber: 5
    }, this);
}
_s(FloatingCardGroup, "Eo1pL3wonPBavwfnhNQYUUOuwuo=");
_c = FloatingCardGroup;
var _c;
__turbopack_context__.k.register(_c, "FloatingCardGroup");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-2-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const CLIMATE_ICON_OPTIONS = [];
const STORAGE_KEY = "dashboard.floatingClimateCardPosition";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 320;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const DEFAULT_CARD_HEIGHT = 180;
const MIN_HEIGHT = 100;
const MAX_HEIGHT = 400;
const SWIPE_THRESHOLD_PX = 50;
function clampWidth(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}
function clampHeight(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_HEIGHT;
    return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(n)));
}
const SLIDE_DURATION_MS = 280;
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
function defaultPosition(cardWidth, cardHeight) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const maxLeft = window.innerWidth - cardWidth;
    const maxBottom = window.innerHeight - cardHeight - 24;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingClimateCard(param) {
    let { widgets: widgetsProp, title: titleProp, entity_id: entityIdProp, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    var _widgets_, _widgets_1;
    _s();
    const widgets = widgetsProp !== null && widgetsProp !== void 0 ? widgetsProp : titleProp != null && entityIdProp != null ? [
        {
            id: "",
            title: titleProp,
            entity_id: entityIdProp,
            type: "climate_card_2"
        }
    ] : [];
    const totalWidth = clampWidth((_widgets_ = widgets[0]) === null || _widgets_ === void 0 ? void 0 : _widgets_.width);
    const totalHeight = clampHeight((_widgets_1 = widgets[0]) === null || _widgets_1 === void 0 ? void 0 : _widgets_1.height);
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [flipDeg, setFlipDeg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [nextIndex, setNextIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const swipeAreaLongPressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingClimateCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[startLongPress]": (e)=>{
            var _closest, _this, _setPointerCapture, _this1;
            if (editMode || !onEnterEditMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "[data-climate-swipe-area]")) return;
            clearLongPress();
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingClimateCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingClimateCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingClimateCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingClimateCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingClimateCard.useEffect": ()=>{
            if (widgets.length === 0) return;
            setSelectedIndex({
                "FloatingClimateCard.useEffect": (prev)=>Math.min(prev, Math.max(0, widgets.length - 1))
            }["FloatingClimateCard.useEffect"]);
        }
    }["FloatingClimateCard.useEffect"], [
        widgets.length
    ]);
    var _widgets_selectedIndex;
    const selected = (_widgets_selectedIndex = widgets[selectedIndex]) !== null && _widgets_selectedIndex !== void 0 ? _widgets_selectedIndex : widgets[0];
    const hasMultiple = widgets.length > 1;
    const goToIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[goToIndex]": (index)=>{
            if (index === selectedIndex || index < 0 || index >= widgets.length) return;
            setSelectedIndex(index);
        }
    }["FloatingClimateCard.useCallback[goToIndex]"], [
        selectedIndex,
        widgets.length
    ]);
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
    const swipeStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingClimateCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - totalHeight - 24 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition();
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(totalWidth, totalHeight), bounds);
            setPosition(p);
            savePosition(p);
        }
    }["FloatingClimateCard.useEffect"], [
        totalWidth,
        totalHeight
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[handlePointerDown]": (e)=>{
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
        }
    }["FloatingClimateCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
    const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - totalHeight - 24 : "TURBOPACK unreachable";
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
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
        maxLeft,
        maxBottom
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingClimateCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
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
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingClimateCard.useCallback[handlePointerUp]"], [
        isDragging,
        maxLeft,
        maxBottom
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 flex shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            width: totalWidth,
            height: totalHeight,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-w-0 flex-1 w-full h-full",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-climate-swipe-area": true,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none [&_.rounded-2xl]:rounded-b-none", "relative overflow-hidden", hasMultiple && "touch-none"),
                style: {
                    touchAction: hasMultiple ? "none" : undefined,
                    perspective: "1000px",
                    minHeight: totalHeight
                },
                onPointerDown: hasMultiple ? (e)=>{
                    if (!editMode) {
                        var _setPointerCapture, _this;
                        swipeStart.current = {
                            x: e.clientX,
                            y: e.clientY
                        };
                        (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
                        if (onEnterEditMode) {
                            if (swipeAreaLongPressRef.current) clearTimeout(swipeAreaLongPressRef.current);
                            swipeAreaLongPressRef.current = setTimeout(()=>{
                                swipeAreaLongPressRef.current = null;
                                onEnterEditMode();
                            }, LONG_PRESS_MS);
                        }
                    }
                } : undefined,
                onPointerMove: hasMultiple ? (e)=>{
                    if (swipeStart.current && !editMode) {
                        const dx = e.clientX - swipeStart.current.x;
                        const dy = e.clientY - swipeStart.current.y;
                        if (Math.abs(dx) > 15 || Math.abs(dy) > 15) {
                            if (swipeAreaLongPressRef.current) {
                                clearTimeout(swipeAreaLongPressRef.current);
                                swipeAreaLongPressRef.current = null;
                            }
                            if (Math.abs(dx) > Math.abs(dy)) {
                                e.preventDefault();
                            }
                        }
                    }
                } : undefined,
                onPointerUp: hasMultiple ? (e)=>{
                    var _releasePointerCapture, _this;
                    if (swipeAreaLongPressRef.current) {
                        clearTimeout(swipeAreaLongPressRef.current);
                        swipeAreaLongPressRef.current = null;
                    }
                    if (!swipeStart.current || editMode) return;
                    const dx = e.clientX - swipeStart.current.x;
                    const dy = e.clientY - swipeStart.current.y;
                    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
                        if (dx > 0) goToIndex(selectedIndex - 1);
                        else goToIndex(selectedIndex + 1);
                    }
                    swipeStart.current = null;
                    (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
                } : undefined,
                onPointerCancel: hasMultiple ? (e)=>{
                    var _releasePointerCapture, _this;
                    if (swipeAreaLongPressRef.current) {
                        clearTimeout(swipeAreaLongPressRef.current);
                        swipeAreaLongPressRef.current = null;
                    }
                    swipeStart.current = null;
                    (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
                } : undefined,
                onPointerLeave: hasMultiple ? ()=>{
                    if (swipeAreaLongPressRef.current) {
                        clearTimeout(swipeAreaLongPressRef.current);
                        swipeAreaLongPressRef.current = null;
                    }
                    swipeStart.current = null;
                } : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full overflow-hidden",
                        style: {
                            minHeight: totalHeight
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex w-full h-full",
                            style: {
                                width: hasMultiple ? "".concat(widgets.length * 100, "%") : "100%",
                                transform: hasMultiple ? "translateX(-".concat(selectedIndex * (100 / widgets.length), "%)") : "none",
                                transition: "transform ".concat(SLIDE_DURATION_MS, "ms ease-out")
                            },
                            children: widgets.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "shrink-0 w-full",
                                    style: hasMultiple ? {
                                        width: "".concat(100 / widgets.length, "%")
                                    } : undefined,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateCard2Widget"], {
                                        title: w.title,
                                        entity_id: w.entity_id,
                                        humidity_entity_id: w.humidity_entity_id,
                                        icon: w.icon,
                                        size: "md",
                                        onMoreClick: editMode ? ()=>w.id && (onEdit === null || onEdit === void 0 ? void 0 : onEdit(w.id)) : undefined
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                        lineNumber: 347,
                                        columnNumber: 19
                                    }, this)
                                }, w.id, false, {
                                    fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                    lineNumber: 342,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                            lineNumber: 333,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                        lineNumber: 329,
                        columnNumber: 11
                    }, this),
                    hasMultiple && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-1 left-0 right-0 flex justify-center gap-1.5 pointer-events-none",
                        children: widgets.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-1.5 w-1.5 rounded-full transition-colors duration-300", i === selectedIndex ? "bg-white" : "bg-white/40"),
                                "aria-hidden": true
                            }, i, false, {
                                fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                lineNumber: 362,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                        lineNumber: 360,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                lineNumber: 266,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
            lineNumber: 265,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 235,
        columnNumber: 5
    }, this);
}
_s(FloatingClimateCard, "UGZ9fTZNxN0doxHNq140b+E34C8=");
_c = FloatingClimateCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingClimateCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/title-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TitleCardWidget",
    ()=>TitleCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
function TitleCardWidget(param) {
    let { title, className } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-center py-1", className),
        "aria-hidden": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            className: "text-sm font-semibold text-gray-700 dark:text-gray-300 truncate w-full",
            children: title
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/title-card-widget.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/title-card-widget.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = TitleCardWidget;
var _c;
__turbopack_context__.k.register(_c, "TitleCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-title-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingTitleCard",
    ()=>FloatingTitleCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const STORAGE_KEY = "dashboard.floatingTitleCardPosition";
const DEFAULT_OFFSET = 24;
const PANEL_WIDTH = 200;
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
                bottom: window.innerHeight - p.top - 120
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
    const maxLeft = window.innerWidth - PANEL_WIDTH;
    const maxBottom = window.innerHeight - 120;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingTitleCard(param) {
    let { widgets, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    _s();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingTitleCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition()) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                bottom: DEFAULT_OFFSET
            };
        }
    }["FloatingTitleCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingTitleCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingTitleCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingTitleCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingTitleCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingTitleCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingTitleCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingTitleCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingTitleCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingTitleCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - PANEL_WIDTH : "TURBOPACK unreachable";
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
    }["FloatingTitleCard.useEffect"], []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingTitleCard.useCallback[handlePointerDown]": (e)=>{
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
        }
    }["FloatingTitleCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - PANEL_WIDTH : "TURBOPACK unreachable";
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingTitleCard.useCallback[handlePointerMove]": (e)=>{
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
    }["FloatingTitleCard.useCallback[handlePointerMove]"], [
        isDragging,
        maxLeft
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingTitleCard.useCallback[handlePointerUp]": (e)=>{
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
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingTitleCard.useCallback[handlePointerUp]"], [
        isDragging,
        maxLeft
    ]);
    if (widgets.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 flex flex-col", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            width: PANEL_WIDTH,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-2 flex flex-col gap-1 max-h-[40vh] overflow-auto",
            children: widgets.map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 py-2 px-3 text-sm font-semibold text-gray-700 dark:text-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate flex-1 min-w-0",
                            children: w.title || "Titel"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-title-card.tsx",
                            lineNumber: 208,
                            columnNumber: 13
                        }, this),
                        editMode && onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: (e)=>{
                                e.stopPropagation();
                                onEdit(w.id);
                            },
                            className: "shrink-0 p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 dark:text-gray-400",
                            "aria-label": "Opties",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/floating-title-card.tsx",
                                lineNumber: 216,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-title-card.tsx",
                            lineNumber: 210,
                            columnNumber: 15
                        }, this)
                    ]
                }, w.id, true, {
                    fileName: "[project]/src/components/widgets/floating-title-card.tsx",
                    lineNumber: 204,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-title-card.tsx",
            lineNumber: 202,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-title-card.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
_s(FloatingTitleCard, "56pR/pDe5qWWW+p4aMhQEo90wlE=");
_c = FloatingTitleCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingTitleCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/room-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RoomCardWidget",
    ()=>RoomCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function formatEntityValue(state, attributes) {
    if (state == null || state === "unavailable" || state === "unknown") return "—";
    const num = Number(state);
    if (!Number.isNaN(num)) {
        var _ref;
        const unit = (_ref = attributes === null || attributes === void 0 ? void 0 : attributes.unit) !== null && _ref !== void 0 ? _ref : "";
        if (Number.isInteger(num)) return "".concat(num).concat(unit ? " ".concat(unit) : "");
        return "".concat(Math.round(num * 100) / 100).concat(unit ? " ".concat(unit) : "");
    }
    return String(state);
}
const DEFAULT_ICON_BG = "#3B82F6";
function RoomCardWidget(param) {
    let { title = "Kamer", entity_id, icon = "Home", light_entity_id, background_image, icon_background_color, height, className, embedded, onMoreClick } = param;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "RoomCardWidget.useEntityStateStore[entity]": (s)=>entity_id ? s.getState(entity_id) : null
    }["RoomCardWidget.useEntityStateStore[entity]"]);
    const lightEntity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "RoomCardWidget.useEntityStateStore[lightEntity]": (s)=>light_entity_id ? s.getState(light_entity_id) : null
    }["RoomCardWidget.useEntityStateStore[lightEntity]"]);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "RoomCardWidget.useEntityStateStore[setStates]": (s)=>s.setStates
    }["RoomCardWidget.useEntityStateStore[setStates]"]);
    const updateEntityState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "RoomCardWidget.useEntityStateStore[updateEntityState]": (s)=>s.updateEntityState
    }["RoomCardWidget.useEntityStateStore[updateEntityState]"]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isLightOn = (lightEntity === null || lightEntity === void 0 ? void 0 : lightEntity.state) === "on";
    const refreshState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RoomCardWidget.useCallback[refreshState]": async ()=>{
            const res = await fetch("/api/ha/state").then({
                "RoomCardWidget.useCallback[refreshState]": (r)=>r.json()
            }["RoomCardWidget.useCallback[refreshState]"]);
            if (Array.isArray(res)) setStates(res);
        }
    }["RoomCardWidget.useCallback[refreshState]"], [
        setStates
    ]);
    const toggleLight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RoomCardWidget.useCallback[toggleLight]": async ()=>{
            if (!light_entity_id) return;
            setLoading(true);
            try {
                const res = await fetch("/api/ha/call-service", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        entity_id: light_entity_id,
                        domain: "light",
                        service: isLightOn ? "turn_off" : "turn_on",
                        service_data: isLightOn ? undefined : {
                            brightness_pct: 100
                        }
                    })
                });
                if (res.ok) {
                    updateEntityState(light_entity_id, {
                        state: isLightOn ? "off" : "on"
                    });
                    await refreshState();
                }
            } finally{
                setLoading(false);
            }
        }
    }["RoomCardWidget.useCallback[toggleLight]"], [
        light_entity_id,
        isLightOn,
        updateEntityState,
        refreshState
    ]);
    var _CARD_ICONS_icon;
    const IconComponent = (_CARD_ICONS_icon = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][icon]) !== null && _CARD_ICONS_icon !== void 0 ? _CARD_ICONS_icon : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"].Home;
    const isConfigured = Boolean(entity_id === null || entity_id === void 0 ? void 0 : entity_id.trim());
    const entityValue = isConfigured ? formatEntityValue(entity === null || entity === void 0 ? void 0 : entity.state, entity === null || entity === void 0 ? void 0 : entity.attributes) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex h-full w-full min-h-0 overflow-hidden rounded-2xl", embedded ? "bg-transparent" : "bg-white/10 dark:bg-black/50 shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", !embedded && !isConfigured && "border-2 border-dashed border-gray-300 dark:border-white/20", className),
        style: height != null ? {
            minHeight: height
        } : undefined,
        children: [
            background_image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30",
                style: {
                    backgroundImage: "url(".concat(background_image, ")")
                },
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-0 bottom-0 w-[100px] h-[100px] translate-x-[-20%] translate-y-[20%] flex items-center justify-center rounded-full text-white shadow-lg",
                style: {
                    backgroundColor: icon_background_color || DEFAULT_ICON_BG
                },
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                    className: "h-10 w-10",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex min-w-0 flex-1 flex-col",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1 flex-col items-end justify-between min-w-0 px-4 pt-3 pb-3 text-right pl-6 min-h-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 w-full justify-end min-w-0 shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 flex-1 flex flex-col items-end",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-base font-medium truncate w-full", embedded ? "text-gray-900 dark:text-white/90" : "text-gray-900 dark:text-white"),
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-xs truncate w-full mt-0.5", embedded ? "text-gray-600 dark:text-white/70" : "text-gray-500 dark:text-gray-400"),
                                            children: isConfigured ? entityValue : !light_entity_id ? "Kies entiteiten in bewerken" : null
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                            lineNumber: 115,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this),
                                onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        onMoreClick();
                                    },
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1.5 rounded-lg shrink-0 transition-colors", embedded ? "text-gray-500 hover:text-gray-800 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"),
                                    "aria-label": "Bewerken",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                        className: "h-5 w-5",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                        lineNumber: 132,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                    lineNumber: 123,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        light_entity_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: (e)=>{
                                e.stopPropagation();
                                toggleLight();
                            },
                            disabled: loading,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-auto flex shrink-0 items-center justify-center rounded-full h-9 w-9 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-70", embedded ? isLightOn ? "bg-[#FFD41D] text-white" : "bg-gray-300 text-gray-600 dark:bg-white/20 dark:text-white/60" : isLightOn ? "bg-[#FFD41D] text-white shadow-sm" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"),
                            "aria-label": isLightOn ? "Lamp uitzetten" : "Lamp aanzetten",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                className: "h-5 w-5 shrink-0",
                                strokeWidth: 1.5,
                                fill: isLightOn ? "currentColor" : "none",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                lineNumber: 153,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                            lineNumber: 137,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/room-card-widget.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(RoomCardWidget, "NJAGQSZwl4ECLi6dyuqaTfknLYU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
_c = RoomCardWidget;
var _c;
__turbopack_context__.k.register(_c, "RoomCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-room-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingRoomCard",
    ()=>FloatingRoomCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$room$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/room-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const STORAGE_KEY_PREFIX = "dashboard.floatingRoomCardPosition.";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
const DEFAULT_CARD_HEIGHT = 120;
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 300;
function loadPosition(widgetId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
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
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
const BOTTOM_MARGIN = 24;
function defaultPosition(_widgetIndex, cardWidth, cardHeight) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const maxLeft = window.innerWidth - cardWidth;
    const maxBottom = window.innerHeight - cardHeight - BOTTOM_MARGIN;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
function clampWidth(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}
function clampHeight(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_HEIGHT;
    return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(n)));
}
const LONG_PRESS_MS = 500;
const DRAG_THRESHOLD_PX = 6;
function FloatingRoomCard(param) {
    let { widget, widgetIndex = 0, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    _s();
    const totalWidth = clampWidth(widget.width);
    const totalHeight = clampHeight(widget.height);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingRoomCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition(widget.id)) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                bottom: DEFAULT_OFFSET
            };
        }
    }["FloatingRoomCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const isPointerDownOnCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingRoomCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingRoomCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingRoomCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingRoomCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingRoomCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingRoomCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingRoomCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingRoomCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingRoomCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - totalHeight - BOTTOM_MARGIN : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition(widget.id);
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(widgetIndex, totalWidth, totalHeight), bounds);
            setPosition(p);
            savePosition(widget.id, p);
        }
    }["FloatingRoomCard.useEffect"], [
        widget.id,
        widgetIndex,
        totalWidth,
        totalHeight
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingRoomCard.useCallback[handlePointerDown]": (e)=>{
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            isPointerDownOnCard.current = true;
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
        }
    }["FloatingRoomCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
    const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - totalHeight - BOTTOM_MARGIN : "TURBOPACK unreachable";
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingRoomCard.useCallback[handlePointerMove]": (e)=>{
            if (!isPointerDownOnCard.current) return;
            if (!isDragging) {
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                if (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX) {
                    e.preventDefault();
                    setIsDragging(true);
                } else return;
            }
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            }));
        }
    }["FloatingRoomCard.useCallback[handlePointerMove]"], [
        isDragging,
        maxLeft,
        maxBottom,
        totalWidth
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingRoomCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            isPointerDownOnCard.current = false;
            if (isDragging) {
                e.preventDefault();
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const raw = {
                    left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                    maxLeft,
                    maxBottom
                });
                setPosition(next);
                savePosition(widget.id, next);
            }
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingRoomCard.useCallback[handlePointerUp]"], [
        isDragging,
        maxLeft,
        maxBottom,
        widget.id,
        totalWidth
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 shadow-xl rounded-2xl overflow-hidden backdrop-blur-2xl border flex transition-colors duration-200", "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            width: totalWidth,
            minHeight: totalHeight,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                isPointerDownOnCard.current = false;
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0 flex flex-col w-full", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$room$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoomCardWidget"], {
                title: widget.title,
                entity_id: widget.entity_id,
                icon: widget.icon,
                light_entity_id: widget.light_entity_id,
                background_image: widget.background_image,
                icon_background_color: widget.icon_background_color,
                height: totalHeight,
                embedded: true,
                onMoreClick: editMode ? onEdit : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-room-card.tsx",
                lineNumber: 244,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-room-card.tsx",
            lineNumber: 243,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-room-card.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
_s(FloatingRoomCard, "Rm6QuB54XvomQQ5FzL+GSG7OQAU=");
_c = FloatingRoomCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingRoomCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/nuts-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NutsCardWidget",
    ()=>NutsCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function useEntityValue(entityId) {
    var _entity_attributes;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "useEntityValue.useEntityStateStore[entity]": (s)=>s.getState(entityId)
    }["useEntityValue.useEntityStateStore[entity]"]);
    if (!entity) return {
        value: undefined,
        unit: ""
    };
    const raw = entity.state;
    const value = raw != null && raw !== "unavailable" && raw !== "unknown" ? Number(raw) : undefined;
    var _ref;
    const unit = (_ref = (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.unit_of_measurement) !== null && _ref !== void 0 ? _ref : "";
    return {
        value,
        unit
    };
}
_s(useEntityValue, "0Dpq8XOPxr5+xoZU8oNJeWvn+/k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
function formatValue(value, unit) {
    if (value == null || Number.isNaN(value)) return "—";
    const rounded = Math.round(value * 100) / 100;
    return unit ? "".concat(rounded, " ").concat(unit) : String(rounded);
}
const DEFAULT_ICON_COLOR = "#3B82F6";
function NutsCardWidget(param) {
    let { title = "Gas", entity_id, current_entity_id, icon = "Fuel", icon_background_color, max_value = 10, className, onMoreClick } = param;
    _s1();
    const dailyData = useEntityValue(entity_id);
    const currentData = useEntityValue(current_entity_id !== null && current_entity_id !== void 0 ? current_entity_id : "");
    var _currentData_value;
    const currentVal = (_currentData_value = currentData.value) !== null && _currentData_value !== void 0 ? _currentData_value : 0;
    var _dailyData_value;
    const dailyVal = (_dailyData_value = dailyData.value) !== null && _dailyData_value !== void 0 ? _dailyData_value : 0;
    const unit = dailyData.unit || currentData.unit || "";
    const barPercent = max_value > 0 ? Math.min(100, currentVal / max_value * 100) : 0;
    var _CARD_ICONS_icon;
    const IconComponent = (_CARD_ICONS_icon = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][icon]) !== null && _CARD_ICONS_icon !== void 0 ? _CARD_ICONS_icon : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"].Fuel;
    const iconBg = icon_background_color && /^#[0-9A-Fa-f]{6}$/.test(icon_background_color) ? icon_background_color : DEFAULT_ICON_COLOR;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-1 min-h-0 overflow-hidden rounded-2xl min-h-[130px]", "bg-white/10 dark:bg-black/50 text-gray-900 dark:text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 min-w-0 flex-col p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-start gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-xl",
                                        style: {
                                            backgroundColor: "".concat(iconBg, "20"),
                                            color: iconBg
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                            className: "h-5 w-5",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                                            lineNumber: 66,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                                        lineNumber: 62,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold text-gray-900 dark:text-white truncate max-w-full",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onMoreClick();
                                },
                                className: "p-1.5 rounded-lg shrink-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors",
                                "aria-label": "Opties",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                                    lineNumber: 80,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 dark:text-white/70 tabular-nums mt-1",
                        children: [
                            formatValue(currentVal, unit),
                            " • ",
                            formatValue(dailyVal, unit)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative shrink-0 self-center w-5 h-[110px] my-3 mx-2 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-0 left-0 right-0 rounded-full transition-all duration-300",
                    style: {
                        height: "".concat(barPercent, "%"),
                        minHeight: barPercent > 0 ? 4 : 0,
                        backgroundColor: iconBg
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/nuts-card-widget.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s1(NutsCardWidget, "kSsQSulJ+W51Y/00uN/YyxUv5bE=", false, function() {
    return [
        useEntityValue,
        useEntityValue
    ];
});
_c = NutsCardWidget;
var _c;
__turbopack_context__.k.register(_c, "NutsCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-nuts-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingNutsCard",
    ()=>FloatingNutsCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$nuts$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/nuts-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const STORAGE_KEY_PREFIX = "dashboard.floatingNutsCardPosition.";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 250;
const MIN_WIDTH = 150;
const MAX_WIDTH = 400;
const DEFAULT_CARD_HEIGHT = 130;
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 300;
function clampWidth(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}
function clampHeight(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_HEIGHT;
    return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(n)));
}
function loadPosition(widgetId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
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
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition(cardWidth, cardHeight) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const maxLeft = window.innerWidth - cardWidth;
    const maxBottom = window.innerHeight - cardHeight - 24;
    return {
        left: maxLeft / 2,
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingNutsCard(param) {
    let { widget, widgetIndex = 0, editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    _s();
    const totalWidth = clampWidth(widget.width);
    const totalHeight = clampHeight(widget.height);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingNutsCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition(widget.id)) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                bottom: DEFAULT_OFFSET
            };
        }
    }["FloatingNutsCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingNutsCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingNutsCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingNutsCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingNutsCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingNutsCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingNutsCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingNutsCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingNutsCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingNutsCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - totalHeight - 24 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition(widget.id);
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(totalWidth, totalHeight), bounds);
            setPosition(p);
            savePosition(widget.id, p);
        }
    }["FloatingNutsCard.useEffect"], [
        widget.id,
        totalWidth,
        totalHeight
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingNutsCard.useCallback[handlePointerDown]": (e)=>{
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
        }
    }["FloatingNutsCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingNutsCard.useCallback[handlePointerMove]": (e)=>{
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - totalHeight - 24 : "TURBOPACK unreachable";
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            }));
        }
    }["FloatingNutsCard.useCallback[handlePointerMove]"], [
        isDragging,
        totalWidth,
        totalHeight
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingNutsCard.useCallback[handlePointerUp]": (e)=>{
            var _releasePointerCapture, _this;
            if (isDragging) {
                setIsDragging(false);
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - totalWidth : "TURBOPACK unreachable";
                const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - totalHeight - 24 : "TURBOPACK unreachable";
                const raw = {
                    left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                    bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
                };
                const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                    maxLeft,
                    maxBottom
                });
                setPosition(next);
                savePosition(widget.id, next);
            }
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingNutsCard.useCallback[handlePointerUp]"], [
        isDragging,
        widget.id,
        totalWidth,
        totalHeight
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            width: totalWidth,
            height: totalHeight,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col h-full min-h-0", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$nuts$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NutsCardWidget"], {
                title: widget.title,
                entity_id: widget.entity_id,
                current_entity_id: widget.current_entity_id,
                icon: widget.icon,
                icon_background_color: widget.icon_background_color,
                max_value: widget.max_value,
                onMoreClick: editMode ? onEdit : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-nuts-card.tsx",
                lineNumber: 228,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-nuts-card.tsx",
            lineNumber: 227,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-nuts-card.tsx",
        lineNumber: 197,
        columnNumber: 5
    }, this);
}
_s(FloatingNutsCard, "4Q/dqIKGGEvPJ/UgUv3i1rWJGxM=");
_c = FloatingNutsCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingNutsCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/stat-pill-card-widget.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatPillCardWidget",
    ()=>StatPillCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
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
    purple: "border-purple-400/50 dark:border-purple-400/40 bg-purple-500/25 dark:bg-purple-900/30",
    slate: "border-slate-400/50 dark:border-slate-400/40 bg-slate-500/25 dark:bg-slate-900/30"
};
const ICON_COLORS = {
    red: "text-red-300",
    amber: "text-amber-400",
    green: "text-green-300",
    emerald: "text-emerald-300",
    blue: "text-blue-300",
    violet: "text-violet-300",
    purple: "text-purple-300",
    slate: "text-slate-300"
};
function matchCondition(state, conditions) {
    if (state == null || state === "unavailable" || state === "unknown" || !(conditions === null || conditions === void 0 ? void 0 : conditions.length)) return null;
    const numState = Number(state);
    const isNumeric = !Number.isNaN(numState);
    for (const c of conditions){
        const condValue = c.value.trim();
        if (!condValue) continue;
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
function useEntityValue(entityId) {
    var _entity_attributes;
    _s();
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "useEntityValue.useEntityStateStore[entity]": (s)=>s.getState(entityId)
    }["useEntityValue.useEntityStateStore[entity]"]);
    const raw = entity === null || entity === void 0 ? void 0 : entity.state;
    var _ref;
    const unit = (_ref = entity === null || entity === void 0 ? void 0 : (_entity_attributes = entity.attributes) === null || _entity_attributes === void 0 ? void 0 : _entity_attributes.unit_of_measurement) !== null && _ref !== void 0 ? _ref : "";
    if (raw == null || raw === "unavailable" || raw === "unknown") {
        return {
            display: "—"
        };
    }
    const num = Number(raw);
    if (!Number.isNaN(num)) {
        const rounded = Math.round(num * 10) / 10;
        return {
            display: unit ? "".concat(rounded, " ").concat(unit) : String(rounded)
        };
    }
    const str = String(raw);
    return {
        display: str.charAt(0).toUpperCase() + str.slice(1)
    };
}
_s(useEntityValue, "0Dpq8XOPxr5+xoZU8oNJeWvn+/k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"]
    ];
});
const PILL_CLASSES = {
    amber: "border-amber-400/50 dark:border-amber-400/40 bg-amber-500/25 dark:bg-amber-900/30",
    purple: "border-purple-400/50 dark:border-purple-400/40 bg-purple-500/25 dark:bg-purple-900/30",
    emerald: "border-emerald-400/50 dark:border-emerald-400/40 bg-emerald-500/25 dark:bg-emerald-900/30",
    red: "border-red-400/50 dark:border-red-400/40 bg-red-500/25 dark:bg-red-900/30"
};
const ICON_CLASSES = {
    amber: "text-amber-400",
    purple: "text-purple-300",
    emerald: "text-emerald-300",
    red: "text-red-300"
};
function StatPillCardWidget(param) {
    let { title = "Stat", entity_id, label, icon: iconName, color = "amber", size = "md", className, onMoreClick } = param;
    _s1();
    const { display } = useEntityValue(entity_id);
    const IconComponent = iconName && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICONS"].Sun;
    const iconClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-3.5 w-3.5 shrink-0", ICON_CLASSES[color]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex items-center justify-center p-4", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center gap-2 rounded-full border backdrop-blur-xl shadow-lg px-3 py-1.5 text-white", PILL_CLASSES[color]),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                        className: iconClassName,
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/stat-pill-card-widget.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-start gap-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-bold tabular-nums leading-none text-white",
                                children: display
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/stat-pill-card-widget.tsx",
                                lineNumber: 141,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[9px] font-medium leading-none text-white/80",
                                children: label !== null && label !== void 0 ? label : title
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/stat-pill-card-widget.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/stat-pill-card-widget.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/stat-pill-card-widget.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: (e)=>{
                    e.stopPropagation();
                    onMoreClick();
                },
                className: "absolute right-2 bottom-2 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/10 transition-colors",
                "aria-label": "Opties",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                    className: "h-4 w-4",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/stat-pill-card-widget.tsx",
                    lineNumber: 159,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/stat-pill-card-widget.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/stat-pill-card-widget.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_s1(StatPillCardWidget, "nHAAe10dCn9J0HNlwPejm/F3Cgk=", false, function() {
    return [
        useEntityValue
    ];
});
_c = StatPillCardWidget;
var _c;
__turbopack_context__.k.register(_c, "StatPillCardWidget");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/widgets/floating-stat-pill-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingStatPillCard",
    ()=>FloatingStatPillCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$stat$2d$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/stat-pill-card-widget.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const STORAGE_KEY_PREFIX = "dashboard.floatingStatPillCardPosition.";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 260;
function loadPosition(widgetId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const s = localStorage.getItem(STORAGE_KEY_PREFIX + widgetId);
        if (!s) return null;
        const p = JSON.parse(s);
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.bottom) === "number") return {
            left: p.left,
            bottom: p.bottom
        };
        if (typeof (p === null || p === void 0 ? void 0 : p.left) === "number" && typeof (p === null || p === void 0 ? void 0 : p.top) === "number") {
            return {
                left: p.left,
                bottom: window.innerHeight - p.top - 120
            };
        }
    } catch (e) {
    // ignore
    }
    return null;
}
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + widgetId, JSON.stringify(p));
    } catch (e) {
    // ignore
    }
}
function defaultPosition(widgetIndex) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const maxLeft = window.innerWidth - CARD_WIDTH;
    const maxBottom = window.innerHeight - 120;
    const offset = widgetIndex * (CARD_WIDTH + 16);
    return {
        left: Math.min(offset, maxLeft / 2),
        bottom: maxBottom / 2
    };
}
const LONG_PRESS_MS = 500;
function FloatingStatPillCard(param) {
    let { widgetId, widgetIndex = 0, title, entity_id, label, icon, color = "amber", size = "md", editMode = false, onRemove, onEdit, onEnterEditMode } = param;
    _s();
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "FloatingStatPillCard.useState": ()=>{
            var _loadPosition;
            return (_loadPosition = loadPosition(widgetId)) !== null && _loadPosition !== void 0 ? _loadPosition : {
                left: 0,
                bottom: 0
            };
        }
    }["FloatingStatPillCard.useState"]);
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingStatPillCard.useCallback[clearLongPress]": ()=>{
            if (longPressTimerRef.current != null) {
                clearTimeout(longPressTimerRef.current);
                longPressTimerRef.current = null;
            }
        }
    }["FloatingStatPillCard.useCallback[clearLongPress]"], []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingStatPillCard.useCallback[startLongPress]": (e)=>{
            var _setPointerCapture, _this;
            if (editMode || !onEnterEditMode) return;
            clearLongPress();
            (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
            longPressTimerRef.current = setTimeout({
                "FloatingStatPillCard.useCallback[startLongPress]": ()=>{
                    longPressTimerRef.current = null;
                    onEnterEditMode();
                }
            }["FloatingStatPillCard.useCallback[startLongPress]"], LONG_PRESS_MS);
        }
    }["FloatingStatPillCard.useCallback[startLongPress]"], [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingStatPillCard.useCallback[endLongPress]": (e)=>{
            var _releasePointerCapture, _this;
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
            clearLongPress();
        }
    }["FloatingStatPillCard.useCallback[endLongPress]"], [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FloatingStatPillCard.useEffect": ()=>{
            if (initialized.current) return;
            initialized.current = true;
            const maxLeft = ("TURBOPACK compile-time truthy", 1) ? window.innerWidth - CARD_WIDTH : "TURBOPACK unreachable";
            const maxBottom = ("TURBOPACK compile-time truthy", 1) ? window.innerHeight - 120 : "TURBOPACK unreachable";
            const bounds = {
                maxLeft,
                maxBottom
            };
            const saved = loadPosition(widgetId);
            if (saved) {
                setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
                return;
            }
            const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(widgetIndex), bounds);
            setPosition(p);
            savePosition(widgetId, p);
        }
    }["FloatingStatPillCard.useEffect"], [
        widgetId,
        widgetIndex
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingStatPillCard.useCallback[handlePointerDown]": (e)=>{
            var _closest, _this, _setPointerCapture, _this1;
            if (!editMode) return;
            if ((_closest = (_this = e.target).closest) === null || _closest === void 0 ? void 0 : _closest.call(_this, "button")) return;
            e.preventDefault();
            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                left: position.left,
                bottom: position.bottom
            };
            (_setPointerCapture = (_this1 = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this1, e.pointerId);
        }
    }["FloatingStatPillCard.useCallback[handlePointerDown]"], [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingStatPillCard.useCallback[handlePointerMove]": (e)=>{
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
    }["FloatingStatPillCard.useCallback[handlePointerMove]"], [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FloatingStatPillCard.useCallback[handlePointerUp]": (e)=>{
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
                savePosition(widgetId, next);
            }
            (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        }
    }["FloatingStatPillCard.useCallback[handlePointerUp]"], [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-[260px] overflow-visible bg-transparent", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
        style: {
            left: position.left,
            bottom: position.bottom,
            ...!editMode && onEnterEditMode ? {
                touchAction: "none"
            } : {}
        },
        ...!editMode && onEnterEditMode && {
            onPointerDown: startLongPress,
            onPointerUp: endLongPress,
            onPointerLeave: endLongPress,
            onPointerCancel: endLongPress
        },
        ...editMode && {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerLeave: (e)=>{
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$stat$2d$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatPillCardWidget"], {
                title: title,
                entity_id: entity_id,
                label: label,
                icon: icon,
                color: color,
                size: size,
                onMoreClick: editMode ? onEdit : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-stat-pill-card.tsx",
                lineNumber: 211,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-stat-pill-card.tsx",
            lineNumber: 210,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-stat-pill-card.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
_s(FloatingStatPillCard, "TPJJuA9tctagjbQe4YGPkxXN+Tw=");
_c = FloatingStatPillCard;
var _c;
__turbopack_context__.k.register(_c, "FloatingStatPillCard");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/light-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$light$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-light-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-2-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$solar$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-solar-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$monitor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/energy-monitor-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$energy$2d$monitor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-energy-monitor-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/weather-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$weather$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-weather-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/vacuum-card-widget.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$vacuum$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-vacuum-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/sensor-card-widget.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$sensor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-sensor-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/pill-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$pill$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-pill-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$card$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-card-group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-climate-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$title$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/title-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$title$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-title-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$room$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/room-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$room$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-room-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$nuts$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/nuts-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$nuts$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-nuts-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$stat$2d$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/stat-pill-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$stat$2d$pill$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-stat-pill-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
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
"[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript) <export CARD_ICON_OPTIONS as VACUUM_ICON_OPTIONS>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VACUUM_ICON_OPTIONS",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICON_OPTIONS"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
}),
"[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript) <export CARD_ICON_OPTIONS as SENSOR_ICON_OPTIONS>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SENSOR_ICON_OPTIONS",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICON_OPTIONS"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
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
]);

//# sourceMappingURL=src_components_31ff7152._.js.map