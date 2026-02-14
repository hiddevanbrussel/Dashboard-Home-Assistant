(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$grid$2d$layout$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-grid-layout/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-dot.js [app-client] (ecmascript) <export default as CircleDot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-sun.js [app-client] (ecmascript) <export default as CloudSun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fuel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Fuel$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/fuel.js [app-client] (ecmascript) <export default as Fuel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gauge.js [app-client] (ecmascript) <export default as Gauge>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-grid.js [app-client] (ecmascript) <export default as LayoutGrid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/music-2.js [app-client] (ecmascript) <export default as Music2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thermometer.js [app-client] (ecmascript) <export default as Thermometer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/type.js [app-client] (ecmascript) <export default as Type>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as Video>");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/light-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$light$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-light-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/climate-card-2-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/solar-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$climate$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-climate-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$solar$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-solar-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$weather$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-weather-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$weather$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/weather-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/vacuum-card-widget.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$vacuum$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-vacuum-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/sensor-card-widget.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$sensor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-sensor-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$title$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/title-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$title$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-title-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__CARD_ICON_OPTIONS__as__VACUUM_ICON_OPTIONS$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript) <export CARD_ICON_OPTIONS as VACUUM_ICON_OPTIONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__CARD_ICON_OPTIONS__as__SENSOR_ICON_OPTIONS$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript) <export CARD_ICON_OPTIONS as SENSOR_ICON_OPTIONS>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$pill$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-pill-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$card$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-card-group.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$room$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/room-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$room$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-room-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$nuts$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/nuts-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$nuts$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-nuts-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$monitor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/energy-monitor-card-widget.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$energy$2d$monitor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-energy-monitor-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$stat$2d$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/components/widgets/stat-pill-card-widget.tsx [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$stat$2d$pill$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-stat-pill-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$camera$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/floating-camera-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/widgets/card-icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/entity-state-store.ts [app-client] (ecmascript)");
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
    "title_card",
    "climate_card_2",
    "light_card",
    "media_card",
    "solar_card",
    "energy_monitor_card",
    "stat_pill_card",
    "sensor_card",
    "weather_card",
    "vacuum_card",
    "camera_card",
    "pill_card",
    "room_card",
    "nuts_card",
    "card_group"
];
const ADDABLE_WIDGET_TILES = [
    {
        type: "title_card",
        label: "Titel",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$type$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Type$3e$__["Type"]
    },
    {
        type: "climate_card_2",
        label: "Klimaat",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thermometer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Thermometer$3e$__["Thermometer"]
    },
    {
        type: "light_card",
        label: "Lamp",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"]
    },
    {
        type: "media_card",
        label: "Media",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$music$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Music2$3e$__["Music2"]
    },
    {
        type: "solar_card",
        label: "Zonnepanelen",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"]
    },
    {
        type: "energy_monitor_card",
        label: "Afbeeldingskaart",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"]
    },
    {
        type: "stat_pill_card",
        label: "Stat pill",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__["CircleDot"]
    },
    {
        type: "sensor_card",
        label: "Sensor",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__["Gauge"]
    },
    {
        type: "weather_card",
        label: "Weer",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CloudSun$3e$__["CloudSun"]
    },
    {
        type: "vacuum_card",
        label: "Stofzuiger",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"]
    },
    {
        type: "camera_card",
        label: "Camera",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"]
    },
    {
        type: "pill_card",
        label: "Pill",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$dot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CircleDot$3e$__["CircleDot"]
    },
    {
        type: "room_card",
        label: "Kamer",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"]
    },
    {
        type: "nuts_card",
        label: "Nuts (Gas/Water)",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$fuel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Fuel$3e$__["Fuel"]
    },
    {
        type: "card_group",
        label: "Kaartgroep",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$grid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutGrid$3e$__["LayoutGrid"]
    }
];
/** Map widget type to HA domain for filtering entities */ const WIDGET_TYPE_DOMAIN = {
    title_card: "",
    energy_usage: "sensor",
    light_control: "light",
    wifi: "sensor",
    solar_charge: "sensor",
    climate: "climate",
    climate_card: "climate",
    climate_card_2: "climate",
    light_card: "light",
    lighting_brightness: "light",
    media_card: "media_player",
    solar_card: "sensor",
    energy_monitor_card: "sensor",
    stat_pill_card: "sensor",
    sensor_card: "sensor",
    weather_card: "weather",
    vacuum_card: "vacuum",
    camera_card: "camera",
    pill_card: "switch",
    room_card: "",
    nuts_card: "sensor",
    card_group: ""
};
const PILL_CARD_DOMAINS = [
    "switch",
    "light",
    "input_boolean",
    "sensor"
];
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
    let { type, title, entity_id, consumption_entity_id, humidity_entity_id, show_icon, script_ids, script_names, cleaned_area_entity_id, light_entity_id, background_image, background_image_dark, image_conditions, icon, size, conditions, current_entity_id, max_value, grid_entity_id, minimal, label, color } = param;
    _s();
    var _ref;
    const sizeProp = (_ref = size) !== null && _ref !== void 0 ? _ref : "md";
    const live = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "WidgetByType.useEntityStateStore[live]": (s)=>s.getState(entity_id)
    }["WidgetByType.useEntityStateStore[live]"]);
    const num = (live === null || live === void 0 ? void 0 : live.state) != null ? Number(live.state) : undefined;
    const onOff = (live === null || live === void 0 ? void 0 : live.state) === "on" ? "on" : "off";
    switch(type){
        case "title_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$title$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TitleCardWidget"], {
                title: title
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 199,
                columnNumber: 14
            }, this);
        case "energy_usage":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$usage$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyUsageWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp,
                value: num
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 201,
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
                lineNumber: 204,
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
                lineNumber: 213,
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
                lineNumber: 215,
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
                lineNumber: 217,
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
                lineNumber: 219,
                columnNumber: 14
            }, this);
        case "media_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$media$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MediaCardWidget"], {
                title: title,
                entity_id: entity_id,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 221,
                columnNumber: 14
            }, this);
        case "climate_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateCard2Widget"], {
                title: title,
                entity_id: entity_id,
                humidity_entity_id: humidity_entity_id,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 224,
                columnNumber: 9
            }, this);
        case "climate_card_2":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$climate$2d$card$2d$2$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClimateCard2Widget"], {
                title: title,
                entity_id: entity_id,
                humidity_entity_id: humidity_entity_id,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 233,
                columnNumber: 9
            }, this);
        case "light_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LightCardWidget"], {
                title: title,
                entity_id: entity_id,
                icon: icon,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 242,
                columnNumber: 9
            }, this);
        case "solar_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$solar$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SolarCardWidget"], {
                title: title,
                entity_id: entity_id,
                consumption_entity_id: consumption_entity_id,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 251,
                columnNumber: 9
            }, this);
        case "energy_monitor_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$energy$2d$monitor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyMonitorCardWidget"], {
                title: title,
                entity_id: entity_id,
                background_image: background_image,
                background_image_dark: background_image_dark,
                image_conditions: image_conditions,
                minimal: minimal,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 260,
                columnNumber: 9
            }, this);
        case "stat_pill_card":
            var _ref1;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$stat$2d$pill$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["StatPillCardWidget"], {
                title: title,
                entity_id: entity_id,
                label: label,
                icon: icon,
                color: (_ref1 = color) !== null && _ref1 !== void 0 ? _ref1 : "amber",
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 272,
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
                lineNumber: 283,
                columnNumber: 9
            }, this);
        case "vacuum_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$vacuum$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["VacuumCardWidget"], {
                title: title,
                entity_id: entity_id,
                script_ids: script_ids,
                script_names: script_names,
                cleaned_area_entity_id: cleaned_area_entity_id,
                icon: icon,
                size: sizeProp
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 292,
                columnNumber: 9
            }, this);
        case "sensor_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SensorCardWidget"], {
                title: title,
                entity_id: entity_id,
                icon: icon,
                show_icon: show_icon,
                size: sizeProp,
                conditions: conditions
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 304,
                columnNumber: 9
            }, this);
        case "room_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$room$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RoomCardWidget"], {
                title: title,
                entity_id: entity_id,
                icon: icon,
                light_entity_id: light_entity_id,
                background_image: background_image
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 315,
                columnNumber: 9
            }, this);
        case "nuts_card":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$nuts$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NutsCardWidget"], {
                title: title,
                entity_id: entity_id,
                current_entity_id: current_entity_id,
                icon: icon,
                max_value: max_value
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 325,
                columnNumber: 9
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-card border border-dashed p-4 text-sm text-gray-500",
                children: title || type
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 335,
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
    const [addTileEntitySearch, setAddTileEntitySearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editEntitySearch, setEditEntitySearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [groupAddEntitySearch, setGroupAddEntitySearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editingWidgetId, setEditingWidgetId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /** When editing a card_group, id of the child pill being edited (null = editing group itself). */ const [editingGroupChildId, setEditingGroupChildId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: "",
        entity_id: "",
        consumption_entity_id: "",
        grid_entity_id: "",
        humidity_entity_id: "",
        show_icon: true,
        show_state: true,
        script_ids: [],
        script_names: {},
        cleaned_area_entity_id: "",
        current_entity_id: "",
        light_entity_id: "",
        background_image: "",
        background_image_dark: "",
        icon_background_color: "",
        width: undefined,
        height: undefined,
        icon: "",
        size: "md",
        conditions: [],
        image_conditions: [],
        minimal: false,
        scale: 1,
        label: "",
        color: "amber",
        refresh: 10,
        show_title: true
    });
    const [iconSearch, setIconSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [vacuumIconSearch, setVacuumIconSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sensorIconSearch, setSensorIconSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [pillIconSearch, setPillIconSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sensorCardEditTab, setSensorCardEditTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("general");
    const [roomCardEditTab, setRoomCardEditTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("algemeen");
    const [uploadingRoomBg, setUploadingRoomBg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const longPressTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const LONG_PRESS_MS = 500;
    function clearLongPressTimer() {
        if (longPressTimerRef.current != null) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    }
    function startLongPressForEdit(e) {
        var _setPointerCapture, _this;
        if (editMode) return;
        e.preventDefault();
        (_setPointerCapture = (_this = e.currentTarget).setPointerCapture) === null || _setPointerCapture === void 0 ? void 0 : _setPointerCapture.call(_this, e.pointerId);
        clearLongPressTimer();
        longPressTimerRef.current = setTimeout(()=>{
            longPressTimerRef.current = null;
            setEditMode(true);
        }, LONG_PRESS_MS);
    }
    function clearLongPressTimerAndRelease(e) {
        var _releasePointerCapture, _this;
        (_releasePointerCapture = (_this = e.currentTarget).releasePointerCapture) === null || _releasePointerCapture === void 0 ? void 0 : _releasePointerCapture.call(_this, e.pointerId);
        clearLongPressTimer();
    }
    const editingWidget = editingWidgetId ? widgets.find((w)=>w.id === editingWidgetId) : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardEditPage.useEffect": ()=>{
            if (!editingWidgetId) setEditingGroupChildId(null);
        }
    }["DashboardEditPage.useEffect"], [
        editingWidgetId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardEditPage.useEffect": ()=>{
            if ((editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.type) === "card_group" && editingGroupChildId) {
                var _editingWidget_children;
                const child = ((_editingWidget_children = editingWidget.children) !== null && _editingWidget_children !== void 0 ? _editingWidget_children : []).find({
                    "DashboardEditPage.useEffect.child": (c)=>c.id === editingGroupChildId
                }["DashboardEditPage.useEffect.child"]);
                if (child) {
                    var _child_title, _child_entity_id, _child_icon, _child_conditions;
                    setEditForm({
                        title: (_child_title = child.title) !== null && _child_title !== void 0 ? _child_title : "",
                        entity_id: (_child_entity_id = child.entity_id) !== null && _child_entity_id !== void 0 ? _child_entity_id : "",
                        consumption_entity_id: "",
                        humidity_entity_id: "",
                        show_icon: true,
                        script_ids: [],
                        script_names: {},
                        cleaned_area_entity_id: "",
                        icon: (_child_icon = child.icon) !== null && _child_icon !== void 0 ? _child_icon : "",
                        size: "md",
                        conditions: (_child_conditions = child.conditions) !== null && _child_conditions !== void 0 ? _child_conditions : [],
                        show_state: child.show_state !== false
                    });
                    var _child_icon1;
                    setPillIconSearch((_child_icon1 = child.icon) !== null && _child_icon1 !== void 0 ? _child_icon1 : "");
                }
                return;
            }
            if (editingWidget) {
                var _editingWidget_title, _editingWidget_entity_id, _editingWidget_consumption_entity_id, _editingWidget_grid_entity_id, _editingWidget_humidity_entity_id, _editingWidget_script_ids, _editingWidget_script_names, _editingWidget_cleaned_area_entity_id, _editingWidget_light_entity_id, _editingWidget_background_image, _editingWidget_background_image_dark, _editingWidget_icon_background_color, _editingWidget_width, _editingWidget_height, _editingWidget_icon, _editingWidget_size, _editingWidget_conditions, _editingWidget_image_conditions, _editingWidget_current_entity_id, _editingWidget_max_value, _editingWidget_minimal, _editingWidget_scale, _editingWidget_label, _editingWidget_color, _editingWidget_refresh;
                setEditForm({
                    title: (_editingWidget_title = editingWidget.title) !== null && _editingWidget_title !== void 0 ? _editingWidget_title : "",
                    entity_id: (_editingWidget_entity_id = editingWidget.entity_id) !== null && _editingWidget_entity_id !== void 0 ? _editingWidget_entity_id : "",
                    consumption_entity_id: (_editingWidget_consumption_entity_id = editingWidget.consumption_entity_id) !== null && _editingWidget_consumption_entity_id !== void 0 ? _editingWidget_consumption_entity_id : "",
                    grid_entity_id: (_editingWidget_grid_entity_id = editingWidget.grid_entity_id) !== null && _editingWidget_grid_entity_id !== void 0 ? _editingWidget_grid_entity_id : "",
                    humidity_entity_id: (_editingWidget_humidity_entity_id = editingWidget.humidity_entity_id) !== null && _editingWidget_humidity_entity_id !== void 0 ? _editingWidget_humidity_entity_id : "",
                    show_icon: editingWidget.show_icon !== false,
                    script_ids: (_editingWidget_script_ids = editingWidget.script_ids) !== null && _editingWidget_script_ids !== void 0 ? _editingWidget_script_ids : [],
                    script_names: (_editingWidget_script_names = editingWidget.script_names) !== null && _editingWidget_script_names !== void 0 ? _editingWidget_script_names : {},
                    cleaned_area_entity_id: (_editingWidget_cleaned_area_entity_id = editingWidget.cleaned_area_entity_id) !== null && _editingWidget_cleaned_area_entity_id !== void 0 ? _editingWidget_cleaned_area_entity_id : "",
                    light_entity_id: (_editingWidget_light_entity_id = editingWidget.light_entity_id) !== null && _editingWidget_light_entity_id !== void 0 ? _editingWidget_light_entity_id : "",
                    background_image: (_editingWidget_background_image = editingWidget.background_image) !== null && _editingWidget_background_image !== void 0 ? _editingWidget_background_image : "",
                    background_image_dark: (_editingWidget_background_image_dark = editingWidget.background_image_dark) !== null && _editingWidget_background_image_dark !== void 0 ? _editingWidget_background_image_dark : "",
                    icon_background_color: (_editingWidget_icon_background_color = editingWidget.icon_background_color) !== null && _editingWidget_icon_background_color !== void 0 ? _editingWidget_icon_background_color : "",
                    width: (_editingWidget_width = editingWidget.width) !== null && _editingWidget_width !== void 0 ? _editingWidget_width : undefined,
                    height: (_editingWidget_height = editingWidget.height) !== null && _editingWidget_height !== void 0 ? _editingWidget_height : undefined,
                    icon: (_editingWidget_icon = editingWidget.icon) !== null && _editingWidget_icon !== void 0 ? _editingWidget_icon : "",
                    size: (_editingWidget_size = editingWidget.size) !== null && _editingWidget_size !== void 0 ? _editingWidget_size : "md",
                    conditions: (_editingWidget_conditions = editingWidget.conditions) !== null && _editingWidget_conditions !== void 0 ? _editingWidget_conditions : [],
                    image_conditions: (_editingWidget_image_conditions = editingWidget.image_conditions) !== null && _editingWidget_image_conditions !== void 0 ? _editingWidget_image_conditions : [],
                    show_state: editingWidget.show_state !== false,
                    current_entity_id: (_editingWidget_current_entity_id = editingWidget.current_entity_id) !== null && _editingWidget_current_entity_id !== void 0 ? _editingWidget_current_entity_id : "",
                    max_value: (_editingWidget_max_value = editingWidget.max_value) !== null && _editingWidget_max_value !== void 0 ? _editingWidget_max_value : undefined,
                    minimal: (_editingWidget_minimal = editingWidget.minimal) !== null && _editingWidget_minimal !== void 0 ? _editingWidget_minimal : false,
                    scale: (_editingWidget_scale = editingWidget.scale) !== null && _editingWidget_scale !== void 0 ? _editingWidget_scale : 1,
                    label: (_editingWidget_label = editingWidget.label) !== null && _editingWidget_label !== void 0 ? _editingWidget_label : "",
                    color: (_editingWidget_color = editingWidget.color) !== null && _editingWidget_color !== void 0 ? _editingWidget_color : "amber",
                    refresh: (_editingWidget_refresh = editingWidget.refresh) !== null && _editingWidget_refresh !== void 0 ? _editingWidget_refresh : 10,
                    show_title: editingWidget.show_title !== false
                });
                setIconSearch("");
                var _editingWidget_icon1;
                setVacuumIconSearch(editingWidget.type === "vacuum_card" ? (_editingWidget_icon1 = editingWidget.icon) !== null && _editingWidget_icon1 !== void 0 ? _editingWidget_icon1 : "" : "");
                var _editingWidget_icon2;
                setSensorIconSearch(editingWidget.type === "sensor_card" ? (_editingWidget_icon2 = editingWidget.icon) !== null && _editingWidget_icon2 !== void 0 ? _editingWidget_icon2 : "" : "");
                var _editingWidget_icon3;
                setPillIconSearch(editingWidget.type === "pill_card" ? (_editingWidget_icon3 = editingWidget.icon) !== null && _editingWidget_icon3 !== void 0 ? _editingWidget_icon3 : "" : "");
                setGroupAddEntitySearch("");
                setEditEntitySearch("");
                if (editingWidget.type === "sensor_card") setSensorCardEditTab("general");
                if (editingWidget.type === "room_card") setRoomCardEditTab("algemeen");
            }
        }
    }["DashboardEditPage.useEffect"], [
        editingWidget,
        editingGroupChildId
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
    const requestRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"])({
        "DashboardEditPage.useEntityStateStore[requestRefresh]": (s)=>s.requestRefresh
    }["DashboardEditPage.useEntityStateStore[requestRefresh]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardEditPage.useEffect": ()=>{
            if (!data) return;
            const w = parseWidgets(data.widgets);
            if (w.some({
                "DashboardEditPage.useEffect": (x)=>x.type === "stat_pill_card"
            }["DashboardEditPage.useEffect"])) requestRefresh();
        }
    }["DashboardEditPage.useEffect"], [
        data,
        requestRefresh
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardEditPage.useEffect": ()=>{
            if (error && id) router.replace("/dashboards");
        }
    }["DashboardEditPage.useEffect"], [
        error,
        id,
        router
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
                return type === "media_card" || type === "climate_card" || type === "climate_card_2" || type === "title_card" || type === "pill_card" || type === "room_card" || type === "nuts_card" || type === "card_group";
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
        return type !== "media_card" && type !== "climate_card" && type !== "climate_card_2" && type !== "light_card" && type !== "solar_card" && type !== "energy_monitor_card" && type !== "stat_pill_card" && type !== "sensor_card" && type !== "weather_card" && type !== "vacuum_card" && type !== "camera_card" && type !== "title_card" && type !== "pill_card" && type !== "room_card" && type !== "nuts_card" && type !== "card_group";
    });
    const layoutMap = new Map(layout.map((item)=>[
            item.i,
            item
        ]));
    const handleSave = ()=>{
        setEditingWidgetId(null);
        setEditingGroupChildId(null);
        setEditMode(false);
        saveMutation.mutate({
            layout,
            widgets,
            welcomeTitle,
            welcomeSubtitle
        });
    };
    function handleAddTile(type, entityId, titleOverride) {
        const newId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateId"])();
        const newWidget = {
            id: newId,
            type,
            title: titleOverride !== null && titleOverride !== void 0 ? titleOverride : type.replace(/_/g, " "),
            entity_id: entityId,
            ...type === "card_group" && {
                children: [],
                alignment: "start"
            }
        };
        const maxY = layout.length === 0 ? 0 : Math.max(...layout.map((item)=>item.y + item.h));
        const isTitleCard = type === "title_card";
        const newLayoutItem = {
            i: newId,
            x: 0,
            y: maxY,
            w: isTitleCard ? 12 : 4,
            h: isTitleCard ? 1 : 2
        };
        const newWidgets = [
            ...widgets,
            newWidget
        ];
        const newLayout = type === "solar_card" || type === "energy_monitor_card" || type === "sensor_card" || type === "weather_card" || type === "climate_card" || type === "climate_card_2" || type === "light_card" || type === "vacuum_card" || type === "camera_card" || type === "title_card" || type === "pill_card" || type === "room_card" || type === "nuts_card" || type === "card_group" ? layout : [
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
        return type === "room_card" || type === "nuts_card" || type === "energy_monitor_card" || type === "stat_pill_card" ? newId : undefined;
    }
    const domain = addTileSelectedType ? WIDGET_TYPE_DOMAIN[addTileSelectedType] : null;
    const entitiesToShow = addTileSelectedType === "pill_card" ? entities.filter((e)=>PILL_CARD_DOMAINS.some((d)=>e.entity_id.startsWith(d + "."))) : domain != null ? entities.filter((e)=>e.entity_id.startsWith(domain + ".")) : entities;
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
                lineNumber: 686,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
            lineNumber: 685,
            columnNumber: 7
        }, this);
    }
    if (isLoading || error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$app$2d$shell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppShell"], {
            activeTab: "/dashboards",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500",
                children: error ? "Dashboard not found, redirecting…" : "Loading…"
            }, void 0, false, {
                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                lineNumber: 694,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
            lineNumber: 693,
            columnNumber: 7
        }, this);
    }
    const headerEndAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: editMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setAddTileOpen(true),
                            className: "flex h-8 w-8 items-center justify-center rounded-full text-white hover:opacity-90",
                            style: {
                                backgroundColor: "#4D2FB2"
                            },
                            "aria-label": "Kaart toevoegen",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                lineNumber: 713,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                            lineNumber: 706,
                            columnNumber: 13
                        }, this),
                        addTileOpen && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "fixed inset-0 z-[300] bg-black/50 backdrop-blur-xl",
                                    "aria-hidden": true,
                                    onClick: ()=>{
                                        setAddTileOpen(false);
                                        setAddTileStep("type");
                                        setAddTileSelectedType(null);
                                        setAddTileEntitySearch("");
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                    lineNumber: 717,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "fixed left-1/2 top-1/2 z-[301] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-black/50 dark:backdrop-blur-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-sm font-semibold text-gray-900 dark:text-gray-100",
                                                    children: addTileStep === "type" ? "Kaart toevoegen" : "Kies entity"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 729,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        setAddTileOpen(false);
                                                        setAddTileStep("type");
                                                        setAddTileSelectedType(null);
                                                        setAddTileEntitySearch("");
                                                    },
                                                    className: "p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-400",
                                                    "aria-label": "Sluiten",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        className: "h-5 w-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                        lineNumber: 743,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 732,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 728,
                                            columnNumber: 19
                                        }, this),
                                        addTileStep === "type" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-3 gap-2",
                                            children: ADDABLE_WIDGET_TILES.map((param)=>{
                                                let { type, label, Icon } = param;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        if (type === "title_card") {
                                                            handleAddTile("title_card", "", "Titel");
                                                            setAddTileOpen(false);
                                                            return;
                                                        }
                                                        if (type === "card_group") {
                                                            handleAddTile("card_group", "", "Kaartgroep");
                                                            setAddTileOpen(false);
                                                            return;
                                                        }
                                                        if (type === "room_card") {
                                                            const newId = handleAddTile("room_card", "", "Kamer");
                                                            if (newId) setEditingWidgetId(newId);
                                                            return;
                                                        }
                                                        if (type === "energy_monitor_card") {
                                                            const newId = handleAddTile("energy_monitor_card", "", "Afbeeldingskaart");
                                                            if (newId) setEditingWidgetId(newId);
                                                            setAddTileOpen(false);
                                                            return;
                                                        }
                                                        setAddTileSelectedType(type);
                                                        setAddTileStep("entity");
                                                    },
                                                    className: "flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 py-4 px-3 transition-colors hover:border-[#4D2FB2]/40 hover:bg-[#4D2FB2]/5 dark:border-white/10 dark:bg-white/5 dark:hover:border-[#4D2FB2]/50 dark:hover:bg-[#4D2FB2]/10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                            className: "h-7 w-7 text-gray-600 dark:text-gray-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 779,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-medium text-gray-700 dark:text-gray-200 text-center leading-tight",
                                                            children: label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 780,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, type, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 749,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 747,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col max-h-[60vh]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>{
                                                        setAddTileStep("type");
                                                        setAddTileSelectedType(null);
                                                        setAddTileEntitySearch("");
                                                    },
                                                    className: "mb-3 self-start px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg",
                                                    children: "← Terug"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 788,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: addTileEntitySearch,
                                                    onChange: (e)=>setAddTileEntitySearch(e.target.value),
                                                    placeholder: "Zoek op naam of entity_id (bijv. sensor.woonkamer)…",
                                                    className: "mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500",
                                                    autoFocus: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 799,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5 max-h-[50vh]",
                                                    children: (()=>{
                                                        const q = addTileEntitySearch.trim().toLowerCase();
                                                        const filtered = q ? entitiesToShow.filter((e)=>{
                                                            var _this;
                                                            var _friendly_name;
                                                            const name = ((_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id).toLowerCase();
                                                            return name.includes(q) || e.entity_id.toLowerCase().includes(q);
                                                        }) : entitiesToShow;
                                                        if (filtered.length === 0) {
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center",
                                                                children: entitiesToShow.length === 0 ? "Geen entities gevonden. Controleer je HA-verbinding in Instellingen." : "Geen resultaten voor je zoekopdracht."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 819,
                                                                columnNumber: 31
                                                            }, this);
                                                        }
                                                        return filtered.map((e)=>{
                                                            var _this;
                                                            var _friendly_name;
                                                            const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    if (addTileSelectedType) {
                                                                        var _this;
                                                                        var _friendly_name;
                                                                        const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                                        const titleOverride = addTileSelectedType === "nuts_card" ? name || "Gas" : addTileSelectedType === "energy_monitor_card" ? name || "Afbeeldingskaart" : addTileSelectedType === "stat_pill_card" ? name || "Stat" : undefined;
                                                                        const newId = handleAddTile(addTileSelectedType, e.entity_id, titleOverride);
                                                                        if ((addTileSelectedType === "nuts_card" || addTileSelectedType === "stat_pill_card") && newId) setEditingWidgetId(newId);
                                                                    }
                                                                    setAddTileOpen(false);
                                                                    setAddTileStep("type");
                                                                    setAddTileSelectedType(null);
                                                                    setAddTileEntitySearch("");
                                                                },
                                                                className: "block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10 truncate",
                                                                title: e.entity_id,
                                                                children: name
                                                            }, e.entity_id, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 831,
                                                                columnNumber: 31
                                                            }, this);
                                                        });
                                                    })()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 807,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 787,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                    lineNumber: 727,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true), document.body)
                    ]
                }, void 0, true),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-[60]",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleSave,
                        disabled: saveMutation.isPending,
                        className: "flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-white/20",
                        "aria-label": "Done editing",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                            lineNumber: 870,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 863,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                    lineNumber: 862,
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
                lineNumber: 882,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
            lineNumber: 875,
            columnNumber: 9
        }, this)
    }, void 0, false);
    const hasCardGroup = widgets.some((w)=>w.type === "card_group");
    var _editForm_conditions, _editingWidget_children, _editForm_light_entity_id, _editForm_icon_background_color, _editForm_background_image, _editForm_width, _editForm_height, _editForm_icon, _editForm_humidity_entity_id, _editForm_width1, _editForm_height1, _editForm_consumption_entity_id, _editForm_background_image1, _editForm_background_image_dark, _editForm_minimal, _editForm_scale, _editForm_scale1, _editForm_image_conditions, _editForm_label, _editForm_icon1, _editForm_color, _editForm_conditions1, _editForm_script_ids, _editForm_script_ids1, _editForm_cleaned_area_entity_id, _editForm_size, _editForm_conditions2, _editForm_conditions3, _editForm_refresh, _editForm_width2, _editForm_height2, _editForm_width3, _editForm_height3, _editForm_icon_background_color1, _editForm_width4, _editForm_height4, _editForm_entity_id, _editForm_current_entity_id, _editForm_max_value;
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
        contentNoScroll: hasCardGroup,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6 overflow-x-hidden min-h-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$offline$2d$pill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OfflinePill"], {}, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 905,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                    lineNumber: 904,
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
                        children: widgets.filter((w)=>w.type !== "media_card" && w.type !== "climate_card" && w.type !== "climate_card_2" && w.type !== "light_card" && w.type !== "solar_card" && w.type !== "energy_monitor_card" && w.type !== "stat_pill_card" && w.type !== "weather_card" && w.type !== "vacuum_card" && w.type !== "camera_card" && w.type !== "title_card" && w.type !== "pill_card" && w.type !== "room_card" && w.type !== "nuts_card" && w.type !== "card_group").map((w)=>{
                            const item = layoutMap.get(w.id);
                            if (!item) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-full w-full",
                                ...!editMode && {
                                    onPointerDown: startLongPressForEdit,
                                    onPointerUp: clearLongPressTimerAndRelease,
                                    onPointerLeave: clearLongPressTimerAndRelease,
                                    onPointerCancel: clearLongPressTimerAndRelease,
                                    onContextMenu: (e)=>e.preventDefault(),
                                    style: {
                                        touchAction: "none"
                                    }
                                },
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
                                                    lineNumber: 948,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                lineNumber: 942,
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
                                                    lineNumber: 956,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                lineNumber: 950,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-full w-full", editMode && "tile-drag-handle cursor-grab touch-none"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WidgetByType, {
                                            type: w.type,
                                            title: w.title,
                                            entity_id: w.entity_id,
                                            consumption_entity_id: w.consumption_entity_id,
                                            humidity_entity_id: w.humidity_entity_id,
                                            show_icon: w.show_icon,
                                            script_ids: w.script_ids,
                                            script_names: w.script_names,
                                            cleaned_area_entity_id: w.cleaned_area_entity_id,
                                            light_entity_id: w.light_entity_id,
                                            background_image: w.background_image,
                                            background_image_dark: w.background_image_dark,
                                            image_conditions: w.image_conditions,
                                            icon: w.icon,
                                            size: w.size,
                                            conditions: w.conditions,
                                            current_entity_id: w.current_entity_id,
                                            max_value: w.max_value,
                                            grid_entity_id: w.grid_entity_id,
                                            minimal: w.minimal,
                                            label: w.label,
                                            color: w.color
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 961,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                        lineNumber: 960,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, w.id, true, {
                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                lineNumber: 928,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 909,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                    lineNumber: 908,
                    columnNumber: 9
                }, this),
                (()=>{
                    const firstMedia = widgets.find((w)=>w.type === "media_card");
                    var _firstMedia_title;
                    return firstMedia ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$media$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingMediaCard"], {
                        title: (_firstMedia_title = firstMedia.title) !== null && _firstMedia_title !== void 0 ? _firstMedia_title : "Media",
                        entity_id: firstMedia.entity_id,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(firstMedia.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstMedia.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 995,
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
                                humidity_entity_id: w.humidity_entity_id,
                                icon: w.icon,
                                type: w.type === "climate_card_2" ? "climate_card_2" : "climate_card",
                                width: w.width,
                                height: w.height
                            };
                        }),
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? (id)=>setEditingWidgetId(id) : undefined,
                        onRemove: editMode ? (id)=>handleRemoveTile(id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1019,
                        columnNumber: 13
                    }, this) : null;
                })(),
                widgets.filter((w)=>w.type === "light_card").map((w, i)=>{
                    var _w_title;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$light$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingLightCard"], {
                        widget: {
                            id: w.id,
                            title: (_w_title = w.title) !== null && _w_title !== void 0 ? _w_title : "Lamp",
                            entity_id: w.entity_id,
                            icon: w.icon
                        },
                        widgetIndex: i,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: ()=>{
                            setEditMode(true);
                            setEditingWidgetId(w.id);
                        },
                        onRemove: editMode ? ()=>handleRemoveTile(w.id) : undefined
                    }, w.id, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1041,
                        columnNumber: 13
                    }, this);
                }),
                (()=>{
                    const firstSolar = widgets.find((w)=>w.type === "solar_card");
                    var _firstSolar_title;
                    return firstSolar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$solar$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingSolarCard"], {
                        title: (_firstSolar_title = firstSolar.title) !== null && _firstSolar_title !== void 0 ? _firstSolar_title : "Zonnepanelen",
                        entity_id: firstSolar.entity_id,
                        consumption_entity_id: firstSolar.consumption_entity_id,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(firstSolar.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstSolar.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1063,
                        columnNumber: 13
                    }, this) : null;
                })(),
                (()=>{
                    const firstEnergyMonitor = widgets.find((w)=>w.type === "energy_monitor_card");
                    var _firstEnergyMonitor_title;
                    return firstEnergyMonitor ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$energy$2d$monitor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingEnergyMonitorCard"], {
                        title: (_firstEnergyMonitor_title = firstEnergyMonitor.title) !== null && _firstEnergyMonitor_title !== void 0 ? _firstEnergyMonitor_title : "Afbeeldingskaart",
                        entity_id: firstEnergyMonitor.entity_id,
                        background_image: firstEnergyMonitor.background_image,
                        background_image_dark: firstEnergyMonitor.background_image_dark,
                        image_conditions: firstEnergyMonitor.image_conditions,
                        minimal: firstEnergyMonitor.minimal,
                        scale: firstEnergyMonitor.scale,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(firstEnergyMonitor.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstEnergyMonitor.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1086,
                        columnNumber: 13
                    }, this) : null;
                })(),
                typeof document !== "undefined" && widgets.some((w)=>w.type === "stat_pill_card") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(widgets.filter((w)=>w.type === "stat_pill_card").map((w, i)=>{
                    var _w_title, _ref, _ref1;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$stat$2d$pill$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingStatPillCard"], {
                        widgetId: w.id,
                        widgetIndex: i,
                        title: (_w_title = w.title) !== null && _w_title !== void 0 ? _w_title : "Stat",
                        entity_id: w.entity_id,
                        label: w.label,
                        icon: w.icon,
                        color: (_ref = w.color) !== null && _ref !== void 0 ? _ref : "amber",
                        conditions: w.conditions,
                        size: (_ref1 = w.size) !== null && _ref1 !== void 0 ? _ref1 : "md",
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(w.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(w.id) : undefined
                    }, w.id, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1116,
                        columnNumber: 17
                    }, this);
                }), document.body),
                typeof document !== "undefined" && widgets.some((w)=>w.type === "sensor_card") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(widgets.filter((w)=>w.type === "sensor_card").map((w, i)=>{
                    var _w_title, _ref;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$sensor$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingSensorCard"], {
                        widgetId: w.id,
                        widgetIndex: i,
                        title: (_w_title = w.title) !== null && _w_title !== void 0 ? _w_title : "Sensor",
                        entity_id: w.entity_id,
                        icon: w.icon,
                        show_icon: w.show_icon !== false,
                        size: (_ref = w.size) !== null && _ref !== void 0 ? _ref : "md",
                        conditions: w.conditions,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(w.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(w.id) : undefined
                    }, w.id, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1142,
                        columnNumber: 17
                    }, this);
                }), document.body),
                (()=>{
                    const firstWeather = widgets.find((w)=>w.type === "weather_card");
                    var _firstWeather_title;
                    return firstWeather ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$weather$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingWeatherCard"], {
                        title: (_firstWeather_title = firstWeather.title) !== null && _firstWeather_title !== void 0 ? _firstWeather_title : "Weather",
                        entity_id: firstWeather.entity_id,
                        show_icon: firstWeather.show_icon,
                        width: firstWeather.width,
                        height: firstWeather.height,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(firstWeather.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstWeather.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1164,
                        columnNumber: 13
                    }, this) : null;
                })(),
                (()=>{
                    const firstCamera = widgets.find((w)=>w.type === "camera_card");
                    var _firstCamera_title;
                    return firstCamera ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$camera$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingCameraCard"], {
                        title: (_firstCamera_title = firstCamera.title) !== null && _firstCamera_title !== void 0 ? _firstCamera_title : "Camera",
                        entity_id: firstCamera.entity_id,
                        refresh: firstCamera.refresh,
                        show_title: firstCamera.show_title,
                        width: firstCamera.width,
                        height: firstCamera.height,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(firstCamera.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstCamera.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1189,
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
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(firstVacuum.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(firstVacuum.id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1215,
                        columnNumber: 13
                    }, this) : null;
                })(),
                widgets.filter((w)=>w.type === "room_card").map((w, i)=>{
                    var _w_title;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$room$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingRoomCard"], {
                        widget: {
                            id: w.id,
                            title: (_w_title = w.title) !== null && _w_title !== void 0 ? _w_title : "Kamer",
                            entity_id: w.entity_id,
                            icon: w.icon,
                            light_entity_id: w.light_entity_id,
                            background_image: w.background_image,
                            icon_background_color: w.icon_background_color,
                            width: w.width,
                            height: w.height
                        },
                        widgetIndex: i,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(w.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(w.id) : undefined
                    }, w.id, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1241,
                        columnNumber: 13
                    }, this);
                }),
                widgets.filter((w)=>w.type === "nuts_card").map((w, i)=>{
                    var _w_title, _w_width, _w_height;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$nuts$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingNutsCard"], {
                        widget: {
                            id: w.id,
                            title: (_w_title = w.title) !== null && _w_title !== void 0 ? _w_title : "Gas",
                            entity_id: w.entity_id,
                            current_entity_id: w.current_entity_id,
                            icon: w.icon,
                            icon_background_color: w.icon_background_color,
                            max_value: w.max_value,
                            width: (_w_width = w.width) !== null && _w_width !== void 0 ? _w_width : 250,
                            height: (_w_height = w.height) !== null && _w_height !== void 0 ? _w_height : 130
                        },
                        widgetIndex: i,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(w.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(w.id) : undefined
                    }, w.id, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1265,
                        columnNumber: 13
                    }, this);
                }),
                (()=>{
                    const titleCards = widgets.filter((w)=>w.type === "title_card");
                    return titleCards.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$title$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingTitleCard"], {
                        widgets: titleCards.map((w)=>{
                            var _w_title;
                            return {
                                id: w.id,
                                title: (_w_title = w.title) !== null && _w_title !== void 0 ? _w_title : "Titel"
                            };
                        }),
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? (id)=>setEditingWidgetId(id) : undefined,
                        onRemove: editMode ? (id)=>handleRemoveTile(id) : undefined
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1289,
                        columnNumber: 13
                    }, this) : null;
                })(),
                widgets.filter((w)=>w.type === "pill_card").map((w, i)=>{
                    var _w_title;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$pill$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingPillCard"], {
                        widget: {
                            id: w.id,
                            title: (_w_title = w.title) !== null && _w_title !== void 0 ? _w_title : "Pill",
                            entity_id: w.entity_id,
                            icon: w.icon,
                            conditions: w.conditions,
                            show_state: w.show_state
                        },
                        widgetIndex: i,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(w.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(w.id) : undefined
                    }, w.id, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1305,
                        columnNumber: 13
                    }, this);
                }),
                typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(widgets.filter((w)=>w.type === "card_group").map((g, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$floating$2d$card$2d$group$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FloatingCardGroup"], {
                        group: g,
                        widgetIndex: i,
                        editMode: editMode,
                        onEnterEditMode: ()=>setEditMode(true),
                        onEdit: editMode ? ()=>setEditingWidgetId(g.id) : undefined,
                        onRemove: editMode ? ()=>handleRemoveTile(g.id) : undefined
                    }, g.id, false, {
                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                        lineNumber: 1328,
                        columnNumber: 17
                    }, this)), document.body),
                editingWidgetId && editingWidget && typeof document !== "undefined" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 z-40 bg-black/50 backdrop-blur-xl",
                            "aria-hidden": true,
                            onClick: ()=>{
                                if ((editingWidget === null || editingWidget === void 0 ? void 0 : editingWidget.type) === "card_group" && editingGroupChildId) {
                                    setEditingGroupChildId(null);
                                } else {
                                    setEditingWidgetId(null);
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                            lineNumber: 1343,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-black/50 dark:backdrop-blur-xl max-h-[90vh] flex flex-col", editingWidget.type === "room_card" ? "max-w-md" : "max-w-sm"),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "mb-3 shrink-0 text-sm font-semibold text-gray-900 dark:text-gray-100",
                                    children: editingWidget.type === "title_card" ? "Titel bewerken" : editingWidget.type === "card_group" ? editingGroupChildId ? "Kaart in groep bewerken" : "Kaartgroep bewerken" : editingWidget.type === "room_card" ? "Kamer bewerken" : "Edit tile"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                    lineNumber: 1358,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3 overflow-y-auto min-h-0 flex-1 pr-1 -mr-1",
                                    children: [
                                        editingWidget.type === "title_card" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                    children: "Tekst"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1372,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: editForm.title,
                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                ...prev,
                                                                title: e.target.value
                                                            })),
                                                    placeholder: "Bijv. Woonkamer, Verlichting",
                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1375,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 1371,
                                            columnNumber: 19
                                        }, this) : editingWidget.type === "card_group" ? editingGroupChildId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Naam"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1389,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: editForm.title,
                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                        ...prev,
                                                                        title: e.target.value
                                                                    })),
                                                            placeholder: "Bijv. Woonkamer, Verlichting",
                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1390,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1388,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Entity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1399,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: editForm.entity_id,
                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                        ...prev,
                                                                        entity_id: e.target.value
                                                                    })),
                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500",
                                                            children: entities.filter((e)=>PILL_CARD_DOMAINS.some((d)=>e.entity_id.startsWith(d + "."))).map((e)=>{
                                                                var _this;
                                                                var _friendly_name;
                                                                const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: e.entity_id,
                                                                    children: name
                                                                }, e.entity_id, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1410,
                                                                    columnNumber: 33
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1400,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1398,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "flex items-center justify-between gap-3 cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                                            children: "Toon entiteitstatus"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1418,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            role: "switch",
                                                            "aria-checked": editForm.show_state !== false,
                                                            onClick: ()=>setEditForm((prev)=>({
                                                                        ...prev,
                                                                        show_state: prev.show_state === false
                                                                    })),
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex h-6 w-11 shrink-0 rounded-full border border-gray-200 dark:border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D2FB2] focus:ring-offset-2 dark:focus:ring-offset-gray-900", editForm.show_state !== false ? "bg-[#4D2FB2] border-transparent" : "bg-gray-200 dark:bg-gray-600"),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition translate-x-0.5", editForm.show_state !== false ? "translate-x-5" : "translate-x-1")
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 1429,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1419,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1417,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Icoon"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1438,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: pillIconSearch,
                                                            onChange: (e)=>setPillIconSearch(e.target.value),
                                                            onFocus: ()=>{
                                                                var _editForm_icon;
                                                                return setPillIconSearch(pillIconSearch || ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : ""));
                                                            },
                                                            placeholder: "Zoek icoon (bijv. CircleDot, Sun…)",
                                                            className: "mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1439,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>{
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                icon: undefined
                                                                            }));
                                                                        setPillIconSearch("");
                                                                    },
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", !editForm.icon ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                    children: "Default (CircleDot)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1448,
                                                                    columnNumber: 27
                                                                }, this),
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__CARD_ICON_OPTIONS__as__SENSOR_ICON_OPTIONS$3e$__["SENSOR_ICON_OPTIONS"].filter((name)=>name.toLowerCase().includes((pillIconSearch || "").toLowerCase())).map((name)=>{
                                                                    var _editForm_icon;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>{
                                                                            setEditForm((prev)=>({
                                                                                    ...prev,
                                                                                    icon: name
                                                                                }));
                                                                            setPillIconSearch(name);
                                                                        },
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : "CircleDot") === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                        children: name
                                                                    }, name, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1462,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1447,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1437,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "mb-1 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Voorwaardelijke kleur (eerste match)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1480,
                                                            columnNumber: 25
                                                        }, this),
                                                        ((_editForm_conditions = editForm.conditions) !== null && _editForm_conditions !== void 0 ? _editForm_conditions : []).map((cond, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-1.5",
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
                                                                        className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs",
                                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATORS"].map((op)=>{
                                                                            var _SENSOR_CONDITION_OPERATOR_LABELS_op;
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: op,
                                                                                children: (_SENSOR_CONDITION_OPERATOR_LABELS_op = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATOR_LABELS"][op]) !== null && _SENSOR_CONDITION_OPERATOR_LABELS_op !== void 0 ? _SENSOR_CONDITION_OPERATOR_LABELS_op : op
                                                                            }, op, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 1494,
                                                                                columnNumber: 33
                                                                            }, this);
                                                                        })
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1483,
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
                                                                        className: "w-20 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1499,
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
                                                                        className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs",
                                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_COLORS"].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: color,
                                                                                children: color
                                                                            }, color, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 1522,
                                                                                columnNumber: 33
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1511,
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
                                                                            lineNumber: 1538,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1527,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 1482,
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
                                                                                operator: "eq",
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
                                                            lineNumber: 1542,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1479,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-medium text-gray-500 dark:text-gray-400",
                                                    children: "Uitlijning"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1558,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5",
                                                    children: [
                                                        "start",
                                                        "center",
                                                        "end",
                                                        "between"
                                                    ].map((align)=>{
                                                        var _editingWidget_alignment;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                const nextWidgets = widgets.map((w)=>w.id === editingWidget.id ? {
                                                                        ...w,
                                                                        alignment: align
                                                                    } : w);
                                                                setWidgets(nextWidgets);
                                                                saveMutation.mutate({
                                                                    layout,
                                                                    widgets: nextWidgets,
                                                                    welcomeTitle,
                                                                    welcomeSubtitle
                                                                });
                                                            },
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", ((_editingWidget_alignment = editingWidget.alignment) !== null && _editingWidget_alignment !== void 0 ? _editingWidget_alignment : "start") === align ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                            children: align === "start" ? "Links" : align === "center" ? "Midden" : align === "end" ? "Rechts" : "Tussen"
                                                        }, align, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1561,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1559,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-medium text-gray-500 dark:text-gray-400 pt-1",
                                                    children: "Kaarten in groep"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1580,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "space-y-1 max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5",
                                                    children: ((_editingWidget_children = editingWidget.children) !== null && _editingWidget_children !== void 0 ? _editingWidget_children : []).map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-center justify-between gap-2 px-3 py-2 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "truncate text-gray-900 dark:text-gray-100",
                                                                    children: c.title || c.entity_id
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1584,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-1 shrink-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>setEditingGroupChildId(c.id),
                                                                            className: "p-1 rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10",
                                                                            "aria-label": "Bewerken",
                                                                            title: "Kaart bewerken",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                                                className: "h-4 w-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 1593,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1586,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>{
                                                                                var _editingWidget_children;
                                                                                const nextChildren = ((_editingWidget_children = editingWidget.children) !== null && _editingWidget_children !== void 0 ? _editingWidget_children : []).filter((x)=>x.id !== c.id);
                                                                                const nextWidgets = widgets.map((w)=>w.id === editingWidget.id ? {
                                                                                        ...w,
                                                                                        children: nextChildren
                                                                                    } : w);
                                                                                setWidgets(nextWidgets);
                                                                                saveMutation.mutate({
                                                                                    layout,
                                                                                    widgets: nextWidgets,
                                                                                    welcomeTitle,
                                                                                    welcomeSubtitle
                                                                                });
                                                                            },
                                                                            className: "p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                                                                            "aria-label": "Verwijderen",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                className: "h-4 w-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 1606,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1595,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1585,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, c.id, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1583,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1581,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-medium text-gray-500 dark:text-gray-400",
                                                    children: "Kaart toevoegen"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1612,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: groupAddEntitySearch,
                                                    onChange: (e)=>setGroupAddEntitySearch(e.target.value),
                                                    placeholder: "Zoek op naam of entity_id (bijv. sensor.woonkamer)…",
                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1613,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "max-h-40 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5",
                                                    children: entities.filter((e)=>PILL_CARD_DOMAINS.some((d)=>e.entity_id.startsWith(d + "."))).filter((e)=>{
                                                        var _this;
                                                        const q = groupAddEntitySearch.trim().toLowerCase();
                                                        if (!q) return true;
                                                        var _friendly_name;
                                                        const name = ((_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id).toLowerCase();
                                                        return name.includes(q) || e.entity_id.toLowerCase().includes(q);
                                                    }).map((e)=>{
                                                        var _this;
                                                        var _friendly_name;
                                                        const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>{
                                                                const newPill = {
                                                                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateId"])(),
                                                                    type: "pill_card",
                                                                    title: name,
                                                                    entity_id: e.entity_id
                                                                };
                                                                var _editingWidget_children;
                                                                const nextChildren = [
                                                                    ...(_editingWidget_children = editingWidget.children) !== null && _editingWidget_children !== void 0 ? _editingWidget_children : [],
                                                                    newPill
                                                                ];
                                                                const nextWidgets = widgets.map((w)=>w.id === editingWidget.id ? {
                                                                        ...w,
                                                                        children: nextChildren
                                                                    } : w);
                                                                setWidgets(nextWidgets);
                                                                saveMutation.mutate({
                                                                    layout,
                                                                    widgets: nextWidgets,
                                                                    welcomeTitle,
                                                                    welcomeSubtitle
                                                                });
                                                                setGroupAddEntitySearch("");
                                                            },
                                                            className: "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white/10 truncate",
                                                            children: name
                                                        }, e.entity_id, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1632,
                                                            columnNumber: 29
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1620,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 1557,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1660,
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
                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1663,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1659,
                                                    columnNumber: 17
                                                }, this),
                                                (editingWidget.entity_id != null || editingWidget.type === "energy_monitor_card") && editingWidget.type !== "title_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: editingWidget.type === "solar_card" ? "Yield (opbrengst)" : editingWidget.type === "energy_monitor_card" ? "Entity voor voorwaarden (bijv. weather.home)" : editingWidget.type === "stat_pill_card" ? "Sensor" : "Entity"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1675,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: editEntitySearch,
                                                            onChange: (e)=>setEditEntitySearch(e.target.value),
                                                            placeholder: "Zoek op naam of entity_id (bijv. sensor.woonkamer)…",
                                                            className: "mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1684,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: editForm.entity_id,
                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                        ...prev,
                                                                        entity_id: e.target.value
                                                                    })),
                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500",
                                                            children: (()=>{
                                                                let options = editingWidget.type === "pill_card" ? entities.filter((e)=>PILL_CARD_DOMAINS.some((d)=>e.entity_id.startsWith(d + "."))) : editingWidget.type === "room_card" ? entities : editingWidget.type === "energy_monitor_card" ? entities.filter((e)=>e.entity_id.startsWith("weather.") || e.entity_id.startsWith("sensor.")) : entities.filter((e)=>{
                                                                    var _WIDGET_TYPE_DOMAIN_editingWidget_type;
                                                                    return e.entity_id.startsWith(((_WIDGET_TYPE_DOMAIN_editingWidget_type = WIDGET_TYPE_DOMAIN[editingWidget.type]) !== null && _WIDGET_TYPE_DOMAIN_editingWidget_type !== void 0 ? _WIDGET_TYPE_DOMAIN_editingWidget_type : "sensor") + ".");
                                                                });
                                                                const q = editEntitySearch.trim().toLowerCase();
                                                                if (q) {
                                                                    options = options.filter((e)=>{
                                                                        var _this;
                                                                        var _friendly_name;
                                                                        const name = ((_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id).toLowerCase();
                                                                        return name.includes(q) || e.entity_id.toLowerCase().includes(q);
                                                                    });
                                                                    const currentId = editForm.entity_id;
                                                                    if (currentId && !options.some((e)=>e.entity_id === currentId)) {
                                                                        const current = entities.find((e)=>e.entity_id === currentId);
                                                                        if (current) options = [
                                                                            current,
                                                                            ...options
                                                                        ];
                                                                    }
                                                                }
                                                                const opts = options.map((e)=>{
                                                                    var _this;
                                                                    var _friendly_name;
                                                                    const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: e.entity_id,
                                                                        children: name
                                                                    }, e.entity_id, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 1734,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                });
                                                                if (editingWidget.type === "energy_monitor_card") {
                                                                    return [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Geen (alleen standaardafbeelding)"
                                                                        }, "", false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1740,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        ...opts
                                                                    ];
                                                                }
                                                                return opts;
                                                            })()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1691,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1674,
                                                    columnNumber: 19
                                                }, this),
                                                editingWidget.type === "light_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Icoon"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1749,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5",
                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$light$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LIGHT_ICON_OPTIONS"].map((key)=>{
                                                                const label = key === "lightbulb" ? "Lightbulb" : key === "spotlight" ? "Spotlight" : key === "lamp" ? "Lamp" : key === "lamp-ceiling" ? "Plafond" : key === "lamp-desk" ? "Bureau" : key === "lamp-floor" ? "Vloer" : key === "lamp-wall-down" ? "Wall down" : "Wall up";
                                                                var _editForm_icon;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                icon: key
                                                                            })),
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : "lightbulb") === key ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                    children: label
                                                                }, key, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1771,
                                                                    columnNumber: 27
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1752,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 1748,
                                                    columnNumber: 19
                                                }, this),
                                                editingWidget.type === "room_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-1 rounded-lg bg-gray-100 dark:bg-white/5 p-0.5 mb-2",
                                                            children: [
                                                                "algemeen",
                                                                "achtergrond",
                                                                "weergave"
                                                            ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>setRoomCardEditTab(tab),
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors", roomCardEditTab === tab ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"),
                                                                    children: tab === "algemeen" ? "Algemeen" : tab === "achtergrond" ? "Achtergrond" : "Weergave"
                                                                }, tab, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1795,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1793,
                                                            columnNumber: 21
                                                        }, this),
                                                        roomCardEditTab === "algemeen" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                            children: "Icoon"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1813,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            value: iconSearch || "",
                                                                            onChange: (e)=>setIconSearch(e.target.value),
                                                                            placeholder: "Zoek icoon...",
                                                                            className: "mb-1.5 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1814,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5 max-h-28 overflow-auto",
                                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICON_OPTIONS"].filter((name)=>name.toLowerCase().includes((iconSearch || "").toLowerCase())).map((name)=>{
                                                                                var _editForm_icon;
                                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    type: "button",
                                                                                    onClick: ()=>setEditForm((prev)=>({
                                                                                                ...prev,
                                                                                                icon: name
                                                                                            })),
                                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : "Home") === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                                    children: name
                                                                                }, name, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 1825,
                                                                                    columnNumber: 31
                                                                                }, this);
                                                                            })
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1821,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1812,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                            children: "Licht-entiteit (optioneel)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1842,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: (_editForm_light_entity_id = editForm.light_entity_id) !== null && _editForm_light_entity_id !== void 0 ? _editForm_light_entity_id : "",
                                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        light_entity_id: e.target.value || undefined
                                                                                    })),
                                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    children: "Geen"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 1848,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                entities.filter((e)=>e.entity_id.startsWith("light.") || e.entity_id.startsWith("group.")).map((e)=>{
                                                                                    var _this;
                                                                                    var _friendly_name;
                                                                                    const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: e.entity_id,
                                                                                        children: name
                                                                                    }, e.entity_id, false, {
                                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                        lineNumber: 1853,
                                                                                        columnNumber: 40
                                                                                    }, this);
                                                                                })
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1843,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1841,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                            children: "Kleur icoon-badge"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1858,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "color",
                                                                                    value: editForm.icon_background_color && /^#[0-9A-Fa-f]{6}$/.test(editForm.icon_background_color) ? editForm.icon_background_color : "#3B82F6",
                                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                                ...prev,
                                                                                                icon_background_color: e.target.value
                                                                                            })),
                                                                                    className: "h-10 w-14 cursor-pointer rounded border border-gray-200 dark:border-white/10 bg-transparent"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 1860,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    value: (_editForm_icon_background_color = editForm.icon_background_color) !== null && _editForm_icon_background_color !== void 0 ? _editForm_icon_background_color : "",
                                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                                ...prev,
                                                                                                icon_background_color: e.target.value || undefined
                                                                                            })),
                                                                                    placeholder: "#3B82F6",
                                                                                    className: "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 1866,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1859,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1857,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1811,
                                                            columnNumber: 23
                                                        }, this),
                                                        roomCardEditTab === "achtergrond" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-gray-500 dark:text-gray-400",
                                                                    children: "Upload een foto van de kamer of plak een URL (bijv. van een camera-feed)."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1879,
                                                                    columnNumber: 25
                                                                }, this),
                                                                editForm.background_image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-24 rounded-lg bg-cover bg-center border border-gray-200 dark:border-white/10",
                                                                    style: {
                                                                        backgroundImage: "url(".concat(editForm.background_image, ")")
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1883,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10",
                                                                            children: [
                                                                                uploadingRoomBg ? "Uploaden…" : "Upload afbeelding",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "file",
                                                                                    accept: "image/jpeg,image/png,image/webp,image/gif",
                                                                                    className: "sr-only",
                                                                                    onChange: async (e)=>{
                                                                                        var _e_target_files;
                                                                                        const file = (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0];
                                                                                        if (!file || !editingWidgetId) return;
                                                                                        e.target.value = "";
                                                                                        setUploadingRoomBg(true);
                                                                                        try {
                                                                                            const formData = new FormData();
                                                                                            formData.set("file", file);
                                                                                            const res = await fetch("/api/upload", {
                                                                                                method: "POST",
                                                                                                body: formData
                                                                                            });
                                                                                            const json = await res.json();
                                                                                            if (!res.ok) throw new Error(json.error || "Upload failed");
                                                                                            setEditForm((prev)=>({
                                                                                                    ...prev,
                                                                                                    background_image: json.url
                                                                                                }));
                                                                                        } finally{
                                                                                            setUploadingRoomBg(false);
                                                                                        }
                                                                                    },
                                                                                    disabled: uploadingRoomBg
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 1891,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1889,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        editForm.background_image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        background_image: undefined
                                                                                    })),
                                                                            className: "rounded-lg border border-gray-200 dark:border-white/10 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10",
                                                                            children: "Verwijderen"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1915,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1888,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "url",
                                                                    value: (_editForm_background_image = editForm.background_image) !== null && _editForm_background_image !== void 0 ? _editForm_background_image : "",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                background_image: e.target.value || undefined
                                                                            })),
                                                                    placeholder: "/uploads/... of https://...",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1924,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1878,
                                                            columnNumber: 23
                                                        }, this),
                                                        roomCardEditTab === "weergave" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                            children: "Breedte kaart (px)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1936,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            min: 200,
                                                                            max: 500,
                                                                            step: 10,
                                                                            value: (_editForm_width = editForm.width) !== null && _editForm_width !== void 0 ? _editForm_width : 280,
                                                                            onChange: (e)=>{
                                                                                const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                                setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        width: v != null && !Number.isNaN(v) ? v : undefined
                                                                                    }));
                                                                            },
                                                                            placeholder: "280",
                                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1937,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                            children: "200–500 px (standaard 280)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1950,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1935,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                            children: "Hoogte kaart (px)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1953,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "number",
                                                                            min: 80,
                                                                            max: 300,
                                                                            step: 10,
                                                                            value: (_editForm_height = editForm.height) !== null && _editForm_height !== void 0 ? _editForm_height : 120,
                                                                            onChange: (e)=>{
                                                                                const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                                setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        height: v != null && !Number.isNaN(v) ? v : undefined
                                                                                    }));
                                                                            },
                                                                            placeholder: "120",
                                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1954,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                            children: "80–300 px (standaard 120)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1967,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1952,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1934,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                (editingWidget.type === "climate_card_2" || editingWidget.type === "climate_card") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Icoon"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1976,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: (_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : "Thermometer",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                icon: e.target.value || undefined
                                                                            })),
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200",
                                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICON_OPTIONS"].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: opt,
                                                                            children: opt
                                                                        }, opt, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 1987,
                                                                            columnNumber: 27
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1979,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1975,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Luchtvochtigheid (optioneel)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1994,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: (_editForm_humidity_entity_id = editForm.humidity_entity_id) !== null && _editForm_humidity_entity_id !== void 0 ? _editForm_humidity_entity_id : "",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                humidity_entity_id: e.target.value || undefined
                                                                            })),
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Geen"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2007,
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
                                                                                lineNumber: 2015,
                                                                                columnNumber: 31
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 1997,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 1993,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Breedte kaart (px)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2023,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 200,
                                                                    max: 500,
                                                                    step: 10,
                                                                    value: (_editForm_width1 = editForm.width) !== null && _editForm_width1 !== void 0 ? _editForm_width1 : 320,
                                                                    onChange: (e)=>{
                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                width: v != null && !Number.isNaN(v) ? v : undefined
                                                                            }));
                                                                    },
                                                                    placeholder: "320",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2026,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                    children: "200–500 px (standaard 320)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2042,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2022,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Hoogte kaart (px)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2045,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 100,
                                                                    max: 400,
                                                                    step: 10,
                                                                    value: (_editForm_height1 = editForm.height) !== null && _editForm_height1 !== void 0 ? _editForm_height1 : 180,
                                                                    onChange: (e)=>{
                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                height: v != null && !Number.isNaN(v) ? v : undefined
                                                                            }));
                                                                    },
                                                                    placeholder: "180",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2048,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                    children: "100–400 px (standaard 180)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2064,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2044,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                editingWidget.type === "solar_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Consumption (verbruik, optioneel)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2070,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            value: (_editForm_consumption_entity_id = editForm.consumption_entity_id) !== null && _editForm_consumption_entity_id !== void 0 ? _editForm_consumption_entity_id : "",
                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                        ...prev,
                                                                        consumption_entity_id: e.target.value || undefined
                                                                    })),
                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "",
                                                                    children: "Geen"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2083,
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
                                                                        lineNumber: 2091,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2073,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 2069,
                                                    columnNumber: 19
                                                }, this),
                                                editingWidget.type === "energy_monitor_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Achtergrondafbeelding light mode (URL)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2102,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: (_editForm_background_image1 = editForm.background_image) !== null && _editForm_background_image1 !== void 0 ? _editForm_background_image1 : "",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                background_image: e.target.value || undefined
                                                                            })),
                                                                    placeholder: "/energy-house.png of https://...",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2105,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2101,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Achtergrondafbeelding dark mode (URL, optioneel)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2119,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: (_editForm_background_image_dark = editForm.background_image_dark) !== null && _editForm_background_image_dark !== void 0 ? _editForm_background_image_dark : "",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                background_image_dark: e.target.value || undefined
                                                                            })),
                                                                    placeholder: "Leeg =zelfde als light mode",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2122,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-xs text-gray-500 dark:text-gray-400",
                                                                    children: "Plaats afbeeldingen in public/ of gebruik externe URLs."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2134,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2118,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    id: "energy-minimal",
                                                                    checked: (_editForm_minimal = editForm.minimal) !== null && _editForm_minimal !== void 0 ? _editForm_minimal : false,
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                minimal: e.target.checked
                                                                            })),
                                                                    className: "rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2139,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "energy-minimal",
                                                                    className: "text-sm text-gray-700 dark:text-gray-300",
                                                                    children: "Minimalistisch (alleen afbeelding, geen titel of rand)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2148,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2138,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: [
                                                                        "Schaalfactor (",
                                                                        ((_editForm_scale = editForm.scale) !== null && _editForm_scale !== void 0 ? _editForm_scale : 1).toFixed(1),
                                                                        "×)"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2153,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "range",
                                                                    min: "0.5",
                                                                    max: "1.5",
                                                                    step: "0.1",
                                                                    value: (_editForm_scale1 = editForm.scale) !== null && _editForm_scale1 !== void 0 ? _editForm_scale1 : 1,
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                scale: parseFloat(e.target.value)
                                                                            })),
                                                                    className: "w-full"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2156,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2152,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Voorwaarden (afbeelding bij waarde)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2172,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mb-2 text-xs text-gray-500 dark:text-gray-400",
                                                                    children: "Eerste voorwaarde die klopt bepaalt de afbeelding. Bijv. sunny → zon.jpg, rainy → regen.jpg. Entity hierboven moet zijn ingesteld."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2175,
                                                                    columnNumber: 23
                                                                }, this),
                                                                ((_editForm_image_conditions = editForm.image_conditions) !== null && _editForm_image_conditions !== void 0 ? _editForm_image_conditions : []).map((cond, idx)=>{
                                                                    var _cond_image_dark;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-wrap items-start gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                value: cond.operator,
                                                                                onChange: (e)=>setEditForm((prev)=>{
                                                                                        var _prev_image_conditions;
                                                                                        return {
                                                                                            ...prev,
                                                                                            image_conditions: ((_prev_image_conditions = prev.image_conditions) !== null && _prev_image_conditions !== void 0 ? _prev_image_conditions : []).map((c, i)=>i === idx ? {
                                                                                                    ...c,
                                                                                                    operator: e.target.value
                                                                                                } : c)
                                                                                        };
                                                                                    }),
                                                                                className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs",
                                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATORS"].map((op)=>{
                                                                                    var _SENSOR_CONDITION_OPERATOR_LABELS_op;
                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: op,
                                                                                        children: (_SENSOR_CONDITION_OPERATOR_LABELS_op = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATOR_LABELS"][op]) !== null && _SENSOR_CONDITION_OPERATOR_LABELS_op !== void 0 ? _SENSOR_CONDITION_OPERATOR_LABELS_op : op
                                                                                    }, op, false, {
                                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                        lineNumber: 2193,
                                                                                        columnNumber: 31
                                                                                    }, this);
                                                                                })
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2180,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: cond.value,
                                                                                onChange: (e)=>setEditForm((prev)=>{
                                                                                        var _prev_image_conditions;
                                                                                        return {
                                                                                            ...prev,
                                                                                            image_conditions: ((_prev_image_conditions = prev.image_conditions) !== null && _prev_image_conditions !== void 0 ? _prev_image_conditions : []).map((c, i)=>i === idx ? {
                                                                                                    ...c,
                                                                                                    value: e.target.value
                                                                                                } : c)
                                                                                        };
                                                                                    }),
                                                                                placeholder: "Waarde (bijv. sunny)",
                                                                                className: "flex-1 min-w-[80px] rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2196,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: cond.image,
                                                                                onChange: (e)=>setEditForm((prev)=>{
                                                                                        var _prev_image_conditions;
                                                                                        return {
                                                                                            ...prev,
                                                                                            image_conditions: ((_prev_image_conditions = prev.image_conditions) !== null && _prev_image_conditions !== void 0 ? _prev_image_conditions : []).map((c, i)=>i === idx ? {
                                                                                                    ...c,
                                                                                                    image: e.target.value
                                                                                                } : c)
                                                                                        };
                                                                                    }),
                                                                                placeholder: "Afbeelding (URL)",
                                                                                className: "flex-1 min-w-[100px] rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2210,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: (_cond_image_dark = cond.image_dark) !== null && _cond_image_dark !== void 0 ? _cond_image_dark : "",
                                                                                onChange: (e)=>setEditForm((prev)=>{
                                                                                        var _prev_image_conditions;
                                                                                        return {
                                                                                            ...prev,
                                                                                            image_conditions: ((_prev_image_conditions = prev.image_conditions) !== null && _prev_image_conditions !== void 0 ? _prev_image_conditions : []).map((c, i)=>i === idx ? {
                                                                                                    ...c,
                                                                                                    image_dark: e.target.value || undefined
                                                                                                } : c)
                                                                                        };
                                                                                    }),
                                                                                placeholder: "Dark (optioneel)",
                                                                                className: "w-24 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2224,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>setEditForm((prev)=>{
                                                                                        var _prev_image_conditions;
                                                                                        return {
                                                                                            ...prev,
                                                                                            image_conditions: ((_prev_image_conditions = prev.image_conditions) !== null && _prev_image_conditions !== void 0 ? _prev_image_conditions : []).filter((_, i)=>i !== idx)
                                                                                        };
                                                                                    }),
                                                                                className: "p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                                    className: "h-3.5 w-3.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 2248,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2238,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, idx, true, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 2179,
                                                                        columnNumber: 25
                                                                    }, this);
                                                                }),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>setEditForm((prev)=>{
                                                                            var _prev_image_conditions;
                                                                            return {
                                                                                ...prev,
                                                                                image_conditions: [
                                                                                    ...(_prev_image_conditions = prev.image_conditions) !== null && _prev_image_conditions !== void 0 ? _prev_image_conditions : [],
                                                                                    {
                                                                                        operator: "eq",
                                                                                        value: "",
                                                                                        image: "",
                                                                                        image_dark: undefined
                                                                                    }
                                                                                ]
                                                                            };
                                                                        }),
                                                                    className: "rounded-lg border border-dashed border-gray-300 dark:border-white/20 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 w-full",
                                                                    children: "+ Voorwaarde toevoegen"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2252,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2171,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                editingWidget.type === "stat_pill_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Label (onder de waarde)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2270,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: (_editForm_label = editForm.label) !== null && _editForm_label !== void 0 ? _editForm_label : "",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                label: e.target.value || undefined
                                                                            })),
                                                                    placeholder: "Opbrengst, Verbruik, ...",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2273,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2269,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Icoon"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2284,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: (_editForm_icon1 = editForm.icon) !== null && _editForm_icon1 !== void 0 ? _editForm_icon1 : "Sun",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                icon: e.target.value || undefined
                                                                            })),
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200",
                                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICON_OPTIONS"].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: opt,
                                                                            children: opt
                                                                        }, opt, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2295,
                                                                            columnNumber: 27
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2287,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2283,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Kleur (standaard)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2302,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: (_editForm_color = editForm.color) !== null && _editForm_color !== void 0 ? _editForm_color : "amber",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                color: e.target.value
                                                                            })),
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "amber",
                                                                            children: "Amber (geel)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2315,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "purple",
                                                                            children: "Paars"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2316,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "emerald",
                                                                            children: "Smaragd (groen)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2317,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "red",
                                                                            children: "Rood"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2318,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2305,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2301,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Voorwaarden (kleur aanpassen bij waarde)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2322,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mb-2 text-xs text-gray-500 dark:text-gray-400",
                                                                    children: "Eerste voorwaarde die klopt bepaalt de kleur. Bijv. plastic = groen, papier = blauw."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2325,
                                                                    columnNumber: 23
                                                                }, this),
                                                                ((_editForm_conditions1 = editForm.conditions) !== null && _editForm_conditions1 !== void 0 ? _editForm_conditions1 : []).map((cond, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-2",
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
                                                                                className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs",
                                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATORS"].map((op)=>{
                                                                                    var _SENSOR_CONDITION_OPERATOR_LABELS_op;
                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: op,
                                                                                        children: (_SENSOR_CONDITION_OPERATOR_LABELS_op = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATOR_LABELS"][op]) !== null && _SENSOR_CONDITION_OPERATOR_LABELS_op !== void 0 ? _SENSOR_CONDITION_OPERATOR_LABELS_op : op
                                                                                    }, op, false, {
                                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                        lineNumber: 2346,
                                                                                        columnNumber: 31
                                                                                    }, this);
                                                                                })
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2333,
                                                                                columnNumber: 27
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
                                                                                placeholder: "Waarde (bijv. plastic)",
                                                                                className: "w-24 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2351,
                                                                                columnNumber: 27
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
                                                                                className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs",
                                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_COLORS"].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: color,
                                                                                        children: color
                                                                                    }, color, false, {
                                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                        lineNumber: 2378,
                                                                                        columnNumber: 31
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2365,
                                                                                columnNumber: 27
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
                                                                                    lineNumber: 2394,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2383,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, idx, true, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 2329,
                                                                        columnNumber: 25
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
                                                                                        operator: "eq",
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
                                                                    lineNumber: 2398,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2321,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                editingWidget.type === "vacuum_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                            children: "Vacuum Room (scripts)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2415,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 dark:text-gray-400 mb-2",
                                                            children: "Kies scripts en geef ze optioneel een weergavenaam."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2418,
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
                                                                                lineNumber: 2432,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm truncate shrink-0 max-w-[140px]",
                                                                                title: e.entity_id,
                                                                                children: defaultName
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2451,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, e.entity_id, true, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 2428,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                }),
                                                                entities.filter((e)=>e.entity_id.startsWith("script.")).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-gray-500 py-2",
                                                                    children: "Geen scripts gevonden. Sla eerst een verbinding op."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2456,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2421,
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
                                                                    lineNumber: 2461,
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
                                                                                lineNumber: 2467,
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
                                                                                className: "flex-1 min-w-0 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1.5 text-sm"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2468,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, scriptId, true, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 2466,
                                                                        columnNumber: 29
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2460,
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
                                                                    lineNumber: 2489,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: (_editForm_cleaned_area_entity_id = editForm.cleaned_area_entity_id) !== null && _editForm_cleaned_area_entity_id !== void 0 ? _editForm_cleaned_area_entity_id : "",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                cleaned_area_entity_id: e.target.value || undefined
                                                                            })),
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Geen"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2502,
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
                                                                                lineNumber: 2508,
                                                                                columnNumber: 31
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2492,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2488,
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
                                                                    lineNumber: 2516,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: vacuumIconSearch,
                                                                    onChange: (e)=>setVacuumIconSearch(e.target.value),
                                                                    onFocus: ()=>{
                                                                        var _editForm_icon;
                                                                        return setVacuumIconSearch(vacuumIconSearch || ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : ""));
                                                                    },
                                                                    placeholder: "Zoek icoon (bijv. home, bot, sparkles…)",
                                                                    className: "mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2519,
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
                                                                            lineNumber: 2528,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__CARD_ICON_OPTIONS__as__VACUUM_ICON_OPTIONS$3e$__["VACUUM_ICON_OPTIONS"].filter((name)=>name.toLowerCase().includes((vacuumIconSearch || "").toLowerCase())).map((name)=>{
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
                                                                                lineNumber: 2546,
                                                                                columnNumber: 27
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2527,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2515,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 2414,
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
                                                                    lineNumber: 2570,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>setSensorCardEditTab("conditions"),
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex-1 rounded-md py-1.5 text-xs font-medium transition-colors", sensorCardEditTab === "conditions" ? "bg-[#4D2FB2] text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"),
                                                                    children: "Conditionele voorwaarden"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2582,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2569,
                                                            columnNumber: 21
                                                        }, this),
                                                        sensorCardEditTab === "general" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Icoon"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2597,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: sensorIconSearch,
                                                                    onChange: (e)=>setSensorIconSearch(e.target.value),
                                                                    onFocus: ()=>{
                                                                        var _editForm_icon;
                                                                        return setSensorIconSearch(sensorIconSearch || ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : ""));
                                                                    },
                                                                    placeholder: "Zoek icoon (bijv. gauge, thermometer…)",
                                                                    className: "mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2600,
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
                                                                            lineNumber: 2609,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__CARD_ICON_OPTIONS__as__SENSOR_ICON_OPTIONS$3e$__["SENSOR_ICON_OPTIONS"].filter((name)=>name.toLowerCase().includes((sensorIconSearch || "").toLowerCase())).map((name)=>{
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
                                                                                lineNumber: 2627,
                                                                                columnNumber: 29
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2608,
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
                                                                            lineNumber: 2646,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            value: (_editForm_size = editForm.size) !== null && _editForm_size !== void 0 ? _editForm_size : "md",
                                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        size: e.target.value
                                                                                    })),
                                                                            className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "sm",
                                                                                    children: "Klein"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 2656,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "md",
                                                                                    children: "Normaal"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 2657,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "lg",
                                                                                    children: "Groot"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 2658,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2649,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2645,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-3 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            id: "sensor-show-icon",
                                                                            checked: editForm.show_icon !== false,
                                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        show_icon: e.target.checked
                                                                                    })),
                                                                            className: "rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2662,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            htmlFor: "sensor-show-icon",
                                                                            className: "text-sm text-gray-700 dark:text-gray-300",
                                                                            children: "Icoon tonen"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2671,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2661,
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
                                                                    lineNumber: 2679,
                                                                    columnNumber: 25
                                                                }, this),
                                                                ((_editForm_conditions2 = editForm.conditions) !== null && _editForm_conditions2 !== void 0 ? _editForm_conditions2 : []).map((cond, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                                                className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs",
                                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATORS"].map((op)=>{
                                                                                    var _SENSOR_CONDITION_OPERATOR_LABELS_op;
                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: op,
                                                                                        children: (_SENSOR_CONDITION_OPERATOR_LABELS_op = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATOR_LABELS"][op]) !== null && _SENSOR_CONDITION_OPERATOR_LABELS_op !== void 0 ? _SENSOR_CONDITION_OPERATOR_LABELS_op : op
                                                                                    }, op, false, {
                                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                        lineNumber: 2700,
                                                                                        columnNumber: 33
                                                                                    }, this);
                                                                                })
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2687,
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
                                                                                className: "w-20 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2705,
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
                                                                                className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs",
                                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_COLORS"].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: color,
                                                                                        children: color
                                                                                    }, color, false, {
                                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                        lineNumber: 2732,
                                                                                        columnNumber: 33
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2719,
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
                                                                                    lineNumber: 2748,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2737,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, idx, true, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 2683,
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
                                                                    lineNumber: 2752,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2678,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 2568,
                                                    columnNumber: 19
                                                }, this),
                                                editingWidget.type === "pill_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "flex items-center justify-between gap-3 cursor-pointer",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                                                    children: "Toon entiteitstatus"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2771,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    role: "switch",
                                                                    "aria-checked": editForm.show_state !== false,
                                                                    onClick: ()=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                show_state: prev.show_state === false
                                                                            })),
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex h-6 w-11 shrink-0 rounded-full border border-gray-200 dark:border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D2FB2] focus:ring-offset-2 dark:focus:ring-offset-gray-900", editForm.show_state !== false ? "bg-[#4D2FB2] border-transparent" : "bg-gray-200 dark:bg-gray-600"),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition translate-x-0.5", editForm.show_state !== false ? "translate-x-5" : "translate-x-1")
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 2788,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2774,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2770,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500 dark:text-gray-400 -mt-2",
                                                            children: "Toon of verberg de waarde (Aan/Uit of sensorwaarde) op de pill."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2796,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Icoon"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2800,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: pillIconSearch,
                                                                    onChange: (e)=>setPillIconSearch(e.target.value),
                                                                    onFocus: ()=>{
                                                                        var _editForm_icon;
                                                                        return setPillIconSearch(pillIconSearch || ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : ""));
                                                                    },
                                                                    placeholder: "Zoek icoon (bijv. CircleDot, Sun…)",
                                                                    className: "mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2803,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "max-h-32 overflow-auto rounded-lg border border-gray-200 dark:border-white/10 flex flex-wrap gap-1.5 p-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>{
                                                                                setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        icon: undefined
                                                                                    }));
                                                                                setPillIconSearch("");
                                                                            },
                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", !editForm.icon ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                            children: "Default (CircleDot)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 2812,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__CARD_ICON_OPTIONS__as__SENSOR_ICON_OPTIONS$3e$__["SENSOR_ICON_OPTIONS"].filter((name)=>name.toLowerCase().includes((pillIconSearch || "").toLowerCase())).map((name)=>{
                                                                            var _editForm_icon;
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>{
                                                                                    setEditForm((prev)=>({
                                                                                            ...prev,
                                                                                            icon: name
                                                                                        }));
                                                                                    setPillIconSearch(name);
                                                                                },
                                                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : "CircleDot") === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                                children: name
                                                                            }, name, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2830,
                                                                                columnNumber: 27
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2811,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2799,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mb-1 text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Voorwaardelijke kleur (eerste match)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2850,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-gray-500 dark:text-gray-400 mb-2",
                                                                    children: "Bepaal de pill-kleur op basis van de entity state."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2853,
                                                                    columnNumber: 23
                                                                }, this),
                                                                ((_editForm_conditions3 = editForm.conditions) !== null && _editForm_conditions3 !== void 0 ? _editForm_conditions3 : []).map((cond, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 p-2 mb-1.5",
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
                                                                                className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs",
                                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATORS"].map((op)=>{
                                                                                    var _SENSOR_CONDITION_OPERATOR_LABELS_op;
                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: op,
                                                                                        children: (_SENSOR_CONDITION_OPERATOR_LABELS_op = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_OPERATOR_LABELS"][op]) !== null && _SENSOR_CONDITION_OPERATOR_LABELS_op !== void 0 ? _SENSOR_CONDITION_OPERATOR_LABELS_op : op
                                                                                    }, op, false, {
                                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                        lineNumber: 2874,
                                                                                        columnNumber: 31
                                                                                    }, this);
                                                                                })
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2861,
                                                                                columnNumber: 27
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
                                                                                className: "w-20 rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2879,
                                                                                columnNumber: 27
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
                                                                                className: "rounded border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-gray-200 px-2 py-1 text-xs",
                                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$sensor$2d$card$2d$widget$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SENSOR_CONDITION_COLORS"].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: color,
                                                                                        children: color
                                                                                    }, color, false, {
                                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                        lineNumber: 2906,
                                                                                        columnNumber: 31
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2893,
                                                                                columnNumber: 27
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
                                                                                    lineNumber: 2922,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                lineNumber: 2911,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, idx, true, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 2857,
                                                                        columnNumber: 25
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
                                                                                        operator: "eq",
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
                                                                    lineNumber: 2926,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2849,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                    lineNumber: 2769,
                                                    columnNumber: 19
                                                }, this),
                                                editingWidget.type === "camera_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                                                    children: "Toon titel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2944,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    role: "switch",
                                                                    "aria-checked": editForm.show_title !== false,
                                                                    onClick: ()=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                show_title: !(prev.show_title !== false)
                                                                            })),
                                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D2FB2] focus:ring-offset-2", editForm.show_title !== false ? "bg-[#4D2FB2]" : "bg-gray-200 dark:bg-gray-600"),
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition", editForm.show_title !== false ? "translate-x-5" : "translate-x-1")
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                        lineNumber: 2961,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2947,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2943,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Vernieuw interval (seconden)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2970,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 2,
                                                                    max: 120,
                                                                    step: 1,
                                                                    value: (_editForm_refresh = editForm.refresh) !== null && _editForm_refresh !== void 0 ? _editForm_refresh : 10,
                                                                    onChange: (e)=>{
                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                refresh: v != null && !Number.isNaN(v) ? v : 10
                                                                            }));
                                                                    },
                                                                    placeholder: "10",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2973,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                    children: "2–120 seconden (standaard 10)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2989,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2969,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Breedte kaart (px)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2992,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 200,
                                                                    max: 600,
                                                                    step: 10,
                                                                    value: (_editForm_width2 = editForm.width) !== null && _editForm_width2 !== void 0 ? _editForm_width2 : 360,
                                                                    onChange: (e)=>{
                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                width: v != null && !Number.isNaN(v) ? v : undefined
                                                                            }));
                                                                    },
                                                                    placeholder: "360",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 2995,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                    children: "200–600 px (standaard 360)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3011,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 2991,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Hoogte kaart (px)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3014,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 150,
                                                                    max: 450,
                                                                    step: 10,
                                                                    value: (_editForm_height2 = editForm.height) !== null && _editForm_height2 !== void 0 ? _editForm_height2 : 270,
                                                                    onChange: (e)=>{
                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                height: v != null && !Number.isNaN(v) ? v : undefined
                                                                            }));
                                                                    },
                                                                    placeholder: "270",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3017,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                    children: "150–450 px (standaard 270)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3033,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3013,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                editingWidget.type === "weather_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "text-sm font-medium text-gray-700 dark:text-gray-300",
                                                                    children: "Toon icoon"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3040,
                                                                    columnNumber: 23
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
                                                                        lineNumber: 3057,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3043,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3039,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Breedte kaart (px)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3066,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 200,
                                                                    max: 500,
                                                                    step: 10,
                                                                    value: (_editForm_width3 = editForm.width) !== null && _editForm_width3 !== void 0 ? _editForm_width3 : 320,
                                                                    onChange: (e)=>{
                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                width: v != null && !Number.isNaN(v) ? v : undefined
                                                                            }));
                                                                    },
                                                                    placeholder: "320",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3069,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                    children: "200–500 px (standaard 320)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3085,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3065,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Hoogte kaart (px)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3088,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 100,
                                                                    max: 400,
                                                                    step: 10,
                                                                    value: (_editForm_height3 = editForm.height) !== null && _editForm_height3 !== void 0 ? _editForm_height3 : 180,
                                                                    onChange: (e)=>{
                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                height: v != null && !Number.isNaN(v) ? v : undefined
                                                                            }));
                                                                    },
                                                                    placeholder: "180",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder-gray-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3091,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                    children: "100–400 px (standaard 180)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3107,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3087,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true),
                                                editingWidget.type === "nuts_card" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Icoon"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3114,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap gap-1.5 rounded-lg border border-gray-200 dark:border-white/10 p-1.5 max-h-32 overflow-auto",
                                                                    children: [
                                                                        "Fuel",
                                                                        "Droplets",
                                                                        "Zap",
                                                                        "Gauge",
                                                                        "Thermometer"
                                                                    ].filter((n)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$card$2d$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARD_ICON_OPTIONS"].includes(n)).map((name)=>{
                                                                        var _editForm_icon;
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        icon: name
                                                                                    })),
                                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-md px-2 py-1 text-xs", ((_editForm_icon = editForm.icon) !== null && _editForm_icon !== void 0 ? _editForm_icon : "Fuel") === name ? "bg-[#4D2FB2] text-white" : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"),
                                                                            children: name
                                                                        }, name, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 3119,
                                                                            columnNumber: 27
                                                                        }, this);
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3117,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3113,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Kleur icoon"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3138,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "color",
                                                                            value: editForm.icon_background_color && /^#[0-9A-Fa-f]{6}$/.test(editForm.icon_background_color) ? editForm.icon_background_color : "#3B82F6",
                                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        icon_background_color: e.target.value
                                                                                    })),
                                                                            className: "h-8 w-12 cursor-pointer rounded border border-gray-200 dark:border-white/20 bg-white dark:bg-white/5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 3142,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            value: (_editForm_icon_background_color1 = editForm.icon_background_color) !== null && _editForm_icon_background_color1 !== void 0 ? _editForm_icon_background_color1 : "#3B82F6",
                                                                            onChange: (e)=>setEditForm((prev)=>({
                                                                                        ...prev,
                                                                                        icon_background_color: e.target.value || undefined
                                                                                    })),
                                                                            placeholder: "#3B82F6",
                                                                            className: "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 3153,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3141,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3137,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Breedte × hoogte (px)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3168,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    min: 150,
                                                                                    max: 400,
                                                                                    step: 10,
                                                                                    value: (_editForm_width4 = editForm.width) !== null && _editForm_width4 !== void 0 ? _editForm_width4 : 250,
                                                                                    onChange: (e)=>{
                                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                                        setEditForm((prev)=>({
                                                                                                ...prev,
                                                                                                width: v != null && !Number.isNaN(v) ? v : undefined
                                                                                            }));
                                                                                    },
                                                                                    placeholder: "250",
                                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 3173,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                                    children: "Breedte"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 3186,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 3172,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    min: 80,
                                                                                    max: 300,
                                                                                    step: 10,
                                                                                    value: (_editForm_height4 = editForm.height) !== null && _editForm_height4 !== void 0 ? _editForm_height4 : 130,
                                                                                    onChange: (e)=>{
                                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                                        setEditForm((prev)=>({
                                                                                                ...prev,
                                                                                                height: v != null && !Number.isNaN(v) ? v : undefined
                                                                                            }));
                                                                                    },
                                                                                    placeholder: "130",
                                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 3189,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                                    children: "Hoogte"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                                    lineNumber: 3202,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 3188,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3171,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3167,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Entity dagverbruik (totaal per dag)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3207,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: (_editForm_entity_id = editForm.entity_id) !== null && _editForm_entity_id !== void 0 ? _editForm_entity_id : "",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                entity_id: e.target.value
                                                                            })),
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Kies entity…"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 3217,
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
                                                                                lineNumber: 3223,
                                                                                columnNumber: 31
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3210,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3206,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Entity huidig verbruik (optioneel)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3231,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: (_editForm_current_entity_id = editForm.current_entity_id) !== null && _editForm_current_entity_id !== void 0 ? _editForm_current_entity_id : "",
                                                                    onChange: (e)=>setEditForm((prev)=>({
                                                                                ...prev,
                                                                                current_entity_id: e.target.value || undefined
                                                                            })),
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Geen (toont 0 voor huidig)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                            lineNumber: 3241,
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
                                                                                lineNumber: 3247,
                                                                                columnNumber: 31
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3234,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3230,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400",
                                                                    children: "Max waarde voor bar (optioneel)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3255,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "number",
                                                                    min: 1,
                                                                    step: 0.1,
                                                                    value: (_editForm_max_value = editForm.max_value) !== null && _editForm_max_value !== void 0 ? _editForm_max_value : 10,
                                                                    onChange: (e)=>{
                                                                        const v = e.target.value === "" ? undefined : Number(e.target.value);
                                                                        setEditForm((prev)=>({
                                                                                ...prev,
                                                                                max_value: v != null && !Number.isNaN(v) && v > 0 ? v : undefined
                                                                            }));
                                                                    },
                                                                    placeholder: "10",
                                                                    className: "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3258,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-0.5 text-xs text-gray-400 dark:text-gray-500",
                                                                    children: "Schaal voor verticale verbruiksbalk"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                    lineNumber: 3273,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                            lineNumber: 3254,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            ]
                                        }, void 0, true),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex shrink-0 justify-between gap-2 pt-3 mt-2 border-t border-gray-200 dark:border-white/10",
                                            children: editingWidget.type === "card_group" && editingGroupChildId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setEditingGroupChildId(null),
                                                        className: "rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300",
                                                        children: "Terug"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                        lineNumber: 3282,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    var _editingWidget_children;
                                                                    const nextChildren = ((_editingWidget_children = editingWidget.children) !== null && _editingWidget_children !== void 0 ? _editingWidget_children : []).filter((c)=>c.id !== editingGroupChildId);
                                                                    const nextWidgets = widgets.map((w)=>w.id === editingWidget.id ? {
                                                                            ...w,
                                                                            children: nextChildren
                                                                        } : w);
                                                                    setWidgets(nextWidgets);
                                                                    setEditingGroupChildId(null);
                                                                    saveMutation.mutate({
                                                                        layout,
                                                                        widgets: nextWidgets,
                                                                        welcomeTitle,
                                                                        welcomeSubtitle
                                                                    });
                                                                },
                                                                className: "rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
                                                                "aria-label": "Kaart uit groep verwijderen",
                                                                children: "Verwijderen"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 3290,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    var _editForm_conditions;
                                                                    const updates = {
                                                                        title: editForm.title,
                                                                        entity_id: editForm.entity_id,
                                                                        icon: editForm.icon || undefined,
                                                                        conditions: ((_editForm_conditions = editForm.conditions) !== null && _editForm_conditions !== void 0 ? _editForm_conditions : []).length > 0 ? editForm.conditions : undefined,
                                                                        show_state: editForm.show_state !== false
                                                                    };
                                                                    var _editingWidget_children;
                                                                    const nextChildren = ((_editingWidget_children = editingWidget.children) !== null && _editingWidget_children !== void 0 ? _editingWidget_children : []).map((c)=>c.id === editingGroupChildId ? {
                                                                            ...c,
                                                                            ...updates
                                                                        } : c);
                                                                    const nextWidgets = widgets.map((w)=>w.id === editingWidget.id ? {
                                                                            ...w,
                                                                            children: nextChildren
                                                                        } : w);
                                                                    setWidgets(nextWidgets);
                                                                    setEditingGroupChildId(null);
                                                                    saveMutation.mutate({
                                                                        layout,
                                                                        widgets: nextWidgets,
                                                                        welcomeTitle,
                                                                        welcomeSubtitle
                                                                    });
                                                                },
                                                                className: "rounded-lg bg-[#4D2FB2] px-3 py-1.5 text-sm text-white hover:opacity-90",
                                                                children: "Opslaan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 3304,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                        lineNumber: 3289,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : editingWidget.type === "card_group" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            const newWidgets = widgets.filter((w)=>w.id !== editingWidgetId);
                                                            const newLayout = layout.filter((item)=>item.i !== editingWidgetId);
                                                            setWidgets(newWidgets);
                                                            setLayout(newLayout);
                                                            setEditingWidgetId(null);
                                                            saveMutation.mutate({
                                                                layout: newLayout,
                                                                widgets: newWidgets,
                                                                welcomeTitle,
                                                                welcomeSubtitle
                                                            });
                                                        },
                                                        className: "rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
                                                        "aria-label": "Kaartgroep verwijderen",
                                                        children: "Verwijderen"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                        lineNumber: 3330,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setEditingWidgetId(null),
                                                        className: "rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300",
                                                        children: "Annuleren"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                        lineNumber: 3350,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            const newWidgets = widgets.filter((w)=>w.id !== editingWidgetId);
                                                            const newLayout = layout.filter((item)=>item.i !== editingWidgetId);
                                                            setWidgets(newWidgets);
                                                            setLayout(newLayout);
                                                            setEditingWidgetId(null);
                                                            saveMutation.mutate({
                                                                layout: newLayout,
                                                                widgets: newWidgets,
                                                                welcomeTitle,
                                                                welcomeSubtitle
                                                            });
                                                        },
                                                        className: "rounded-lg px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
                                                        "aria-label": "Kaart verwijderen",
                                                        children: "Verwijderen"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                        lineNumber: 3360,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setEditingWidgetId(null),
                                                                className: "rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:text-gray-300",
                                                                children: "Annuleren"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 3381,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    var _editForm_image_conditions, _editForm_image_conditions1, _editForm_minimal, _editForm_scale, _editForm_conditions, _editForm_refresh, _editForm_script_ids, _editForm_script_names, _editForm_conditions1, _editForm_conditions2;
                                                                    const updates = {
                                                                        title: editForm.title,
                                                                        ...editingWidget.entity_id != null && editingWidget.type !== "energy_monitor_card" && {
                                                                            entity_id: editForm.entity_id
                                                                        },
                                                                        ...editingWidget.type === "solar_card" && {
                                                                            consumption_entity_id: editForm.consumption_entity_id || undefined
                                                                        },
                                                                        ...editingWidget.type === "energy_monitor_card" && {
                                                                            entity_id: editForm.entity_id || undefined,
                                                                            background_image: editForm.background_image || undefined,
                                                                            background_image_dark: editForm.background_image_dark || undefined,
                                                                            image_conditions: ((_editForm_image_conditions = editForm.image_conditions) !== null && _editForm_image_conditions !== void 0 ? _editForm_image_conditions : []).filter((c)=>{
                                                                                var _c_image;
                                                                                return (_c_image = c.image) === null || _c_image === void 0 ? void 0 : _c_image.trim();
                                                                            }).length > 0 ? ((_editForm_image_conditions1 = editForm.image_conditions) !== null && _editForm_image_conditions1 !== void 0 ? _editForm_image_conditions1 : []).filter((c)=>{
                                                                                var _c_image;
                                                                                return (_c_image = c.image) === null || _c_image === void 0 ? void 0 : _c_image.trim();
                                                                            }) : undefined,
                                                                            minimal: (_editForm_minimal = editForm.minimal) !== null && _editForm_minimal !== void 0 ? _editForm_minimal : false,
                                                                            scale: (_editForm_scale = editForm.scale) !== null && _editForm_scale !== void 0 ? _editForm_scale : 1
                                                                        },
                                                                        ...editingWidget.type === "stat_pill_card" && {
                                                                            label: editForm.label || undefined,
                                                                            icon: editForm.icon || undefined,
                                                                            color: editForm.color || undefined,
                                                                            conditions: ((_editForm_conditions = editForm.conditions) !== null && _editForm_conditions !== void 0 ? _editForm_conditions : []).length > 0 ? editForm.conditions : undefined
                                                                        },
                                                                        ...(editingWidget.type === "climate_card_2" || editingWidget.type === "climate_card") && {
                                                                            humidity_entity_id: editForm.humidity_entity_id || undefined,
                                                                            icon: editForm.icon || undefined,
                                                                            width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                                                                            height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined
                                                                        },
                                                                        ...editingWidget.type === "light_card" && {
                                                                            icon: editForm.icon || undefined
                                                                        },
                                                                        ...editingWidget.type === "weather_card" && {
                                                                            show_icon: editForm.show_icon !== false,
                                                                            width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                                                                            height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined
                                                                        },
                                                                        ...editingWidget.type === "camera_card" && {
                                                                            refresh: (_editForm_refresh = editForm.refresh) !== null && _editForm_refresh !== void 0 ? _editForm_refresh : 10,
                                                                            show_title: editForm.show_title !== false,
                                                                            width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                                                                            height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined
                                                                        },
                                                                        ...editingWidget.type === "vacuum_card" && {
                                                                            script_ids: (_editForm_script_ids = editForm.script_ids) !== null && _editForm_script_ids !== void 0 ? _editForm_script_ids : [],
                                                                            script_names: (_editForm_script_names = editForm.script_names) !== null && _editForm_script_names !== void 0 ? _editForm_script_names : {},
                                                                            cleaned_area_entity_id: editForm.cleaned_area_entity_id || undefined,
                                                                            icon: editForm.icon || undefined
                                                                        },
                                                                        ...editingWidget.type === "sensor_card" && {
                                                                            icon: editForm.icon || undefined,
                                                                            show_icon: editForm.show_icon !== false,
                                                                            size: editForm.size || undefined,
                                                                            conditions: ((_editForm_conditions1 = editForm.conditions) !== null && _editForm_conditions1 !== void 0 ? _editForm_conditions1 : []).length > 0 ? editForm.conditions : undefined
                                                                        },
                                                                        ...editingWidget.type === "pill_card" && {
                                                                            icon: editForm.icon || undefined,
                                                                            conditions: ((_editForm_conditions2 = editForm.conditions) !== null && _editForm_conditions2 !== void 0 ? _editForm_conditions2 : []).length > 0 ? editForm.conditions : undefined,
                                                                            show_state: editForm.show_state !== false
                                                                        },
                                                                        ...editingWidget.type === "nuts_card" && {
                                                                            icon: editForm.icon || undefined,
                                                                            icon_background_color: editForm.icon_background_color || undefined,
                                                                            entity_id: editForm.entity_id || undefined,
                                                                            current_entity_id: editForm.current_entity_id || undefined,
                                                                            max_value: editForm.max_value != null && editForm.max_value > 0 ? editForm.max_value : undefined,
                                                                            width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                                                                            height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined
                                                                        },
                                                                        ...editingWidget.type === "room_card" && {
                                                                            icon: editForm.icon || undefined,
                                                                            light_entity_id: editForm.light_entity_id || undefined,
                                                                            background_image: editForm.background_image || undefined,
                                                                            icon_background_color: editForm.icon_background_color || undefined,
                                                                            width: editForm.width != null && editForm.width > 0 ? editForm.width : undefined,
                                                                            height: editForm.height != null && editForm.height > 0 ? editForm.height : undefined
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
                                                                children: "Opslaan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                                lineNumber: 3388,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                                        lineNumber: 3380,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                            lineNumber: 3279,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                                    lineNumber: 1369,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
                            lineNumber: 1354,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true), document.body)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboards/[id]/page.tsx",
            lineNumber: 903,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/dashboards/[id]/page.tsx",
        lineNumber: 891,
        columnNumber: 5
    }, this);
}
_s1(DashboardEditPage, "/EWa3Vd6NA79RLbryZvjODpl1Fo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$entity$2d$state$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEntityStateStore"],
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

//# sourceMappingURL=src_app_dashboards_%5Bid%5D_page_tsx_d40cf714._.js.map