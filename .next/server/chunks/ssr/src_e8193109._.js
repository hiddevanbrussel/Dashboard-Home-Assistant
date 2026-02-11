module.exports = [
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "capitalizeFirst",
    ()=>capitalizeFirst,
    "cn",
    ()=>cn,
    "generateId",
    ()=>generateId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
function capitalizeFirst(s) {
    if (s == null || s === "") return s ?? "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
function generateId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        crypto.getRandomValues(bytes);
    } else {
        for(let i = 0; i < 16; i++)bytes[i] = Math.floor(Math.random() * 256);
    }
    bytes[6] = bytes[6] & 0x0f | 0x40;
    bytes[8] = bytes[8] & 0x3f | 0x80;
    const hex = [
        ...bytes
    ].map((b)=>b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
}),
"[project]/src/components/layout/top-tabs.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TopTabs",
    ()=>TopTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/music-2.js [app-ssr] (ecmascript) <export default as Music2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-ssr] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const tabs = [
    {
        href: "/dashboards",
        label: "Dashboard",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        href: "/energy",
        label: "Energy",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
    },
    {
        href: "/music",
        label: "Music",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"]
    },
    {
        href: "/devices",
        label: "Devices",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"]
    }
];
function TopTabs({ activeHref, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-1 rounded-full bg-black/5 px-1 py-1 dark:bg-white/5", className),
        role: "tablist",
        children: tabs.map(({ href, label, icon: Icon, badge })=>{
            const isActive = activeHref === href;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                role: "tab",
                "aria-selected": isActive,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150", isActive ? "bg-white text-gray-900 shadow-sm dark:bg-white/95 dark:text-gray-900" : "text-gray-600 hover:bg-white/50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        className: "h-4 w-4",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/top-tabs.tsx",
                        lineNumber: 48,
                        columnNumber: 13
                    }, this),
                    label,
                    badge != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/src/components/layout/sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const mainIcons = [
    {
        href: "/dashboards",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
        label: "Home"
    },
    {
        href: "/settings",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
        label: "Settings"
    }
];
function Sidebar({ activeHref, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-14 flex-col items-center gap-2 rounded-full bg-gray-900/90 py-3 dark:bg-black/40", className),
        "aria-label": "Sidebar",
        children: mainIcons.map(({ href, icon: Icon, label })=>{
            const isActive = activeHref === href;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: href,
                "aria-label": label,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150", isActive ? "bg-white text-gray-900" : "text-white/80 hover:bg-white/15 hover:text-white"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
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
}),
"[project]/src/components/layout/floating-toolbar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingToolbar",
    ()=>FloatingToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-ssr] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.js [app-ssr] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
"use client";
;
;
;
function FloatingToolbar({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-gray-900/90 px-3 py-2 shadow-lg dark:bg-black/50", className),
        role: "toolbar",
        "aria-label": "Floating toolbar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Zoom in",
                className: "flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Zoom out",
                className: "flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Search",
                className: "flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Close",
                className: "flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/15 hover:text-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
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
}),
"[project]/src/components/theme-switcher.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeSwitcher",
    ()=>ThemeSwitcher
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
"use client";
;
;
;
;
function ThemeSwitcher({ className }) {
    const { mode, setMode, resolved } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThemeStore"])();
    const effective = mode === "auto" ? resolved : mode;
    function handleToggle() {
        setMode(effective === "light" ? "dark" : "light");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: handleToggle,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center rounded-full bg-gray-100 p-0.5 dark:bg-white/10 transition-colors", className),
        "aria-label": effective === "light" ? "Switch to dark mode" : "Switch to light mode",
        title: effective === "light" ? "Dark mode" : "Light mode",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-8 w-8 items-center justify-center rounded-full transition-colors", effective === "light" ? "bg-white text-amber-600 shadow-sm dark:bg-white/20 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-8 w-8 items-center justify-center rounded-full transition-colors", effective === "dark" ? "bg-white text-indigo-500 shadow-sm dark:bg-white/20 dark:text-indigo-300" : "text-gray-500 dark:text-gray-400"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
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
"[project]/src/components/layout/header-notifications.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeaderNotifications",
    ()=>HeaderNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function getNotificationId(entityId) {
    return entityId.replace(/^persistent_notification\./, "");
}
function HeaderNotifications() {
    const states = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.states);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dismissingId, setDismissingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const panelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const notifications = Object.values(states).filter((e)=>e.entity_id.startsWith("persistent_notification."));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        (async ()=>{
            try {
                const res = await fetch("/api/ha/state");
                if (!res.ok || cancelled) return;
                const data = await res.json();
                if (Array.isArray(data)) setStates(data);
            } catch  {
            // ignore
            }
        })();
        const t = setInterval(async ()=>{
            if (cancelled) return;
            try {
                const res = await fetch("/api/ha/state");
                if (!res.ok || cancelled) return;
                const data = await res.json();
                if (Array.isArray(data)) setStates(data);
            } catch  {
            // ignore
            }
        }, 60000);
        return ()=>{
            cancelled = true;
            clearInterval(t);
        };
    }, [
        setStates
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        function handleClickOutside(e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, [
        open
    ]);
    async function dismiss(notificationId) {
        setDismissingId(notificationId);
        try {
            const res = await fetch("/api/ha/call-service", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    entity_id: `persistent_notification.${notificationId}`,
                    domain: "persistent_notification",
                    service: "dismiss",
                    service_data: {
                        notification_id: notificationId
                    }
                })
            });
            if (res.ok) {
                const data = await fetch("/api/ha/state").then((r)=>r.json());
                if (Array.isArray(data)) setStates(data);
            }
        } finally{
            setDismissingId(null);
        }
    }
    const count = notifications.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex items-center",
        ref: panelRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen((v)=>!v),
                className: "relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D2FB2]",
                "aria-label": count > 0 ? `${count} meldingen` : "Meldingen",
                "aria-expanded": open,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                        className: "h-5 w-5",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/header-notifications.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white",
                        "aria-hidden": true,
                        children: count > 99 ? "99+" : count
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/header-notifications.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/header-notifications.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 top-full z-[100] mt-1 w-[320px] max-h-[70vh] flex flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-black/50 dark:backdrop-blur-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-2 border-b border-gray-100 dark:border-white/10 px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-gray-900 dark:text-white",
                                children: "Meldingen"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/header-notifications.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, this),
                            count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: async ()=>{
                                    try {
                                        await fetch("/api/ha/call-service", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                entity_id: "persistent_notification.dismiss_all",
                                                domain: "persistent_notification",
                                                service: "dismiss_all",
                                                service_data: {}
                                            })
                                        });
                                        const data = await fetch("/api/ha/state").then((r)=>r.json());
                                        if (Array.isArray(data)) setStates(data);
                                    } catch  {
                                    // ignore
                                    }
                                },
                                className: "text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                                children: "Alles wissen"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/header-notifications.tsx",
                                lineNumber: 120,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/header-notifications.tsx",
                        lineNumber: 115,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-auto flex-1 min-h-0",
                        children: notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center",
                            children: "Geen meldingen"
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/header-notifications.tsx",
                            lineNumber: 148,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "py-1",
                            children: notifications.map((n)=>{
                                const id = getNotificationId(n.entity_id);
                                const title = n.attributes?.title || "Melding";
                                const message = n.attributes?.message || "";
                                const isDismissing = dismissingId === id;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    className: "border-b border-gray-100 last:border-0 dark:border-white/5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-3 flex flex-col gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-gray-900 dark:text-white text-sm truncate flex-1 min-w-0",
                                                        children: title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/header-notifications.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>dismiss(id),
                                                        disabled: isDismissing,
                                                        className: "shrink-0 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-50",
                                                        "aria-label": "Melding sluiten",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/layout/header-notifications.tsx",
                                                            lineNumber: 175,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/layout/header-notifications.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/layout/header-notifications.tsx",
                                                lineNumber: 164,
                                                columnNumber: 27
                                            }, this),
                                            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words",
                                                children: message
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/layout/header-notifications.tsx",
                                                lineNumber: 179,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/layout/header-notifications.tsx",
                                        lineNumber: 163,
                                        columnNumber: 25
                                    }, this)
                                }, n.entity_id, false, {
                                    fileName: "[project]/src/components/layout/header-notifications.tsx",
                                    lineNumber: 159,
                                    columnNumber: 23
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/header-notifications.tsx",
                            lineNumber: 152,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/header-notifications.tsx",
                        lineNumber: 146,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/header-notifications.tsx",
                lineNumber: 114,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/header-notifications.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/layout/app-shell.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-ssr] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-fog.js [app-ssr] (ecmascript) <export default as CloudFog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-lightning.js [app-ssr] (ecmascript) <export default as CloudLightning>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-rain.js [app-ssr] (ecmascript) <export default as CloudRain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-snow.js [app-ssr] (ecmascript) <export default as CloudSnow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-ssr] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$top$2d$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/top-tabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/sidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$floating$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/floating-toolbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/theme-switcher.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$page$2d$background$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/page-background.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$header$2d$notifications$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/header-notifications.tsx [app-ssr] (ecmascript)");
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
    } catch  {
    // ignore
    }
}
const HEADER_TEMPERATURE_STORAGE_KEY = "dashboard.headerTemperatureEntityId";
const DEFAULT_TEMPERATURE_ENTITY = "sensor.weather_temperature";
function WeatherIcon({ state }) {
    const s = state?.toLowerCase() ?? "";
    const iconClass = "h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400";
    if (s === "sunny" || s === "clear") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 70,
        columnNumber: 46
    }, this);
    if (s === "clear-night") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 71,
        columnNumber: 35
    }, this);
    if (s === "fog" || s === "mist") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__["CloudFog"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 72,
        columnNumber: 43
    }, this);
    if (s === "rainy" || s === "pouring" || s === "hail") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__["CloudRain"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 73,
        columnNumber: 64
    }, this);
    if (s === "snowy" || s === "snowy-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__["CloudSnow"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 74,
        columnNumber: 52
    }, this);
    if (s === "lightning" || s === "lightning-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__["CloudLightning"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 75,
        columnNumber: 60
    }, this);
    if (s === "windy" || s === "windy-variant") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 76,
        columnNumber: 54
    }, this);
    if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 77,
        columnNumber: 77
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 78,
        columnNumber: 10
    }, this);
}
function TemperatureEntityModal({ onClose, onSelect }) {
    const [entities, setEntities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch("/api/ha/entities").then((r)=>{
            if (!r.ok) throw new Error("Failed to load");
            return r.json();
        }).then((data)=>{
            const weather = data.filter((e)=>e.entity_id.startsWith("weather."));
            setEntities(weather);
            setError(null);
        }).catch(()=>setError("Could not load weather entities.")).finally(()=>setLoading(false));
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-[101] bg-black/20 dark:bg-black/30 backdrop-blur-md",
                "aria-hidden": true,
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-[102] w-full max-w-sm rounded-2xl border-0 bg-white p-5 shadow-xl dark:bg-black/50 dark:backdrop-blur-xl dark:border dark:border-white/10",
                onClick: (e)=>e.stopPropagation(),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-900 dark:text-white",
                                children: "Choose weather for temperature"
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onClose,
                                className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700",
                                "aria-label": "Close",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 dark:text-gray-400",
                        children: "Loading…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-red-600 dark:text-red-400",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this) : entities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500 dark:text-gray-400",
                        children: "No weather entities found. Check your Home Assistant connection."
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "max-h-64 overflow-auto space-y-1",
                        children: entities.map((e)=>{
                            const name = e.attributes?.friendly_name ?? e.entity_id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    lineNumber: 146,
                                    columnNumber: 19
                                }, this)
                            }, e.entity_id, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 145,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 140,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
function useTime24() {
    const [time, setTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        return ()=>clearInterval(id);
    }, []);
    return time;
}
function AppShell({ children, activeTab = "/dashboards", showSidebar = true, showFloatingToolbar = false, welcomeBarAction, headerEndAction, welcomeTitle: welcomeTitleProp, welcomeSubtitle: welcomeSubtitleProp, welcomeEditable = false, onWelcomeChange, temperatureEntityId, contentNoScroll = false, className }) {
    const defaultWelcomeTitle = "Hey, Fam van Brussel!";
    const defaultWelcomeSubtitle = "Control your home in one place!";
    const welcomeTitle = welcomeTitleProp ?? defaultWelcomeTitle;
    const welcomeSubtitle = welcomeSubtitleProp ?? defaultWelcomeSubtitle;
    const pageBackground = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$page$2d$background$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageBackground"])();
    const time24 = useTime24();
    const [temperatureModalOpen, setTemperatureModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [chosenTemperatureEntityId, setChosenTemperatureEntityId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, []);
    const effectiveTempEntity = temperatureEntityId === null ? undefined : temperatureEntityId ?? chosenTemperatureEntityId ?? DEFAULT_TEMPERATURE_ENTITY;
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const temperatureState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>effectiveTempEntity ? s.getState(effectiveTempEntity) : undefined);
    const temperatureRaw = temperatureState?.attributes?.temperature ?? (temperatureState?.state != null ? Number(temperatureState.state) : undefined);
    const temperatureDisplay = temperatureRaw != null && !Number.isNaN(temperatureRaw) ? `${Math.round(temperatureRaw)}°` : null;
    const saveChosenTemperatureEntity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((entityId)=>{
        setChosenTemperatureEntityId(entityId);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        setTemperatureModalOpen(false);
        fetchAndMergeEntityState(setStates);
    }, [
        setStates
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex min-h-screen flex-col", pageBackground ? "bg-white/85 dark:bg-black/50" : "bg-page-light dark:bg-dark-page", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex shrink-0 items-center border-b border-gray-200/50 px-4 py-3 dark:border-white/10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0 flex items-center gap-4",
                        children: [
                            showSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setSidebarOpen((v)=>!v),
                                className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors",
                                "aria-label": sidebarOpen ? "Menu sluiten" : "Menu openen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                    className: "h-5 w-5",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 251,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300",
                                "aria-live": "polite",
                                children: time24
                            }, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this),
                            effectiveTempEntity != null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setTemperatureModalOpen(true),
                                className: "flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 transition-colors",
                                "aria-label": "Choose temperature entity",
                                children: [
                                    effectiveTempEntity?.startsWith("weather.") && temperatureState?.state ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WeatherIcon, {
                                        state: temperatureState.state
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/app-shell.tsx",
                                        lineNumber: 271,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
                                        className: "h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/layout/app-shell.tsx",
                                        lineNumber: 273,
                                        columnNumber: 17
                                    }, this),
                                    temperatureDisplay ?? "—"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 264,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center px-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$top$2d$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TopTabs"], {
                            activeHref: activeTab
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/app-shell.tsx",
                            lineNumber: 280,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex items-center justify-end gap-2 min-w-0",
                        children: [
                            headerEndAction,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$header$2d$notifications$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HeaderNotifications"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 284,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$theme$2d$switcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeSwitcher"], {}, void 0, false, {
                                fileName: "[project]/src/components/layout/app-shell.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            temperatureModalOpen && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TemperatureEntityModal, {
                onClose: ()=>setTemperatureModalOpen(false),
                onSelect: saveChosenTemperatureEntity
            }, void 0, false, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 292,
                columnNumber: 11
            }, this), document.body),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 flex items-center justify-between gap-4 pl-10 pr-4 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: welcomeEditable && onWelcomeChange ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2 max-w-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                    lineNumber: 303,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                    lineNumber: 315,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/layout/app-shell.tsx",
                            lineNumber: 302,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight",
                                    children: welcomeTitle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 330,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base md:text-lg font-normal text-gray-600 dark:text-gray-300 mt-1.5",
                                    children: welcomeSubtitle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/layout/app-shell.tsx",
                                    lineNumber: 333,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this),
                    welcomeBarAction != null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 shrink-0",
                        children: welcomeBarAction
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 340,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 299,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 overflow-hidden relative",
                children: [
                    showSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed left-0 top-[8rem] bottom-0 z-10 w-[88px] pl-8 flex flex-col items-center justify-center transition-[transform,opacity] duration-200 ease-out", sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sidebar"], {
                            activeHref: activeTab
                        }, void 0, false, {
                            fileName: "[project]/src/components/layout/app-shell.tsx",
                            lineNumber: 354,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 348,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 p-4 min-w-0 transition-[margin] duration-200", contentNoScroll ? "overflow-hidden" : "overflow-auto", showSidebar && sidebarOpen && "ml-[88px]"),
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/src/components/layout/app-shell.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this),
            showFloatingToolbar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$floating$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FloatingToolbar"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/app-shell.tsx",
                lineNumber: 368,
                columnNumber: 31
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/app-shell.tsx",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/layout/glass-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GlassCard",
    ()=>GlassCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
function GlassCard({ children, className, as: Component = "div" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("glass-card rounded-card border border-white/60 p-4 dark:border-white/10", "transition-shadow duration-150 hover:shadow-lg dark:hover:shadow-glass-dark", className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/layout/glass-card.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/widgets/energy-usage-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnergyUsageWidget",
    ()=>EnergyUsageWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function EnergyUsageWidget({ title = "Energy Usage", value = 65, label = "Medium", size = "md", className }) {
    const pct = Math.min(100, Math.max(0, value ?? 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-card-title font-medium mb-2",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/energy-usage-widget.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-3 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-full rounded-full transition-all duration-300", "bg-gradient-to-r from-accent-yellow to-accent-green dark:from-accent-green dark:to-accent-yellow"),
                    style: {
                        width: `${pct}%`
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
}),
"[project]/src/components/widgets/light-control-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LightControlWidget",
    ()=>LightControlWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function LightControlWidget({ title = "Light", entity_id, state = "off", size = "md", className }) {
    const isOn = state === "on";
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sliderBrightness, setSliderBrightness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const entityState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entity_id));
    const brightnessRaw = entityState?.attributes?.brightness ?? 0;
    const brightnessPct = Math.round(brightnessRaw / 255 * 100);
    const displayBrightness = modalOpen ? sliderBrightness : brightnessPct;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setSliderBrightness(brightnessPct);
    }, [
        brightnessPct
    ]);
    const refreshState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const res = await fetch("/api/ha/state").then((r)=>r.json());
        if (Array.isArray(res)) setStates(res);
    }, [
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
    const brightnessTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "button",
                tabIndex: 0,
                onClick: handleCardClick,
                onKeyDown: (e)=>{
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCardClick();
                    }
                },
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-start gap-3 rounded-2xl text-left transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4D2FB2] cursor-pointer", isOn ? "bg-white shadow-sm dark:bg-white" : "bg-white/60 dark:bg-white/10 backdrop-blur-md", size === "sm" && "p-3", size === "md" && "p-4", size === "lg" && "p-5", className),
                "aria-label": `Open ${title} controls`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleIconClick,
                        disabled: loading,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4D2FB2] disabled:opacity-70", isOn ? "" : "bg-white/50 dark:bg-white/10 backdrop-blur-md", size === "sm" && "h-9 w-9", size === "md" && "h-10 w-10", size === "lg" && "h-11 w-11"),
                        style: isOn ? {
                            backgroundColor: "#FFD41D"
                        } : undefined,
                        "aria-label": isOn ? `Turn off ${title}` : `Turn on ${title}`,
                        "aria-pressed": isOn,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(iconSizes[size], "transition-colors duration-300 ease-out", isOn ? "text-white" : "text-[#FFD41D]"),
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("font-semibold truncate", isOn ? "text-gray-900" : "text-gray-900 dark:text-white", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg"),
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("font-medium", size === "sm" && "text-xs", size === "md" && "text-sm", size === "lg" && "text-base", isOn ? "text-gray-700" : "text-gray-500 dark:text-gray-400"),
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
            modalOpen && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-md transition-opacity duration-200 ease-out",
                        "aria-hidden": true,
                        onClick: ()=>setModalOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                        lineNumber: 171,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-50 w-full max-w-sm rounded-2xl border-0 bg-gray-800 p-6 shadow-xl dark:bg-gray-900 transition-transform duration-300 ease-out",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center mb-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-white truncate",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/light-control-widget.tsx",
                                        lineNumber: 178,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center gap-4 mt-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center gap-2 touch-none select-none",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-24 h-56 flex flex-col items-center",
                                        style: {
                                            touchAction: "none"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-0 left-1/2 -translate-x-1/2 w-16 h-52 rounded-full bg-gray-600 flex flex-col justify-end overflow-hidden pointer-events-none",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full rounded-full bg-white min-h-0 shrink-0 will-change-[height]",
                                                    style: {
                                                        height: `${displayBrightness}%`,
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: handleModalToggle,
                                                disabled: loading,
                                                className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full disabled:opacity-60 transition-opacity duration-300 ease-out",
                                                "aria-label": isOn ? "Turn off" : "Turn on",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
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
}),
"[project]/src/components/widgets/wifi-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WifiWidget",
    ()=>WifiWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wifi.js [app-ssr] (ecmascript) <export default as Wifi>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function WifiWidget({ title = "Wi-Fi", value = "on", size = "md", className }) {
    const on = value === "on";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4 flex items-center justify-between", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wifi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wifi$3e$__["Wifi"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-6 w-6 text-accent-orange", !on && "opacity-50 text-gray-400")
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/wifi-widget.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                role: "switch",
                "aria-checked": on,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors", on ? "bg-accent-green dark:bg-accent-green" : "bg-gray-300 dark:bg-white/20"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition", on ? "translate-x-5" : "translate-x-1")
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
}),
"[project]/src/components/widgets/solar-charge-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SolarChargeWidget",
    ()=>SolarChargeWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
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
function SolarChargeWidget({ title = "Solar Charge Collected Today", value = 12.4, unit = "kWh", data = DEFAULT_DATA, size = "md", className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-card-title font-medium mb-2",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-32 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                    width: "100%",
                    height: "100%",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LineChart"], {
                        data: data,
                        margin: {
                            top: 4,
                            right: 4,
                            bottom: 0,
                            left: 4
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                dataKey: "date",
                                tick: {
                                    fontSize: 10
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                hide: true
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                contentStyle: {
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.2)"
                                },
                                formatter: (v)=>[
                                        `${v} ${unit}`,
                                        "Value"
                                    ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-charge-widget.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Line"], {
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
}),
"[project]/src/components/widgets/climate-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClimateWidget",
    ()=>ClimateWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function ClimateWidget({ title = "Climate", value = 23, unit = "°", state: climateState = "heat", size = "md", className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-card-title font-medium",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-widget.tsx",
                        lineNumber: 25,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1 justify-center text-xs text-gray-500 dark:text-gray-400",
                children: [
                    "6h",
                    "12h",
                    "18h",
                    "24h"
                ].map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/src/components/widgets/lighting-brightness-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LightingBrightnessWidget",
    ()=>LightingBrightnessWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/glass-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function LightingBrightnessWidget({ title = "Lighting Brightness", value = 70, size = "md", className }) {
    const pct = Math.min(100, Math.max(0, value ?? 0));
    const rotation = -90 + pct / 100 * 180;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$glass$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GlassCard"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-4", size === "lg" && "p-5", size === "sm" && "p-3", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-card-title font-medium mb-4 text-center",
                children: title
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-32 h-24 mx-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: "0 0 100 60",
                        className: "w-full h-full",
                        "aria-hidden": true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M 10 50 A 40 40 0 0 1 90 50",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "8",
                                strokeLinecap: "round",
                                className: "text-accent-yellow dark:text-accent-green",
                                strokeDasharray: `${pct / 100 * 125.6} 125.6`
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/lighting-brightness-widget.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: "50",
                                y1: "50",
                                x2: "50",
                                y2: "18",
                                stroke: "currentColor",
                                strokeWidth: "3",
                                className: "text-accent-orange",
                                transform: `rotate(${rotation} 50 50)`
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
}),
"[project]/src/components/widgets/media-card-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MediaCardWidget",
    ()=>MediaCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.js [app-ssr] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/skip-back.js [app-ssr] (ecmascript) <export default as SkipBack>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/skip-forward.js [app-ssr] (ecmascript) <export default as SkipForward>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/disc-3.js [app-ssr] (ecmascript) <export default as Disc3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function formatTime(seconds) {
    if (seconds == null || Number.isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}
function MediaCardWidget({ title = "Media", entity_id, size = "md", className, onMoreClick, onExpandedChange }) {
    const [expanded, setExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const setExpandedWithCallback = (value)=>{
        setExpanded(value);
        onExpandedChange?.(value);
    };
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entity_id));
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const updatedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.updatedAt);
    const isOn = entity?.state !== "off" && entity?.state !== "unavailable" && entity?.state !== "unknown";
    const isPlaying = entity?.state === "playing";
    const mediaTitle = entity?.attributes?.media_title ?? "";
    const mediaArtist = entity?.attributes?.media_artist ?? "";
    const entityPicture = entity?.attributes?.entity_picture;
    const duration = Number(entity?.attributes?.media_duration) || 0;
    const position = Number(entity?.attributes?.media_position) || 0;
    const deviceName = entity?.attributes?.friendly_name || entity_id;
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
    const baselineRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        position: 0,
        at: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (updatedAt != null && position >= 0) {
            baselineRef.current = {
                position,
                at: updatedAt
            };
        }
    }, [
        position,
        updatedAt
    ]);
    // Elke seconde re-renderen om tijd/progress te updaten; baseline staat in ref dus herstart niet
    const [, setTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isPlaying || duration <= 0) return;
        const interval = setInterval(()=>setTick((t)=>t + 1), 1000);
        return ()=>clearInterval(interval);
    }, [
        isPlaying,
        duration
    ]);
    const { position: basePos, at: baseAt } = baselineRef.current;
    const displayPosition = isPlaying && duration > 0 && position >= 0 ? Math.min(duration, basePos + (Date.now() - baseAt) / 1000) : position;
    const progressPct = duration > 0 ? Math.min(100, displayPosition / duration * 100) : 0;
    // Unieke URL per nummer zodat de afbeelding ververst bij trackwissel (geen oude cache)
    const mediaImageSrc = entityPicture?.startsWith("http") ? entityPicture : entityPicture ? `/api/ha/media-image?entity_id=${encodeURIComponent(entity_id)}&v=${encodeURIComponent(entityPicture)}` : null;
    // Key per nummer: oude afbeelding verdwijnt direct bij trackwissel, nieuwe laadt in
    const trackKey = [
        mediaTitle,
        entityPicture
    ].filter(Boolean).join("|") || "none";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-gray-900 dark:text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            expanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pt-4 pb-2",
                        children: [
                            mediaImageSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setExpandedWithCallback(false),
                                className: "block relative w-full aspect-square max-h-48 mx-auto rounded-xl overflow-hidden bg-white/5 hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-white/50",
                                "aria-label": "Inklappen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full aspect-square max-h-48 mx-auto rounded-xl bg-white/5 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-1 rounded-full bg-white/20 overflow-hidden",
                                        role: "progressbar",
                                        "aria-valuenow": displayPosition,
                                        "aria-valuemin": 0,
                                        "aria-valuemax": duration,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full rounded-full bg-white transition-all duration-300",
                                            style: {
                                                width: `${progressPct}%`
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-xs text-white/60",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: formatTime(displayPosition)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setExpandedWithCallback(false),
                        className: "flex items-center justify-center gap-1 py-1 text-white/50 hover:text-white/80 transition-colors",
                        "aria-label": "Inklappen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden",
                children: [
                    mediaImageSrc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0",
                        "aria-hidden": true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: mediaImageSrc,
                                alt: "",
                                className: "absolute inset-0 h-full w-full object-cover scale-105 blur-md opacity-70"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex items-center gap-3 px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5", isPlaying && "animate-spin"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium truncate text-white/90",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onMoreClick();
                                },
                                className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                                "aria-label": "Opties",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
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
                            mediaImageSrc ? !expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setExpandedWithCallback(true),
                                className: "h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/20 hover:border-white/40 hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50",
                                "aria-label": "Uitklappen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                            }, this) : !expanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setExpandedWithCallback(true),
                                className: "h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center hover:border-white/40 hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-white/50",
                                "aria-label": "Uitklappen",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
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
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-10 w-10 shrink-0 rounded-lg bg-white/5 border border-white/20 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$disc$2d$3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Disc3$3e$__["Disc3"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-2 px-4 py-3 bg-black/10 dark:bg-black/30 backdrop-blur-md rounded-b-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium truncate text-sm text-gray-900 dark:text-white",
                                children: mediaTitle || "—"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handlePrevious,
                                disabled: loading || !isOn,
                                className: "p-2 rounded-full text-white/80 hover:bg-white/10 disabled:opacity-40",
                                "aria-label": "Previous",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$back$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipBack$3e$__["SkipBack"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handlePlayPause,
                                disabled: loading || !isOn,
                                className: "p-2 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-40",
                                "aria-label": isPlaying ? "Pause" : "Play",
                                children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/media-card-widget.tsx",
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleNext,
                                disabled: loading || !isOn,
                                className: "p-2 rounded-full text-white/80 hover:bg-white/10 disabled:opacity-40",
                                "aria-label": "Next",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$skip$2d$forward$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__SkipForward$3e$__["SkipForward"], {
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
}),
"[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
        const minL = bounds.minLeft ?? 0;
        const minB = bounds.minBottom ?? 0;
        left = Math.max(minL, Math.min(left, bounds.maxLeft));
        bottom = Math.max(minB, Math.min(bottom, bounds.maxBottom));
    }
    return {
        left,
        bottom
    };
}
}),
"[project]/src/components/widgets/floating-media-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingMediaCard",
    ()=>FloatingMediaCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/media-card-widget.tsx [app-ssr] (ecmascript)");
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
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition() {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: 100,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const LONG_PRESS_MS = 500;
function FloatingMediaCard({ title, entity_id, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition() ?? {
            left: 0,
            top: 0
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition();
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
        setPosition(p);
        savePosition(p);
    }, []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("button")) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.left,
            bottom: position.bottom
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", isExpanded ? "z-50" : "z-30", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MediaCardWidget"], {
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
}),
"[project]/src/components/widgets/light-card-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LIGHT_ICON_OPTIONS",
    ()=>LIGHT_ICON_OPTIONS,
    "LightCardWidget",
    ()=>LightCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp.js [app-ssr] (ecmascript) <export default as Lamp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$ceiling$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampCeiling$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-ceiling.js [app-ssr] (ecmascript) <export default as LampCeiling>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$desk$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampDesk$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-desk.js [app-ssr] (ecmascript) <export default as LampDesk>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$floor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampFloor$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-floor.js [app-ssr] (ecmascript) <export default as LampFloor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$wall$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampWallDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-wall-down.js [app-ssr] (ecmascript) <export default as LampWallDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$wall$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampWallUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp-wall-up.js [app-ssr] (ecmascript) <export default as LampWallUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const LIGHT_ICON_MAP = {
    lightbulb: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
    spotlight: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__["Lamp"],
    lamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__["Lamp"],
    "lamp-ceiling": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$ceiling$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampCeiling$3e$__["LampCeiling"],
    "lamp-desk": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$desk$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampDesk$3e$__["LampDesk"],
    "lamp-floor": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$floor$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampFloor$3e$__["LampFloor"],
    "lamp-wall-down": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$wall$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampWallDown$3e$__["LampWallDown"],
    "lamp-wall-up": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2d$wall$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LampWallUp$3e$__["LampWallUp"]
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
function LightCardWidget({ title = "Lamp", entity_id, icon: iconKey = "lightbulb", size = "md", className, onMoreClick }) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entity_id));
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const updateEntityState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.updateEntityState);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sliderBrightness, setSliderBrightness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(100);
    const brightnessDebounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [slidePosition, setSlidePosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const dragStartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const SWITCH_TRACK_PX = 72;
    const SWITCH_AREA_HEIGHT_PX = 200; /* hoogte van het sleepgebied; doos wordt hierop + padding berekend */ 
    const isOn = entity?.state === "on";
    const displayPosition = slidePosition ?? (isOn ? 1 : 0);
    /* 0 = bottom (uit), 1 = top (aan); transform uses (1 - position) so thumb moves up when on */ const brightnessRaw = entity?.attributes?.brightness ?? 255;
    const brightnessPct = Math.round(brightnessRaw / 255 * 100);
    const supportedFeatures = entity?.attributes?.supported_features ?? 0;
    const supportsBrightness = (supportedFeatures & 1) !== 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setSliderBrightness(brightnessPct);
    }, [
        brightnessPct
    ]);
    const refreshState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const res = await fetch("/api/ha/state").then((r)=>r.json());
        if (Array.isArray(res)) setStates(res);
    }, [
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>{
            if (brightnessDebounceRef.current) clearTimeout(brightnessDebounceRef.current);
        }, []);
    const IconComponent = LIGHT_ICON_MAP[iconKey] ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"];
    const statusText = isOn ? supportsBrightness ? `${brightnessPct}%` : "Aan" : "Uit";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl transition-colors duration-200", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", isOn ? "text-gray-900" : "text-gray-800 dark:text-gray-200 opacity-95", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleToggle,
                        disabled: loading,
                        className: "flex shrink-0 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-70 h-10 w-10",
                        "aria-label": isOn ? "Lamp uitzetten" : "Lamp aanzetten",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200", isOn ? "bg-[#FFD41D] shadow-sm" : "bg-white/30 dark:bg-white/10 shadow-inner"),
                            "aria-hidden": true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-5 w-5 shrink-0 transition-colors", isOn ? "text-white drop-shadow" : "text-gray-500 dark:text-gray-400"),
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setModalOpen(true),
                        className: "flex flex-1 min-w-0 items-center gap-2 text-left rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 dark:active:bg-white/10 -mx-1 px-1 py-0.5 transition-colors",
                        "aria-label": "Verlichting bedienen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1 flex flex-col justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium truncate text-inherit",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs truncate", isOn ? "text-gray-600" : "text-gray-500 dark:text-gray-400"),
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
                    onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.stopPropagation();
                            onMoreClick();
                        },
                        className: "p-1.5 rounded-lg shrink-0 text-inherit opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
                        "aria-label": "Opties",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
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
            modalOpen && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[100] flex items-center justify-center p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "absolute inset-0 z-[100] bg-black/40 dark:bg-black/50 backdrop-blur-md cursor-pointer",
                        "aria-label": "Modal sluiten",
                        onClick: ()=>setModalOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 201,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative z-[101] w-full max-w-sm p-5 flex flex-col items-center text-center", isOn && supportsBrightness ? "min-h-[420px]" : "min-h-[380px]"),
                        onClick: (e)=>e.stopPropagation(),
                        children: isOn && supportsBrightness ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-1",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 216,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center gap-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex flex-col items-center w-20 h-64",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-0 left-1/2 -translate-x-1/2 w-16 h-64 rounded-2xl bg-gray-700/80 dark:bg-gray-800/80 flex flex-col justify-end overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full rounded-b-2xl bg-[#FFD41D] min-h-0 transition-[height] duration-150 ease-out",
                                                    style: {
                                                        height: `${sliderBrightness}%`
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center w-10 h-10 rounded-full bg-amber-400/40",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
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
                        }, void 0, true) : supportsBrightness ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-1",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 250,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-300 mb-4",
                                    children: isOn ? "Aan" : "Uit"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 253,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 w-full max-w-xs mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                if (!isOn) handleToggle();
                                                setModalOpen(false);
                                            },
                                            disabled: loading,
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-xl py-3 px-4 text-sm font-medium transition-colors", isOn ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" : "bg-[#FFD41D] text-gray-900 hover:opacity-90"),
                                            children: "Aan"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                            lineNumber: 257,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                if (isOn) handleToggle();
                                                setModalOpen(false);
                                            },
                                            disabled: loading,
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-xl py-3 px-4 text-sm font-medium transition-colors", !isOn ? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" : "bg-gray-800 text-white dark:bg-gray-600 dark:text-white hover:opacity-90"),
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
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-semibold text-white mb-1",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 283,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-300 mb-6",
                                    children: isOn ? "Aan" : "Uit"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                                    lineNumber: 286,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col items-center rounded-3xl bg-gradient-to-br from-gray-600/60 to-gray-700/80 dark:from-gray-800/70 dark:to-gray-900/90 pt-3 pb-4 w-[100px]",
                                    style: {
                                        height: SWITCH_AREA_HEIGHT_PX + 12 + 16
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative w-[100px] flex flex-col justify-end select-none shrink-0",
                                        style: {
                                            height: SWITCH_AREA_HEIGHT_PX,
                                            paddingBottom: SWITCH_TRACK_PX,
                                            touchAction: "none"
                                        },
                                        onPointerDown: (e)=>{
                                            if (loading) return;
                                            e.preventDefault();
                                            e.currentTarget.setPointerCapture?.(e.pointerId);
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
                                            e.currentTarget.releasePointerCapture?.(e.pointerId);
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
                                            e.currentTarget.releasePointerCapture?.(e.pointerId);
                                            dragStartRef.current = null;
                                            setSlidePosition(null);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: loading,
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute left-1/2 -translate-x-1/2 w-20 h-[131px] rounded-xl flex items-center justify-center shadow-lg select-none touch-none", "transition-colors duration-200 disabled:opacity-70", displayPosition > 0.5 ? "bg-[#FFD41D]" : "bg-gray-600/80 dark:bg-gray-700/80"),
                                                style: {
                                                    bottom: SWITCH_TRACK_PX,
                                                    transform: `translate(-50%, ${(1 - displayPosition) * SWITCH_TRACK_PX}px)`,
                                                    transition: slidePosition != null ? "none" : "transform 0.15s ease-out"
                                                },
                                                "aria-label": displayPosition > 0.5 ? "Lamp uitzetten" : "Lamp aanzetten",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-9 w-9 shrink-0 transition-colors", displayPosition > 0.5 ? "text-white drop-shadow" : "text-white/70"),
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
            isOn && supportsBrightness && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-3 pt-0 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-gray-500 dark:text-gray-600 shrink-0 w-10",
                        children: "Helderheid"
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/light-card-widget.tsx",
                        lineNumber: 375,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/src/components/widgets/floating-light-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingLightCard",
    ()=>FloatingLightCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/light-card-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const STORAGE_KEY_PREFIX = "dashboard.floatingLightCardPosition.";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 240;
function loadPosition(widgetId) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition(_widgetIndex) {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const LONG_PRESS_MS = 500;
function FloatingLightCard({ widget, widgetIndex = 0, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(widget.entity_id));
    const isSelectedOn = entity?.state === "on";
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition(widget.id) ?? {
            left: 0,
            bottom: DEFAULT_OFFSET
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const isPointerDownOnCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        const target = e.target;
        if (target?.closest?.("button") ?? false) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    const totalWidth = CARD_WIDTH;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition(widget.id);
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(widgetIndex), bounds);
        setPosition(p);
        savePosition(widget.id, p);
    }, [
        totalWidth,
        widget.id,
        widgetIndex
    ]);
    const DRAG_THRESHOLD_PX = 6;
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        isPointerDownOnCard.current = true;
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.left,
            bottom: position.bottom
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
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
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging,
        maxLeft
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        isPointerDownOnCard.current = false;
        if (isDragging) {
            e.preventDefault();
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(widget.id, next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging,
        maxLeft,
        widget.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 shadow-xl rounded-2xl overflow-hidden backdrop-blur-2xl border flex transition-colors duration-200", isSelectedOn ? "bg-white dark:bg-gray-100 border-gray-200 dark:border-gray-200/80" : "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "shrink-0 flex flex-col",
            style: {
                width: CARD_WIDTH
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LightCardWidget"], {
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
}),
"[project]/src/components/widgets/climate-card-2-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClimateCard2Widget",
    ()=>ClimateCard2Widget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-ssr] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/flame.js [app-ssr] (ecmascript) <export default as Flame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-ssr] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/snowflake.js [app-ssr] (ecmascript) <export default as Snowflake>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/power.js [app-ssr] (ecmascript) <export default as Power>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-ssr] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
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
    return rounded % 1 === 0.5 ? `${rounded}°` : `${Math.round(rounded)}°`;
}
const TEMP_MIN = 5;
const TEMP_MAX = 35;
const MODE_CONFIG = [
    {
        mode: "auto",
        label: "Auto",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"]
    },
    {
        mode: "heat",
        label: "Verwarmen",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$flame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Flame$3e$__["Flame"]
    },
    {
        mode: "off",
        label: "Uit",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$power$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Power$3e$__["Power"]
    },
    {
        mode: "fan_only",
        label: "Wind",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"]
    },
    {
        mode: "cool",
        label: "Koelen",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$snowflake$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Snowflake$3e$__["Snowflake"]
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
function ClimateCard2Widget({ title = "Air Conditioner", entity_id, humidity_entity_id, size = "md", className, onMoreClick }) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entity_id));
    const humidityEntity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>humidity_entity_id ? s.getState(humidity_entity_id) : null);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [modeMenuOpen, setModeMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const modeButtonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [menuPosition, setMenuPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        modeMenuOpen
    ]);
    const currentTemperature = Number(entity?.attributes?.current_temperature) || undefined;
    const targetTemperature = Number(entity?.attributes?.temperature) ?? Number(entity?.attributes?.target_temp_high) ?? undefined;
    const minTemp = Number(entity?.attributes?.min_temp) || TEMP_MIN;
    const maxTemp = Number(entity?.attributes?.max_temp) || TEMP_MAX;
    const hvacModes = entity?.attributes?.hvac_modes ?? [];
    const state = entity?.state ?? "";
    const hvacModeFromAttr = entity?.attributes?.hvac_mode;
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
    const resolvedMode = hvacModeFromAttr ?? stateToMode[state] ?? state;
    const activeHvacMode = resolvedMode && hvacModes.includes(resolvedMode) ? resolvedMode : hvacModes[0] ?? null;
    const isOff = state === "off" || !state;
    const displayTemp = targetTemperature ?? currentTemperature ?? 20;
    const setTemperature = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (temperature)=>{
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
                const data = await fetch("/api/ha/state").then((r)=>r.json());
                if (Array.isArray(data)) setStates(data);
            }
        } finally{
            setLoading(false);
        }
    }, [
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
        availableModes.push(...hvacModes.filter((mode)=>!configuredModes.has(mode)).map((mode)=>({
                mode,
                label: STATE_LABELS[mode] ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["capitalizeFirst"])(mode),
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"]
            })));
    }
    const friendlyName = entity?.attributes?.friendly_name ?? entity_id;
    const humidityFromAttr = entity?.attributes?.humidity != null ? Number(entity.attributes.humidity) : undefined;
    const humidityFromSensor = humidityEntity?.state != null && humidityEntity.state !== "unavailable" ? Number(humidityEntity.state) : undefined;
    const humidity = humidityFromSensor ?? humidityFromAttr;
    const showHumidity = humidity != null && !Number.isNaN(humidity);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/15 dark:bg-black/50 text-gray-900 dark:text-white shadow-xl backdrop-blur-2xl border border-white/30 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 dark:bg-white/10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"], {
                                    className: "h-5 w-5 text-amber-600 dark:text-amber-400",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 213,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium truncate text-gray-900 dark:text-white/90",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                        lineNumber: 217,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-gray-500 dark:text-white/60 truncate",
                                        children: friendlyName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                        lineNumber: 218,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 216,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 shrink-0",
                        children: [
                            showHumidity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-gray-600 dark:text-white/90",
                                title: "Luchtvochtigheid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"], {
                                        className: "h-4 w-4",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                        lineNumber: 224,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm tabular-nums",
                                        children: [
                                            Math.round(humidity),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                        lineNumber: 225,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 223,
                                columnNumber: 13
                            }, this),
                            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onMoreClick,
                                className: "p-1.5 rounded-lg text-gray-500 hover:bg-white/20 dark:text-gray-400 dark:hover:bg-white/10",
                                "aria-label": "More options",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 235,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 flex items-center justify-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setTemperature(displayTemp - SELECTOR_STEP),
                        disabled: loading || isOff || displayTemp <= minTemp,
                        className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200/60 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300/60 dark:hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors",
                        "aria-label": "Temperatuur verlagen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                            className: "h-6 w-6"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                            lineNumber: 250,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 243,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-5xl font-bold tabular-nums text-gray-900 dark:text-white min-w-[4.5rem] text-center",
                        children: formatTemp(displayTemp)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setTemperature(displayTemp + SELECTOR_STEP),
                        disabled: loading || isOff || displayTemp >= maxTemp,
                        className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200/60 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300/60 dark:hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors",
                        "aria-label": "Temperatuur verhogen",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "h-6 w-6"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                            lineNumber: 262,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                        lineNumber: 255,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this),
            availableModes.length > 0 && (()=>{
                const currentMode = isOff ? "off" : activeHvacMode;
                const current = availableModes.find((m)=>m.mode === currentMode) ?? availableModes[0];
                const otherModes = availableModes.filter((m)=>m.mode !== currentMode);
                const offOption = MODE_CONFIG.find((m)=>m.mode === "off");
                const dropdownOptions = currentMode === "off" ? otherModes : [
                    ...otherModes,
                    ...offOption && !otherModes.some((m)=>m.mode === "off") ? [
                        offOption
                    ] : []
                ];
                const canChangeMode = dropdownOptions.length > 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 pb-4 pt-1 relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            ref: modeButtonRef,
                            type: "button",
                            onClick: ()=>setModeMenuOpen((v)=>!v),
                            disabled: loading || !canChangeMode,
                            "aria-expanded": modeMenuOpen,
                            "aria-haspopup": "listbox",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-sm font-medium transition-colors disabled:opacity-50", "bg-gray-200/60 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-300/60 dark:hover:bg-white/20"),
                            children: (()=>{
                                const Icon = current.icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "h-4 w-4 shrink-0",
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                            lineNumber: 295,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: current.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                            lineNumber: 296,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4 shrink-0 transition-transform", modeMenuOpen && "rotate-180"),
                                            "aria-hidden": true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                            lineNumber: 297,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true);
                            })()
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                            lineNumber: 279,
                            columnNumber: 13
                        }, this),
                        modeMenuOpen && canChangeMode && menuPosition && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "fixed inset-0 z-[100]",
                                    "aria-hidden": true,
                                    onClick: ()=>setModeMenuOpen(false)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 309,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    role: "listbox",
                                    className: "fixed z-[101] rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 dark:backdrop-blur-xl shadow-lg py-1 max-h-48 overflow-auto",
                                    style: {
                                        top: menuPosition.top,
                                        left: menuPosition.left,
                                        width: menuPosition.width
                                    },
                                    children: dropdownOptions.map(({ mode, label, icon: Icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            role: "option",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    if (mode === "off") setPower(false);
                                                    else setHvacMode(mode);
                                                    setModeMenuOpen(false);
                                                },
                                                disabled: loading,
                                                className: "w-full flex items-center gap-2 rounded-lg py-2 px-3 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        className: "h-4 w-4 shrink-0",
                                                        "aria-hidden": true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                                        lineNumber: 335,
                                                        columnNumber: 27
                                                    }, this),
                                                    label
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                                lineNumber: 325,
                                                columnNumber: 25
                                            }, this)
                                        }, mode, false, {
                                            fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                            lineNumber: 324,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                                    lineNumber: 314,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true), document.body)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
                    lineNumber: 278,
                    columnNumber: 11
                }, this);
            })()
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/climate-card-2-widget.tsx",
        lineNumber: 201,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/widgets/solar-card-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SolarCardWidget",
    ()=>SolarCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function formatValue(value, unit) {
    if (value == null || Number.isNaN(value)) return "—";
    const rounded = Math.round(value * 10) / 10;
    return unit ? `${rounded} ${unit}` : String(rounded);
}
function useEntityValue(entityId) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entityId));
    const raw = entity?.state;
    const value = raw != null && raw !== "unavailable" && raw !== "unknown" ? Number(raw) : undefined;
    const unit = entity?.attributes?.unit_of_measurement ?? "W";
    const friendlyName = entity?.attributes?.friendly_name ?? entityId;
    return {
        value,
        unit,
        friendlyName
    };
}
function SolarCardWidget({ title = "Zonnepanelen", entity_id, consumption_entity_id, size = "md", className, onMoreClick }) {
    const yieldData = useEntityValue(entity_id);
    const consumptionData = useEntityValue(consumption_entity_id ?? "");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium truncate text-white/90",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.stopPropagation();
                            onMoreClick();
                        },
                        className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                        "aria-label": "Opties",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4 pt-0 space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60 mb-0.5",
                                children: "Yield"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    consumption_entity_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-2 border-t border-white/10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-white/60 mb-0.5",
                                children: "Consumption"
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/solar-card-widget.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
}),
"[project]/src/components/widgets/floating-solar-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingSolarCard",
    ()=>FloatingSolarCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-card-widget.tsx [app-ssr] (ecmascript)");
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
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition() {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: 100,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const LONG_PRESS_MS = 500;
function FloatingSolarCard({ title, entity_id, consumption_entity_id, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition() ?? {
            left: 0,
            top: 0
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition();
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
        setPosition(p);
        savePosition(p);
    }, []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("button")) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.left,
            bottom: position.bottom
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SolarCardWidget"], {
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
}),
"[project]/src/components/widgets/weather-card-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WeatherCardWidget",
    ()=>WeatherCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud.js [app-ssr] (ecmascript) <export default as Cloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-fog.js [app-ssr] (ecmascript) <export default as CloudFog>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-lightning.js [app-ssr] (ecmascript) <export default as CloudLightning>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-rain.js [app-ssr] (ecmascript) <export default as CloudRain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-snow.js [app-ssr] (ecmascript) <export default as CloudSnow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-ssr] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-ssr] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function WeatherIcon({ state, className }) {
    const s = state?.toLowerCase() ?? "";
    const iconClass = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("shrink-0", className ?? "h-8 w-8");
    if (s === "sunny" || s === "clear") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 22,
        columnNumber: 46
    }, this);
    if (s === "clear-night") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 23,
        columnNumber: 35
    }, this);
    if (s === "fog" || s === "mist") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$fog$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudFog$3e$__["CloudFog"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 24,
        columnNumber: 43
    }, this);
    if (s === "rainy" || s === "pouring" || s === "hail") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$rain$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudRain$3e$__["CloudRain"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 25,
        columnNumber: 64
    }, this);
    if (s === "snowy" || s === "snowy-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$snow$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSnow$3e$__["CloudSnow"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 26,
        columnNumber: 52
    }, this);
    if (s === "lightning" || s === "lightning-rainy") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$lightning$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudLightning$3e$__["CloudLightning"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 27,
        columnNumber: 60
    }, this);
    if (s === "windy" || s === "windy-variant") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 28,
        columnNumber: 54
    }, this);
    if (s === "cloudy" || s === "partlycloudy" || s === "exceptional") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 29,
        columnNumber: 77
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Cloud$3e$__["Cloud"], {
        className: iconClass,
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
function formatTemp(value) {
    if (value == null || Number.isNaN(value)) return "—";
    return `${Math.round(value)}°`;
}
/** Achtergrondgradient per weertoestand (fallback als er geen afbeelding is). */ function getWeatherBackground(condition) {
    const s = condition?.toLowerCase() ?? "";
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
    const s = condition?.toLowerCase() ?? "";
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
function WeatherCardWidget({ title = "Weather", entity_id, size = "md", show_icon = true, className, onMoreClick }) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entity_id));
    const condition = entity?.state ?? "";
    const temperature = entity?.attributes?.temperature != null ? Number(entity.attributes.temperature) : undefined;
    const humidity = entity?.attributes?.humidity != null ? Number(entity.attributes.humidity) : undefined;
    const bgGradient = getWeatherBackground(condition);
    const bgImage = getWeatherBackgroundImage(condition);
    const friendlyName = entity?.attributes?.friendly_name ?? entity_id;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full min-h-[125px] flex-col overflow-hidden rounded-2xl text-white shadow-xl border border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute inset-0 bg-gradient-to-b rounded-2xl", bgGradient)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            bgImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 rounded-2xl overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-black/25 dark:bg-black/50 rounded-2xl"
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex flex-col z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-3 px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 min-w-0 flex-1",
                                children: [
                                    show_icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white drop-shadow-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(WeatherIcon, {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium truncate text-white/90 drop-shadow-sm",
                                                children: title
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                                lineNumber: 152,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                            humidity != null && !Number.isNaN(humidity) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-white/90 drop-shadow-sm shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"], {
                                        className: "h-4 w-4",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onMoreClick();
                                },
                                className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 drop-shadow-sm transition-colors",
                                "aria-label": "Opties",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 pb-4 pt-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-3xl font-bold tabular-nums text-white drop-shadow-md",
                            children: formatTemp(temperature)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                            lineNumber: 174,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/weather-card-widget.tsx",
                        lineNumber: 173,
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
}),
"[project]/src/components/widgets/floating-weather-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingWeatherCard",
    ()=>FloatingWeatherCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/weather-card-widget.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const STORAGE_KEY = "dashboard.floatingWeatherCardPosition";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 320;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
function clampWidth(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}
function loadPosition() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition(cardWidth) {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: 100,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const LONG_PRESS_MS = 500;
function FloatingWeatherCard({ title, entity_id, show_icon = true, width, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const totalWidth = clampWidth(width);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition() ?? {
            left: 0,
            top: 0
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition();
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(totalWidth), bounds);
        setPosition(p);
        savePosition(p);
    }, [
        totalWidth
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("button")) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.left,
            bottom: position.bottom
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging,
        maxLeft
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging,
        maxLeft
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WeatherCardWidget"], {
                title: title,
                entity_id: entity_id,
                show_icon: show_icon,
                size: "md",
                onMoreClick: editMode ? onEdit : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
                lineNumber: 211,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
            lineNumber: 210,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-weather-card.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/widgets/card-icons.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CARD_ICONS",
    ()=>CARD_ICONS,
    "CARD_ICON_OPTIONS",
    ()=>CARD_ICON_OPTIONS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bath$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bath.js [app-ssr] (ecmascript) <export default as Bath>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bed$2d$double$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BedDouble$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bed-double.js [app-ssr] (ecmascript) <export default as BedDouble>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-ssr] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/box.js [app-ssr] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car.js [app-ssr] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle.js [app-ssr] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-dot.js [app-ssr] (ecmascript) <export default as CircleDot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$door$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DoorOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/door-open.js [app-ssr] (ecmascript) <export default as DoorOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplets.js [app-ssr] (ecmascript) <export default as Droplets>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fuel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Fuel$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/fuel.js [app-ssr] (ecmascript) <export default as Fuel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-ssr] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GaugeCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-gauge.js [app-ssr] (ecmascript) <export default as GaugeCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lamp.js [app-ssr] (ecmascript) <export default as Lamp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shirt.js [app-ssr] (ecmascript) <export default as Shirt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sofa$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sofa$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sofa.js [app-ssr] (ecmascript) <export default as Sofa>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-ssr] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-ssr] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tree-pine.js [app-ssr] (ecmascript) <export default as TreePine>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils-crossed.js [app-ssr] (ecmascript) <export default as UtensilsCrossed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
"use client";
;
const CARD_ICONS = {
    Activity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"],
    Bath: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bath$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bath$3e$__["Bath"],
    BedDouble: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bed$2d$double$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BedDouble$3e$__["BedDouble"],
    Bot: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"],
    Box: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"],
    Building2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"],
    Car: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"],
    Circle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"],
    CircleDot: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__["CircleDot"],
    DoorOpen: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$door$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DoorOpen$3e$__["DoorOpen"],
    Droplets: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplets$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplets$3e$__["Droplets"],
    Eye: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"],
    Fuel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fuel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Fuel$3e$__["Fuel"],
    Gauge: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"],
    GaugeCircle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$gauge$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GaugeCircle$3e$__["GaugeCircle"],
    Home: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
    Lamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lamp$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lamp$3e$__["Lamp"],
    Lightbulb: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"],
    Shirt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__["Shirt"],
    Sofa: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sofa$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sofa$3e$__["Sofa"],
    Sparkles: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"],
    Star: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"],
    Sun: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"],
    Thermometer: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"],
    TreePine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tree$2d$pine$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TreePine$3e$__["TreePine"],
    Trash2: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"],
    UtensilsCrossed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__["UtensilsCrossed"],
    Wind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"],
    Zap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
};
const CARD_ICON_OPTIONS = Object.keys(CARD_ICONS).sort();
}),
"[project]/src/components/widgets/vacuum-card-widget.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VacuumCardWidget",
    ()=>VacuumCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-ssr] (ecmascript)");
"use client";
;
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
function VacuumCardWidget({ title = "Stofzuiger", entity_id, script_ids = [], script_names = {}, cleaned_area_entity_id, icon: iconName, size = "md", className, onMoreClick }) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entity_id));
    const cleanedAreaEntity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>cleaned_area_entity_id ? s.getState(cleaned_area_entity_id) : null);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const [loadingScript, setLoadingScript] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    /** Script die gestart is; blijft actief tot vacuum weer "docked" is. */ const [activeScriptId, setActiveScriptId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const state = entity?.state ?? "unknown";
    const friendlyName = entity?.attributes?.friendly_name ?? entity_id;
    const statusLabel = STATE_LABELS[state] ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["capitalizeFirst"])(state);
    const cleanedAreaValue = cleanedAreaEntity?.state;
    const cleanedAreaUnit = cleanedAreaEntity?.attributes?.unit_of_measurement ?? "";
    const showCleanedArea = cleaned_area_entity_id && cleanedAreaValue != null && cleanedAreaValue !== "";
    const IconComponent = iconName && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"].Bot;
    const isActive = state === "cleaning" || activeScriptId != null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (state === "docked" && activeScriptId) {
            setActiveScriptId(null);
        }
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl bg-white/10 dark:bg-black/50 text-white shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10 min-h-[7.75rem]", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3 px-4 py-3 shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white", isActive && "animate-vacuum"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium truncate text-white/90",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/vacuum-card-widget.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 shrink-0 min-w-0 max-w-[45%]",
                        children: [
                            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onMoreClick();
                                },
                                className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                                "aria-label": "Opties",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-end min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-sm font-medium truncate w-full text-right", state === "cleaning" && "text-amber-400", state === "docked" && "text-green-400", state === "error" && "text-red-400", ![
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
                                    showCleanedArea && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/60 truncate w-full text-right",
                                        children: [
                                            cleanedAreaValue,
                                            cleanedAreaUnit ? ` ${cleanedAreaUnit}` : ""
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
            script_ids.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-3 pt-3 border-t border-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-1.5",
                    children: script_ids.map((scriptId)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScriptTag, {
                            entityId: scriptId,
                            displayName: script_names?.[scriptId],
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
function ScriptTag({ entityId, displayName, onRun, loading, active, disabled }) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entityId));
    const label = displayName ?? entity?.attributes?.friendly_name ?? entityId.replace(/^script\./, "");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onRun,
        disabled: loading || disabled,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-normal transition-colors", active ? "border-amber-400/40 bg-amber-500/20 text-amber-200/95" : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/85 hover:border-white/20", (loading || disabled) && !active && "opacity-50 cursor-not-allowed"),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/src/components/widgets/floating-vacuum-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingVacuumCard",
    ()=>FloatingVacuumCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/vacuum-card-widget.tsx [app-ssr] (ecmascript) <locals>");
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
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition() {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: 100,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const LONG_PRESS_MS = 500;
function FloatingVacuumCard({ title, entity_id, script_ids = [], script_names = {}, cleaned_area_entity_id, icon, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition() ?? {
            left: 0,
            top: 0
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition();
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
        setPosition(p);
        savePosition(p);
    }, []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("button")) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.left,
            bottom: position.bottom
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["VacuumCardWidget"], {
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
}),
"[project]/src/components/widgets/sensor-card-widget.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SENSOR_CONDITION_COLORS",
    ()=>SENSOR_CONDITION_COLORS,
    "SENSOR_CONDITION_OPERATORS",
    ()=>SENSOR_CONDITION_OPERATORS,
    "SensorCardWidget",
    ()=>SensorCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-ssr] (ecmascript)");
"use client";
;
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
    if (state == null || state === "unavailable" || state === "unknown" || !conditions?.length) return null;
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["capitalizeFirst"])(state);
}
function SensorCardWidget({ title = "Sensor", entity_id, icon: iconName, size = "md", conditions, className, onMoreClick }) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entity_id));
    const state = entity?.state;
    const unit = entity?.attributes?.unit_of_measurement ?? "";
    const friendlyName = entity?.attributes?.friendly_name ?? entity_id;
    const IconComponent = iconName && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"].Gauge;
    const displayValue = formatValue(state);
    const matchedColor = matchCondition(state, conditions);
    const conditionClass = matchedColor && CONDITION_COLORS[matchedColor] ? CONDITION_COLORS[matchedColor] : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full flex-col overflow-hidden rounded-2xl text-white shadow-xl backdrop-blur-2xl border", conditionClass ?? "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10", size === "sm" && "text-sm", size === "md" && "text-base", size === "lg" && "text-lg", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium truncate text-white/90",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                    onMoreClick ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.stopPropagation();
                            onMoreClick();
                        },
                        className: "p-1.5 rounded-lg shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                        "aria-label": "Opties",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
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
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0 rounded-full p-1 text-white/50 hover:text-white/70",
                        "aria-label": "Info",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-4 pt-3 flex flex-col gap-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-baseline gap-2 flex-wrap",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("font-bold tabular-nums text-white", size === "sm" && "text-2xl", size === "md" && "text-3xl", size === "lg" && "text-4xl"),
                            children: displayValue
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/sensor-card-widget.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this),
                        unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
}),
"[project]/src/components/widgets/floating-sensor-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingSensorCard",
    ()=>FloatingSensorCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/sensor-card-widget.tsx [app-ssr] (ecmascript) <locals>");
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
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition() {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: 100,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const LONG_PRESS_MS = 500;
function FloatingSensorCard({ title, entity_id, icon, size = "md", conditions, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition() ?? {
            left: 0,
            top: 0
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition();
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
        setPosition(p);
        savePosition(p);
    }, []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("button")) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.left,
            bottom: position.bottom
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-[320px] shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl border border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SensorCardWidget"], {
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
}),
"[project]/src/components/widgets/pill-card-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PILL_CONDITION_COLORS",
    ()=>PILL_CONDITION_COLORS,
    "PILL_CONDITION_OPERATORS",
    ()=>PILL_CONDITION_OPERATORS,
    "PillCardWidget",
    ()=>PillCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-ssr] (ecmascript)");
"use client";
;
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
    if (state == null || state === "unavailable" || state === "unknown" || !conditions?.length) return null;
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["capitalizeFirst"])(state);
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
function PillCardWidget({ title = "Pill", entity_id, icon: iconName, conditions, show_state = true, className, onMoreClick }) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.getState(entity_id));
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const state = entity?.state;
    const unit = entity?.attributes?.unit_of_measurement ?? "";
    const domain = entity_id.split(".")[0] ?? "";
    const canToggle = TOGGLE_DOMAINS.includes(domain);
    const isOn = state === "on";
    const IconComponent = iconName && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"][iconName] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"].CircleDot;
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
        } catch  {
        // ignore
        }
    }
    const iconOnly = !show_state;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center h-9 rounded-full border text-sm font-medium shadow-lg backdrop-blur-xl text-white min-w-0 transition-colors duration-200", conditionClass, canToggle && "cursor-pointer hover:opacity-90 transition-opacity", iconOnly ? onMoreClick ? "relative w-12 h-9 px-1.5 justify-center shrink-0" : "relative w-9 h-9 p-0 justify-center shrink-0" : "gap-2 pl-0.5 pr-3", className),
        ...canToggle && {
            onClick: handleToggle,
            role: "button",
            "aria-pressed": isOn
        },
        title: iconOnly ? `${title}${state != null && state !== "unavailable" ? `: ${displayValue}` : ""}` : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("shrink-0 items-center justify-center rounded-full bg-white/15 text-white flex", iconOnly ? "h-7 w-7" : "h-7 w-7"),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
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
            !iconOnly && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1 flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate text-white/95",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/pill-card-widget.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "tabular-nums text-white shrink-0",
                        children: [
                            displayValue,
                            unit && !canToggle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: (e)=>{
                    e.stopPropagation();
                    onMoreClick();
                },
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("rounded-full shrink-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors", iconOnly ? "absolute -right-0.5 -top-0.5 p-0.5" : "p-1"),
                "aria-label": "Opties",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
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
}),
"[project]/src/components/widgets/floating-pill-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingPillCard",
    ()=>FloatingPillCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/pill-card-widget.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const STORAGE_KEY_PREFIX = "dashboard.floatingPillCardPosition.";
const DEFAULT_OFFSET = 24;
const CARD_WIDTH = 280;
function loadPosition(widgetId) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition(_widgetIndex) {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const LONG_PRESS_MS = 500;
function FloatingPillCard({ widget, widgetIndex = 0, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition(widget.id) ?? {
            left: 0,
            bottom: DEFAULT_OFFSET
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0,
        width: CARD_WIDTH,
        height: 80
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const w = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const h = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxLeft = w - CARD_WIDTH;
        const maxBottom = h - 80;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition(widget.id);
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(widgetIndex), bounds);
        setPosition(p);
        savePosition(widget.id, p);
    }, [
        widget.id,
        widgetIndex
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("button")) return;
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
        el.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxLeft = Math.max(0, (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400) - dragStart.current.width);
        const maxBottom = Math.max(0, (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400) - dragStart.current.height);
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxLeft = Math.max(0, (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400) - dragStart.current.width);
            const maxBottom = Math.max(0, (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400) - dragStart.current.height);
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(widget.id, next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging,
        widget.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-max max-w-[280px] shadow-xl rounded-2xl overflow-hidden bg-transparent", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-2xl [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PillCardWidget"], {
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
}),
"[project]/src/components/widgets/floating-card-group.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingCardGroup",
    ()=>FloatingCardGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/pill-card-widget.tsx [app-ssr] (ecmascript)");
"use client";
;
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
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition(_widgetIndex) {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const JUSTIFY_MAP = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between"
};
const LONG_PRESS_MS = 500;
function FloatingCardGroup({ group, widgetIndex = 0, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const alignment = group.alignment ?? "start";
    const children = group.children ?? [];
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition(group.id) ?? {
            left: 0,
            bottom: DEFAULT_OFFSET
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0,
        width: CARD_MIN_WIDTH,
        height: CARD_MIN_HEIGHT
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const w = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const h = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
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
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(widgetIndex), bounds);
        setPosition(p);
        savePosition(group.id, p);
    }, [
        group.id,
        widgetIndex
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("[data-group-opts]")) return;
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
        el.setPointerCapture?.(e.pointerId);
        setIsDragging(true);
    }, [
        position,
        editMode
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const w = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const h = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxLeft = w - dragStart.current.width;
        const maxBottom = h - dragStart.current.height;
        const minLeft = -DRAG_OVERFLOW_LEFT_BOTTOM;
        const minBottom = -DRAG_OVERFLOW_LEFT_BOTTOM;
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])({
            left: Math.max(minLeft, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(minBottom, Math.min(dragStart.current.bottom - dy, maxBottom))
        }, {
            maxLeft,
            maxBottom,
            minLeft,
            minBottom
        }));
    }, [
        isDragging
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const w = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const h = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const maxLeft = w - dragStart.current.width;
            const maxBottom = h - dragStart.current.height;
            const minLeft = -DRAG_OVERFLOW_LEFT_BOTTOM;
            const minBottom = -DRAG_OVERFLOW_LEFT_BOTTOM;
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])({
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
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging,
        group.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 w-max max-w-[90vw] shadow-xl rounded-2xl overflow-hidden relative", editMode && "bg-white/10 dark:bg-black/50 backdrop-blur-xl border border-white/20 dark:border-white/10 cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
            editMode && onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "data-group-opts": true,
                onClick: (e)=>{
                    e.stopPropagation();
                    onEdit();
                },
                className: "absolute right-2 top-2 z-10 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors",
                "aria-label": "Opties",
                title: "Bewerken of verwijderen",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex flex-wrap items-center gap-2 p-2 min-h-[52px]", JUSTIFY_MAP[alignment] ?? "justify-start"),
                children: [
                    children.filter((c)=>c.type === "pill_card").map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PillCardWidget"], {
                            title: child.title ?? "Pill",
                            entity_id: child.entity_id ?? "",
                            icon: child.icon,
                            conditions: child.conditions,
                            show_state: child.show_state !== false,
                            onMoreClick: undefined
                        }, child.id, false, {
                            fileName: "[project]/src/components/widgets/floating-card-group.tsx",
                            lineNumber: 252,
                            columnNumber: 13
                        }, this)),
                    editMode && children.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        "data-group-opts": true,
                        onClick: (e)=>{
                            e.stopPropagation();
                            onEdit?.();
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
}),
"[project]/src/components/widgets/floating-climate-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLIMATE_ICON_OPTIONS",
    ()=>CLIMATE_ICON_OPTIONS,
    "FloatingClimateCard",
    ()=>FloatingClimateCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-2-widget.tsx [app-ssr] (ecmascript)");
"use client";
;
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
const SWIPE_THRESHOLD_PX = 50;
function clampWidth(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}
const SLIDE_DURATION_MS = 280;
function loadPosition() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition(cardWidth) {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: 100,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const LONG_PRESS_MS = 500;
function FloatingClimateCard({ widgets: widgetsProp, title: titleProp, entity_id: entityIdProp, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const widgets = widgetsProp ?? (titleProp != null && entityIdProp != null ? [
        {
            id: "",
            title: titleProp,
            entity_id: entityIdProp,
            type: "climate_card_2"
        }
    ] : []);
    const totalWidth = clampWidth(widgets[0]?.width);
    const [selectedIndex, setSelectedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [flipDeg, setFlipDeg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [nextIndex, setNextIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const swipeAreaLongPressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        if (e.target.closest?.("[data-climate-swipe-area]")) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (widgets.length === 0) return;
        setSelectedIndex((prev)=>Math.min(prev, Math.max(0, widgets.length - 1)));
    }, [
        widgets.length
    ]);
    const selected = widgets[selectedIndex] ?? widgets[0];
    const hasMultiple = widgets.length > 1;
    const goToIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((index)=>{
        if (index === selectedIndex || index < 0 || index >= widgets.length) return;
        setSelectedIndex(index);
    }, [
        selectedIndex,
        widgets.length
    ]);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition() ?? {
            left: 0,
            bottom: DEFAULT_OFFSET
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const swipeStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition();
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(totalWidth), bounds);
        setPosition(p);
        savePosition(p);
    }, [
        totalWidth
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("button")) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.left,
            bottom: position.bottom
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging,
        maxLeft
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging,
        maxLeft
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 flex shadow-xl rounded-2xl overflow-hidden bg-white/10 dark:bg-black/50 backdrop-blur-2xl", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
                if (isDragging) handlePointerUp(e);
            },
            onPointerCancel: handlePointerUp
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-w-0 flex-1 w-[320px]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-climate-swipe-area": true,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(editMode && "[&>div]:rounded-t-none [&>div]:shadow-none [&_.rounded-2xl]:rounded-b-none", "relative touch-pan-y overflow-hidden"),
                style: {
                    touchAction: hasMultiple ? "pan-y" : undefined,
                    perspective: "1000px"
                },
                onPointerDown: hasMultiple ? (e)=>{
                    if (!editMode) {
                        swipeStart.current = {
                            x: e.clientX,
                            y: e.clientY
                        };
                        e.currentTarget.setPointerCapture?.(e.pointerId);
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
                        if (Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy)) {
                            e.preventDefault();
                            if (swipeAreaLongPressRef.current) {
                                clearTimeout(swipeAreaLongPressRef.current);
                                swipeAreaLongPressRef.current = null;
                            }
                        }
                    }
                } : undefined,
                onPointerUp: hasMultiple ? (e)=>{
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
                    e.currentTarget.releasePointerCapture?.(e.pointerId);
                } : undefined,
                onPointerCancel: hasMultiple ? (e)=>{
                    if (swipeAreaLongPressRef.current) {
                        clearTimeout(swipeAreaLongPressRef.current);
                        swipeAreaLongPressRef.current = null;
                    }
                    swipeStart.current = null;
                    e.currentTarget.releasePointerCapture?.(e.pointerId);
                } : undefined,
                onPointerLeave: hasMultiple ? ()=>{
                    if (swipeAreaLongPressRef.current) {
                        clearTimeout(swipeAreaLongPressRef.current);
                        swipeAreaLongPressRef.current = null;
                    }
                    swipeStart.current = null;
                } : undefined,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full overflow-hidden",
                        style: {
                            minHeight: 200
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex w-full h-full",
                            style: {
                                width: hasMultiple ? `${widgets.length * 100}%` : "100%",
                                transform: hasMultiple ? `translateX(-${selectedIndex * (100 / widgets.length)}%)` : "none",
                                transition: `transform ${SLIDE_DURATION_MS}ms ease-out`
                            },
                            children: widgets.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "shrink-0 w-full",
                                    style: hasMultiple ? {
                                        width: `${100 / widgets.length}%`
                                    } : undefined,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClimateCard2Widget"], {
                                        title: w.title,
                                        entity_id: w.entity_id,
                                        humidity_entity_id: w.humidity_entity_id,
                                        size: "md",
                                        onMoreClick: editMode ? ()=>w.id && onEdit?.(w.id) : undefined
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                        lineNumber: 335,
                                        columnNumber: 19
                                    }, this)
                                }, w.id, false, {
                                    fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                    lineNumber: 330,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                            lineNumber: 321,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                        lineNumber: 317,
                        columnNumber: 11
                    }, this),
                    hasMultiple && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-1 left-0 right-0 flex justify-center gap-1.5 pointer-events-none",
                        children: widgets.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("h-1.5 w-1.5 rounded-full transition-colors duration-300", i === selectedIndex ? "bg-white" : "bg-white/40"),
                                "aria-hidden": true
                            }, i, false, {
                                fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                                lineNumber: 349,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                        lineNumber: 347,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
                lineNumber: 256,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
            lineNumber: 255,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-climate-card.tsx",
        lineNumber: 226,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/widgets/title-card-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TitleCardWidget",
    ()=>TitleCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
function TitleCardWidget({ title, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex w-full items-center py-1", className),
        "aria-hidden": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
}),
"[project]/src/components/widgets/floating-title-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingTitleCard",
    ()=>FloatingTitleCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const STORAGE_KEY = "dashboard.floatingTitleCardPosition";
const DEFAULT_OFFSET = 24;
const PANEL_WIDTH = 200;
function loadPosition() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition() {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
const LONG_PRESS_MS = 500;
function FloatingTitleCard({ widgets, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition() ?? {
            left: 0,
            bottom: DEFAULT_OFFSET
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition();
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(), bounds);
        setPosition(p);
        savePosition(p);
    }, []);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("button")) return;
        e.preventDefault();
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.left,
            bottom: position.bottom
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging,
        maxLeft
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (isDragging) {
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging,
        maxLeft
    ]);
    if (widgets.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 flex flex-col", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-2 flex flex-col gap-1 max-h-[40vh] overflow-auto",
            children: widgets.map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 py-2 px-3 text-sm font-semibold text-gray-700 dark:text-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate flex-1 min-w-0",
                            children: w.title || "Titel"
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/floating-title-card.tsx",
                            lineNumber: 208,
                            columnNumber: 13
                        }, this),
                        editMode && onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: (e)=>{
                                e.stopPropagation();
                                onEdit(w.id);
                            },
                            className: "shrink-0 p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 dark:text-gray-400",
                            "aria-label": "Opties",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
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
}),
"[project]/src/components/widgets/room-card-widget.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RoomCardWidget",
    ()=>RoomCardWidget
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-ssr] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-ssr] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function formatEntityValue(state, attributes) {
    if (state == null || state === "unavailable" || state === "unknown") return "—";
    const num = Number(state);
    if (!Number.isNaN(num)) {
        const unit = attributes?.unit ?? "";
        if (Number.isInteger(num)) return `${num}${unit ? ` ${unit}` : ""}`;
        return `${Math.round(num * 100) / 100}${unit ? ` ${unit}` : ""}`;
    }
    return String(state);
}
const DEFAULT_ICON_BG = "#3B82F6";
function RoomCardWidget({ title = "Kamer", entity_id, icon = "Home", light_entity_id, background_image, icon_background_color, className, embedded, onMoreClick }) {
    const entity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>entity_id ? s.getState(entity_id) : null);
    const lightEntity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>light_entity_id ? s.getState(light_entity_id) : null);
    const setStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.setStates);
    const updateEntityState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.updateEntityState);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const isLightOn = lightEntity?.state === "on";
    const refreshState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const res = await fetch("/api/ha/state").then((r)=>r.json());
        if (Array.isArray(res)) setStates(res);
    }, [
        setStates
    ]);
    const toggleLight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
    }, [
        light_entity_id,
        isLightOn,
        updateEntityState,
        refreshState
    ]);
    const IconComponent = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"][icon] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CARD_ICONS"].Home;
    const isConfigured = Boolean(entity_id?.trim());
    const entityValue = isConfigured ? formatEntityValue(entity?.state, entity?.attributes) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("relative flex h-full w-full overflow-hidden rounded-2xl", embedded ? "bg-transparent" : "bg-white shadow-md dark:bg-gray-100", !embedded && !isConfigured && "border-2 border-dashed border-gray-300 dark:border-gray-500", className),
        children: [
            background_image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30",
                style: {
                    backgroundImage: `url(${background_image})`
                },
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-0 bottom-0 w-[100px] h-[100px] translate-x-[-20%] translate-y-[20%] flex items-center justify-center rounded-full text-white shadow-lg",
                style: {
                    backgroundColor: icon_background_color || DEFAULT_ICON_BG
                },
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                    className: "h-10 w-10",
                    "aria-hidden": true
                }, void 0, false, {
                    fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex min-w-0 flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1 flex-col items-end justify-center min-w-0 px-4 py-3 text-right pl-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 w-full justify-end min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 flex-1 flex flex-col items-end",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-base font-medium truncate w-full", embedded ? "text-gray-900 dark:text-white/90" : "text-gray-900 dark:text-gray-900"),
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-xs truncate w-full mt-0.5", embedded ? "text-gray-600 dark:text-white/70" : "text-gray-500 dark:text-gray-600"),
                                            children: isConfigured ? entityValue : !light_entity_id ? "Kies entiteiten in bewerken" : null
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this),
                                onMoreClick && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: (e)=>{
                                        e.stopPropagation();
                                        onMoreClick();
                                    },
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-1.5 rounded-lg shrink-0 transition-colors", embedded ? "text-gray-500 hover:text-gray-800 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"),
                                    "aria-label": "Bewerken",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                                        className: "h-5 w-5",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                        lineNumber: 130,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                    lineNumber: 121,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this),
                        light_entity_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: (e)=>{
                                e.stopPropagation();
                                toggleLight();
                            },
                            disabled: loading,
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("mt-2 flex shrink-0 items-center justify-center rounded-full h-9 w-9 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-70", embedded ? isLightOn ? "bg-[#FFD41D] text-white" : "bg-gray-300 text-gray-600 dark:bg-white/20 dark:text-white/60" : isLightOn ? "bg-[#FFD41D] text-white shadow-sm" : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"),
                            "aria-label": isLightOn ? "Lamp uitzetten" : "Lamp aanzetten",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                className: "h-5 w-5 shrink-0",
                                strokeWidth: 1.5,
                                fill: isLightOn ? "currentColor" : "none",
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                                lineNumber: 151,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/room-card-widget.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/widgets/room-card-widget.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/widgets/floating-room-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FloatingRoomCard",
    ()=>FloatingRoomCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/floating-card-grid.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$room$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/room-card-widget.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const STORAGE_KEY_PREFIX = "dashboard.floatingRoomCardPosition.";
const DEFAULT_OFFSET = 24;
const DEFAULT_CARD_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;
function loadPosition(widgetId) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function savePosition(widgetId, p) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function defaultPosition(_widgetIndex, cardWidth) {
    if ("TURBOPACK compile-time truthy", 1) return {
        left: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET
    };
    //TURBOPACK unreachable
    ;
    const maxLeft = undefined;
    const maxBottom = undefined;
}
function clampWidth(w) {
    const n = Number(w);
    if (!Number.isFinite(n)) return DEFAULT_CARD_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(n)));
}
const LONG_PRESS_MS = 500;
const DRAG_THRESHOLD_PX = 6;
function FloatingRoomCard({ widget, widgetIndex = 0, editMode = false, onRemove, onEdit, onEnterEditMode }) {
    const totalWidth = clampWidth(widget.width);
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>loadPosition(widget.id) ?? {
            left: 0,
            bottom: DEFAULT_OFFSET
        });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        left: 0,
        bottom: 0
    });
    const isPointerDownOnCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const initialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }, []);
    const startLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (editMode || !onEnterEditMode) return;
        clearLongPress();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            onEnterEditMode();
        }, LONG_PRESS_MS);
    }, [
        editMode,
        onEnterEditMode,
        clearLongPress
    ]);
    const endLongPress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        clearLongPress();
    }, [
        clearLongPress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (initialized.current) return;
        initialized.current = true;
        const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const bounds = {
            maxLeft,
            maxBottom
        };
        const saved = loadPosition(widget.id);
        if (saved) {
            setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(saved, bounds));
            return;
        }
        const p = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(defaultPosition(widgetIndex, totalWidth), bounds);
        setPosition(p);
        savePosition(widget.id, p);
    }, [
        widget.id,
        widgetIndex,
        totalWidth
    ]);
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (!editMode) return;
        if (e.target.closest?.("button")) return;
        isPointerDownOnCard.current = true;
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            left: position.left,
            bottom: position.bottom
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }, [
        position,
        editMode
    ]);
    const maxLeft = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
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
        const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
        const raw = {
            left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
            bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
        };
        setPosition((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
            maxLeft,
            maxBottom
        }));
    }, [
        isDragging,
        maxLeft,
        totalWidth
    ]);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        isPointerDownOnCard.current = false;
        if (isDragging) {
            e.preventDefault();
            setIsDragging(false);
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            const maxBottom = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 400;
            const raw = {
                left: Math.max(0, Math.min(dragStart.current.left + dx, maxLeft)),
                bottom: Math.max(0, Math.min(dragStart.current.bottom - dy, maxBottom))
            };
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$floating$2d$card$2d$grid$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["snapToGrid"])(raw, {
                maxLeft,
                maxBottom
            });
            setPosition(next);
            savePosition(widget.id, next);
        }
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    }, [
        isDragging,
        maxLeft,
        widget.id,
        totalWidth
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("fixed z-30 shadow-xl rounded-2xl overflow-hidden backdrop-blur-2xl border flex transition-colors duration-200", "bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10", editMode && "cursor-grab touch-none active:cursor-grabbing", editMode && !isDragging && "animate-edit-wiggle"),
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("shrink-0 flex flex-col w-full", editMode && "[&>div]:rounded-t-none [&>div]:shadow-none"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$room$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RoomCardWidget"], {
                title: widget.title,
                entity_id: widget.entity_id,
                icon: widget.icon,
                light_entity_id: widget.light_entity_id,
                background_image: widget.background_image,
                icon_background_color: widget.icon_background_color,
                embedded: true,
                onMoreClick: editMode ? onEdit : undefined
            }, void 0, false, {
                fileName: "[project]/src/components/widgets/floating-room-card.tsx",
                lineNumber: 231,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/widgets/floating-room-card.tsx",
            lineNumber: 230,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/floating-room-card.tsx",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/widgets/widget-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
}),
"[project]/src/components/widgets/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$usage$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/energy-usage-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$control$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/light-control-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$wifi$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/wifi-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$charge$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-charge-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$lighting$2d$brightness$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/lighting-brightness-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/media-card-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$media$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-media-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/light-card-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$light$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-light-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-2-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-card-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$solar$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-solar-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/weather-card-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$weather$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-weather-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/vacuum-card-widget.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$vacuum$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-vacuum-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/sensor-card-widget.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$sensor$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-sensor-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/pill-card-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$pill$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-pill-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$card$2d$group$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-card-group.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-climate-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$title$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/title-card-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$title$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-title-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$room$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/room-card-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$room$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-room-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$widget$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/widget-types.ts [app-ssr] (ecmascript)");
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
"[project]/src/components/offline-pill.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OfflinePill",
    ()=>OfflinePill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function OfflinePill({ className }) {
    const isOffline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStateStore"])((s)=>s.error != null);
    if (!isOffline) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("inline-flex items-center rounded-full bg-red-500/90 px-2.5 py-0.5 text-xs font-medium text-white", className),
        children: "Offline"
    }, void 0, false, {
        fileName: "[project]/src/components/offline-pill.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/music/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MusicPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/app-shell.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/media-card-widget.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-entity-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$offline$2d$pill$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/offline-pill.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/music-2.js [app-ssr] (ecmascript) <export default as Music2>");
"use client";
;
;
;
;
;
;
;
function MusicPage() {
    const [entities, setEntities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$entity$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEntityStatePolling"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLoading(true);
        setError(null);
        fetch("/api/ha/entities").then((r)=>{
            if (!r.ok) throw new Error("Kon geen verbinding maken met Home Assistant.");
            return r.json();
        }).then((data)=>{
            const list = Array.isArray(data) ? data : [];
            const mediaPlayers = list.filter((e)=>e.entity_id?.startsWith("media_player."));
            setEntities(mediaPlayers);
        }).catch((err)=>setError(err instanceof Error ? err.message : "Er is iets misgegaan.")).finally(()=>setLoading(false));
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppShell"], {
        activeTab: "/music",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold text-gray-900 dark:text-white",
                                    children: "Music"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/music/page.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-sm text-gray-500 dark:text-gray-400",
                                    children: "Bedien je Sonos en andere media players via Home Assistant."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/music/page.tsx",
                                    lineNumber: 44,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/music/page.tsx",
                            lineNumber: 40,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$offline$2d$pill$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OfflinePill"], {}, void 0, false, {
                            fileName: "[project]/src/app/music/page.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/music/page.tsx",
                    lineNumber: 39,
                    columnNumber: 9
                }, this),
                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 w-8 animate-spin rounded-full border-2 border-accent-yellow dark:border-accent-green border-t-transparent",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/app/music/page.tsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/music/page.tsx",
                    lineNumber: 52,
                    columnNumber: 11
                }, this),
                error && !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/music/page.tsx",
                    lineNumber: 61,
                    columnNumber: 11
                }, this),
                !loading && !error && entities.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-white/20 bg-gray-50/50 dark:bg-white/5 py-16 px-6 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"], {
                            className: "h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/music/page.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                            children: "Geen media players gevonden"
                        }, void 0, false, {
                            fileName: "[project]/src/app/music/page.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm",
                            children: "Voeg de Sonos-integratie (of een andere media player) toe in Home Assistant, dan verschijnen je speakers hier."
                        }, void 0, false, {
                            fileName: "[project]/src/app/music/page.tsx",
                            lineNumber: 72,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/music/page.tsx",
                    lineNumber: 67,
                    columnNumber: 11
                }, this),
                !loading && !error && entities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-6 sm:grid-cols-1 lg:grid-cols-2",
                    children: entities.map((e)=>{
                        const title = e.attributes?.friendly_name ?? e.entity_id;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MediaCardWidget"], {
                            title: title,
                            entity_id: e.entity_id,
                            size: "md"
                        }, e.entity_id, false, {
                            fileName: "[project]/src/app/music/page.tsx",
                            lineNumber: 85,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/src/app/music/page.tsx",
                    lineNumber: 80,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/music/page.tsx",
            lineNumber: 38,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/music/page.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_e8193109._.js.map