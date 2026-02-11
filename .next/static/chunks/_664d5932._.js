(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/stores/onboarding-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOnboardingStore",
    ()=>useOnboardingStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
const defaultConnection = {
    baseUrl: "http://homeassistant.local:8123",
    token: ""
};
const initialState = {
    step: 1,
    connection: defaultConnection,
    testResult: null,
    entities: [],
    selectedEntityIds: [],
    areas: [],
    rooms: [],
    template: "overview",
    dashboardId: null,
    dashboardName: "My dashboard",
    widgets: []
};
const useOnboardingStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        ...initialState,
        setStep: (step)=>set({
                step
            }),
        nextStep: ()=>set((s)=>({
                    step: Math.min(6, s.step + 1)
                })),
        prevStep: ()=>set((s)=>({
                    step: Math.max(1, s.step - 1)
                })),
        setConnection: (c)=>set((s)=>({
                    connection: {
                        ...s.connection,
                        ...c
                    }
                })),
        setTestResult: (r)=>set({
                testResult: r
            }),
        setEntities: (e)=>set({
                entities: e
            }),
        setSelectedEntityIds: (ids)=>set({
                selectedEntityIds: ids
            }),
        toggleEntitySelection: (entityId)=>set((s)=>({
                    selectedEntityIds: s.selectedEntityIds.includes(entityId) ? s.selectedEntityIds.filter((id)=>id !== entityId) : [
                        ...s.selectedEntityIds,
                        entityId
                    ]
                })),
        setAreas: (a)=>set({
                areas: a
            }),
        setRooms: (r)=>set({
                rooms: r
            }),
        addRoom: (name)=>set((s)=>({
                    rooms: [
                        ...s.rooms,
                        {
                            id: crypto.randomUUID(),
                            name,
                            entityIds: []
                        }
                    ]
                })),
        assignEntityToRoom: (roomId, entityId)=>set((s)=>({
                    rooms: s.rooms.map((r)=>r.id === roomId && !r.entityIds.includes(entityId) ? {
                            ...r,
                            entityIds: [
                                ...r.entityIds,
                                entityId
                            ]
                        } : r)
                })),
        removeEntityFromRoom: (roomId, entityId)=>set((s)=>({
                    rooms: s.rooms.map((r)=>r.id === roomId ? {
                            ...r,
                            entityIds: r.entityIds.filter((id)=>id !== entityId)
                        } : r)
                })),
        setTemplate: (template)=>set({
                template
            }),
        setDashboard: (dashboardId, dashboardName)=>set({
                dashboardId,
                dashboardName
            }),
        setDashboardName: (dashboardName)=>set({
                dashboardName
            }),
        setWidgets: (widgets)=>set({
                widgets
            }),
        addWidget: (w)=>set((s)=>({
                    widgets: [
                        ...s.widgets,
                        {
                            ...w,
                            id: crypto.randomUUID()
                        }
                    ]
                })),
        updateWidget: (id, updates)=>set((s)=>({
                    widgets: s.widgets.map((w)=>w.id === id ? {
                            ...w,
                            ...updates
                        } : w)
                })),
        removeWidget: (id)=>set((s)=>({
                    widgets: s.widgets.filter((w)=>w.id !== id)
                })),
        reset: ()=>set(initialState)
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnboardingFullscreenLayout",
    ()=>OnboardingFullscreenLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const gradientLight = "linear-gradient(135deg, rgba(246,210,92,0.4) 0%, rgba(180,139,255,0.3) 50%, rgba(100,120,140,0.5) 100%)";
const gradientDark = "linear-gradient(135deg, rgba(43,63,75,0.9) 0%, rgba(31,47,58,0.95) 50%, rgba(107,228,107,0.15) 100%)";
function OnboardingFullscreenLayout(param) {
    let { step, title, subtitle, children } = param;
    _s();
    const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])({
        "OnboardingFullscreenLayout.useThemeStore[resolved]": (s)=>s.resolved
    }["OnboardingFullscreenLayout.useThemeStore[resolved]"]);
    const bg = resolved === "dark" ? gradientDark : gradientLight;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col bg-page-light dark:bg-dark-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 opacity-90 dark:opacity-95",
                style: {
                    background: bg
                },
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "relative z-10 flex-1 flex flex-col items-center p-6 pt-12 pb-24 overflow-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full max-w-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight text-center",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-3 text-base md:text-lg text-gray-700 dark:text-gray-200 text-center",
                            children: subtitle
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 rounded-2xl bg-white/60 dark:bg-black/30 backdrop-blur-sm border border-white/40 dark:border-white/10 p-6 shadow-lg",
                            children: children
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(OnboardingFullscreenLayout, "ET+7Rdpp9mvF2dA9Dv515+qC7hM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"]
    ];
});
_c = OnboardingFullscreenLayout;
var _c;
__turbopack_context__.k.register(_c, "OnboardingFullscreenLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/onboarding/step-intro.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepIntro",
    ()=>StepIntro
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx [app-client] (ecmascript)");
"use client";
;
;
function StepIntro() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnboardingFullscreenLayout"], {
        step: 1,
        title: "Welcome",
        subtitle: "Set up your dashboard in a few steps. You will connect Home Assistant, choose entities, set up rooms, name your dashboard, and save.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
            className: "list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: "Connect – Base URL and Long-Lived Access Token"
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-intro.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: "Fetch entities – Load and select which entities to use (click tags)"
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-intro.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: "Fetch rooms – Import areas or create rooms"
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-intro.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: "Name – Give your dashboard a name"
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-intro.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: "Save – Create dashboard and finish"
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-intro.tsx",
                    lineNumber: 17,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/onboarding/step-intro.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/onboarding/step-intro.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = StepIntro;
var _c;
__turbopack_context__.k.register(_c, "StepIntro");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/onboarding/step-connect.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepConnect",
    ()=>StepConnect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/onboarding-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function StepConnect() {
    _s();
    const { connection, setConnection, setTestResult, testResult, nextStep } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"])();
    const [testing, setTesting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleTest() {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await fetch("/api/ha/test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    baseUrl: connection.baseUrl,
                    token: connection.token
                })
            });
            const data = await res.json();
            if (data.ok) {
                setTestResult({
                    ok: true
                });
            } else {
                var _data_error;
                setTestResult({
                    ok: false,
                    error: (_data_error = data.error) !== null && _data_error !== void 0 ? _data_error : "Connection failed"
                });
            }
        } catch (err) {
            setTestResult({
                ok: false,
                error: err instanceof Error ? err.message : "Request failed"
            });
        } finally{
            setTesting(false);
        }
    }
    async function handleSaveAndContinue() {
        if (!(testResult === null || testResult === void 0 ? void 0 : testResult.ok)) return;
        setTesting(true);
        try {
            const res = await fetch("/api/ha/connection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    baseUrl: connection.baseUrl,
                    token: connection.token
                })
            });
            const data = await res.json();
            if (data.connectionId) {
                setConnection({
                    connectionId: data.connectionId
                });
                nextStep();
            }
        } finally{
            setTesting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnboardingFullscreenLayout"], {
        step: 2,
        title: "Connect to Home Assistant",
        subtitle: "Enter your instance URL and Long-Lived Access Token. The connection is saved in this step. Test it, then continue.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4 max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "baseUrl",
                            className: "block text-sm font-medium mb-1",
                            children: "Base URL"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-connect.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "baseUrl",
                            type: "url",
                            value: connection.baseUrl,
                            onChange: (e)=>setConnection({
                                    baseUrl: e.target.value
                                }),
                            placeholder: "http://homeassistant.local:8123",
                            className: "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-connect.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-connect.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "token",
                            className: "block text-sm font-medium mb-1",
                            children: "Long-Lived Access Token"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-connect.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "token",
                            type: "password",
                            value: connection.token,
                            onChange: (e)=>setConnection({
                                    token: e.target.value
                                }),
                            placeholder: "Paste your token",
                            className: "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-connect.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-connect.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleTest,
                            disabled: testing,
                            className: "rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 disabled:opacity-50",
                            children: "Test connection"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-connect.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this),
                        (testResult === null || testResult === void 0 ? void 0 : testResult.ok) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleSaveAndContinue,
                            disabled: testing,
                            className: "rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium",
                            children: "Save and continue"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-connect.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-connect.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this),
                testResult !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg p-3 text-sm ".concat(testResult.ok ? "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200" : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200"),
                    children: [
                        testing && "Testing…",
                        !testing && testResult.ok && "Connection successful. Save and continue above.",
                        !testing && !testResult.ok && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium",
                                    children: "Connection failed"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/onboarding/step-connect.tsx",
                                    lineNumber: 127,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1",
                                    children: testResult.error
                                }, void 0, false, {
                                    fileName: "[project]/src/components/onboarding/step-connect.tsx",
                                    lineNumber: 128,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 text-xs opacity-90",
                                    children: "Tip: create a token in HA under Profile → Long-Lived Access Tokens; use HTTPS or a reverse proxy if needed."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/onboarding/step-connect.tsx",
                                    lineNumber: 129,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-connect.tsx",
                    lineNumber: 116,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/onboarding/step-connect.tsx",
            lineNumber: 68,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/onboarding/step-connect.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(StepConnect, "ymr27yFdU6XDB1ediWqf91qKSoE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"]
    ];
});
_c = StepConnect;
var _c;
__turbopack_context__.k.register(_c, "StepConnect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/onboarding/step-discovery.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepDiscovery",
    ()=>StepDiscovery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/onboarding-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const DOMAIN_FILTERS = [
    "light",
    "switch",
    "climate",
    "sensor",
    "media_player",
    "vacuum"
];
function getDomain(entityId) {
    var _entityId_split_;
    return (_entityId_split_ = entityId.split(".")[0]) !== null && _entityId_split_ !== void 0 ? _entityId_split_ : "";
}
function StepDiscovery() {
    _s();
    const { setEntities, entities, connectionId, selectedEntityIds, toggleEntitySelection } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [domainFilter, setDomainFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StepDiscovery.useEffect": ()=>{
            let cancelled = false;
            setLoading(true);
            setError(null);
            const url = connectionId ? "/api/ha/entities?connectionId=".concat(encodeURIComponent(connectionId)) : "/api/ha/entities";
            fetch(url).then({
                "StepDiscovery.useEffect": (r)=>{
                    if (!r.ok) return r.json().then({
                        "StepDiscovery.useEffect": (body)=>{
                            var _body_error;
                            return {
                                error: (_body_error = body === null || body === void 0 ? void 0 : body.error) !== null && _body_error !== void 0 ? _body_error : "Failed to load"
                            };
                        }
                    }["StepDiscovery.useEffect"]);
                    return r.json();
                }
            }["StepDiscovery.useEffect"]).then({
                "StepDiscovery.useEffect": (data)=>{
                    if (cancelled) return;
                    if ("error" in data) {
                        setError(data.error);
                        return;
                    }
                    if (Array.isArray(data)) setEntities(data);
                }
            }["StepDiscovery.useEffect"]).catch({
                "StepDiscovery.useEffect": ()=>{
                    if (!cancelled) setError("Connection failed. Check that Home Assistant is reachable.");
                }
            }["StepDiscovery.useEffect"]).finally({
                "StepDiscovery.useEffect": ()=>{
                    if (!cancelled) setLoading(false);
                }
            }["StepDiscovery.useEffect"]);
            return ({
                "StepDiscovery.useEffect": ()=>{
                    cancelled = true;
                }
            })["StepDiscovery.useEffect"];
        }
    }["StepDiscovery.useEffect"], [
        connectionId,
        setEntities
    ]);
    const filtered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "StepDiscovery.useMemo[filtered]": ()=>{
            let list = entities;
            if (domainFilter) {
                list = list.filter({
                    "StepDiscovery.useMemo[filtered]": (e)=>getDomain(e.entity_id) === domainFilter
                }["StepDiscovery.useMemo[filtered]"]);
            }
            if (search.trim()) {
                const q = search.trim().toLowerCase();
                list = list.filter({
                    "StepDiscovery.useMemo[filtered]": (e)=>{
                        var _this;
                        var _friendly_name;
                        return e.entity_id.toLowerCase().includes(q) || String((_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : "").toLowerCase().includes(q);
                    }
                }["StepDiscovery.useMemo[filtered]"]);
            }
            return list;
        }
    }["StepDiscovery.useMemo[filtered]"], [
        entities,
        domainFilter,
        search
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnboardingFullscreenLayout"], {
        step: 3,
        title: "Fetch entities",
        subtitle: "Entities from your Home Assistant instance. Click an entity (or use the domain tags) to select which entities may be used in your dashboard.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-2 items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-medium",
                            children: "Filter by domain:"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setDomainFilter(null),
                            className: "rounded-full px-2.5 py-1 text-xs font-medium ".concat(domainFilter === null ? "bg-accent-yellow dark:bg-accent-green text-gray-900" : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"),
                            children: "All"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        DOMAIN_FILTERS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setDomainFilter(d),
                                className: "rounded-full px-2.5 py-1 text-xs font-medium ".concat(domainFilter === d ? "bg-accent-yellow dark:bg-accent-green text-gray-900" : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"),
                                children: d
                            }, d, false, {
                                fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "search",
                    placeholder: "Search by entity_id or name...",
                    value: search,
                    onChange: (e)=>setSearch(e.target.value),
                    className: "w-full max-w-md rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm"
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-200",
                    children: [
                        error,
                        (error.includes("onboarding") || error.includes("connection")) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-xs",
                            children: 'Go back to step 2, test the connection and click "Save and continue".'
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                            lineNumber: 124,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                    lineNumber: 121,
                    columnNumber: 11
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-500",
                    children: "Loading entities…"
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                    lineNumber: 131,
                    columnNumber: 11
                }, this) : !error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600 dark:text-gray-400",
                            children: [
                                selectedEntityIds.length,
                                " selected. Click a row to include or exclude an entity."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                            lineNumber: 134,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-gray-200 dark:border-white/10 divide-y divide-gray-200 dark:divide-white/10 max-h-[360px] overflow-auto",
                            children: filtered.slice(0, 100).map((e)=>{
                                var _this;
                                var _friendly_name;
                                const name = (_friendly_name = (_this = e.attributes) === null || _this === void 0 ? void 0 : _this.friendly_name) !== null && _friendly_name !== void 0 ? _friendly_name : e.entity_id;
                                const selected = selectedEntityIds.includes(e.entity_id);
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>toggleEntitySelection(e.entity_id),
                                    className: "flex items-center justify-between w-full px-4 py-2 text-sm text-left transition-colors ".concat(selected ? "bg-accent-yellow/30 dark:bg-accent-green/30" : "hover:bg-gray-100 dark:hover:bg-white/5"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium truncate flex items-center gap-2",
                                            children: [
                                                selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "h-4 w-4 shrink-0 text-green-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 36
                                                }, this),
                                                name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                                            lineNumber: 154,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-500 dark:text-gray-400 text-xs ml-2 shrink-0",
                                            children: e.entity_id
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                                            lineNumber: 158,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2 shrink-0 rounded px-2 py-0.5 text-xs bg-gray-100 dark:bg-white/10",
                                            title: "State",
                                            children: e.state
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                                            lineNumber: 161,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, e.entity_id, true, {
                                    fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                                    lineNumber: 144,
                                    columnNumber: 19
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                            lineNumber: 137,
                            columnNumber: 13
                        }, this),
                        filtered.length > 100 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-gray-500",
                            children: [
                                "First 100 of ",
                                filtered.length,
                                " shown"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
                            lineNumber: 172,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true) : null
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/onboarding/step-discovery.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/onboarding/step-discovery.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(StepDiscovery, "4DBnK5rCiAra+ZVpvjphmG5hK0o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"]
    ];
});
_c = StepDiscovery;
var _c;
__turbopack_context__.k.register(_c, "StepDiscovery");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/onboarding/step-rooms.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepRooms",
    ()=>StepRooms
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/onboarding-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function StepRooms() {
    _s();
    const { rooms, areas, setAreas, addRoom, removeEntityFromRoom, connectionId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"])();
    const [newRoomName, setNewRoomName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StepRooms.useEffect": ()=>{
            let cancelled = false;
            setLoading(true);
            setError(null);
            const url = connectionId ? "/api/ha/areas?connectionId=".concat(encodeURIComponent(connectionId)) : "/api/ha/areas";
            fetch(url).then({
                "StepRooms.useEffect": (r)=>{
                    if (!r.ok) return r.json().then({
                        "StepRooms.useEffect": (body)=>{
                            var _body_error;
                            return {
                                error: (_body_error = body === null || body === void 0 ? void 0 : body.error) !== null && _body_error !== void 0 ? _body_error : "Failed to load"
                            };
                        }
                    }["StepRooms.useEffect"]);
                    return r.json();
                }
            }["StepRooms.useEffect"]).then({
                "StepRooms.useEffect": (data)=>{
                    if (cancelled) return;
                    if ("error" in data) {
                        setError(data.error);
                        return;
                    }
                    if (Array.isArray(data)) setAreas(data);
                }
            }["StepRooms.useEffect"]).catch({
                "StepRooms.useEffect": ()=>{
                    if (!cancelled) setError("Connection failed. Check that Home Assistant is reachable.");
                }
            }["StepRooms.useEffect"]).finally({
                "StepRooms.useEffect": ()=>{
                    if (!cancelled) setLoading(false);
                }
            }["StepRooms.useEffect"]);
            return ({
                "StepRooms.useEffect": ()=>{
                    cancelled = true;
                }
            })["StepRooms.useEffect"];
        }
    }["StepRooms.useEffect"], [
        connectionId,
        setAreas
    ]);
    const importAreasAsRooms = ()=>{
        const existingNames = new Set(rooms.map((r)=>r.name.toLowerCase()));
        areas.forEach((a)=>{
            if (a.name && !existingNames.has(a.name.toLowerCase())) {
                addRoom(a.name);
                existingNames.add(a.name.toLowerCase());
            }
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnboardingFullscreenLayout"], {
        step: 4,
        title: "Fetch rooms",
        subtitle: "Import Home Assistant areas as rooms or create rooms manually. You can assign entities to rooms later in the app.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-600 dark:text-gray-400",
                    children: [
                        "Rooms: ",
                        rooms.length,
                        " · ",
                        rooms.reduce((acc, r)=>acc + r.entityIds.length, 0),
                        " entities assigned"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: newRoomName,
                            onChange: (e)=>setNewRoomName(e.target.value),
                            placeholder: "New room name",
                            className: "rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 px-3 py-2 text-sm flex-1 max-w-xs"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>{
                                if (newRoomName.trim()) {
                                    addRoom(newRoomName.trim());
                                    setNewRoomName("");
                                }
                            },
                            className: "rounded-full bg-accent-yellow dark:bg-accent-green p-2 text-gray-900",
                            "aria-label": "Add room",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-200",
                    children: [
                        error,
                        (error.includes("onboarding") || error.includes("connection")) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-xs",
                            children: 'Go back to step 2, test the connection and click "Save and continue".'
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                            lineNumber: 98,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                    lineNumber: 95,
                    columnNumber: 11
                }, this),
                loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-500",
                    children: "Loading rooms/areas…"
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                    lineNumber: 104,
                    columnNumber: 21
                }, this),
                !loading && !error && areas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-600 dark:text-gray-300",
                            children: [
                                "HA-areas: ",
                                areas.map((a)=>a.name).join(", ")
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: importAreasAsRooms,
                            className: "rounded-full bg-accent-yellow dark:bg-accent-green px-3 py-1.5 text-sm font-medium text-gray-900",
                            children: "Import as rooms"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                            lineNumber: 110,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-4 sm:grid-cols-2",
                    children: rooms.map((room)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-medium mb-2",
                                    children: room.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-500 dark:text-gray-400 mb-2",
                                    children: [
                                        room.entityIds.length,
                                        " entities"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                                    lineNumber: 126,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "text-sm space-y-1",
                                    children: [
                                        room.entityIds.slice(0, 5).map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "truncate",
                                                        children: id
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>removeEntityFromRoom(room.id, id),
                                                        className: "text-red-500 text-xs",
                                                        children: "Remove"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                                                        lineNumber: 133,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, id, true, {
                                                fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                                                lineNumber: 131,
                                                columnNumber: 19
                                            }, this)),
                                        room.entityIds.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "text-gray-500",
                                            children: [
                                                "+",
                                                room.entityIds.length - 5,
                                                " more"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                                            lineNumber: 143,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                                    lineNumber: 129,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, room.id, true, {
                            fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-rooms.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/onboarding/step-rooms.tsx",
            lineNumber: 68,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/onboarding/step-rooms.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(StepRooms, "V/uA0mybG8plzB0BJxlNUrcL+mo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"]
    ];
});
_c = StepRooms;
var _c;
__turbopack_context__.k.register(_c, "StepRooms");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/onboarding/step-create-dashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepCreateDashboard",
    ()=>StepCreateDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/onboarding-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/theme-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const gradientLight = "linear-gradient(135deg, rgba(246,210,92,0.4) 0%, rgba(180,139,255,0.3) 50%, rgba(100,120,140,0.5) 100%)";
const gradientDark = "linear-gradient(135deg, rgba(43,63,75,0.9) 0%, rgba(31,47,58,0.95) 50%, rgba(107,228,107,0.15) 100%)";
function StepCreateDashboard() {
    _s();
    const { dashboardName, dashboardId, setDashboard, setDashboardName, nextStep } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"])();
    const [creating, setCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"])({
        "StepCreateDashboard.useThemeStore[resolved]": (s)=>s.resolved
    }["StepCreateDashboard.useThemeStore[resolved]"]);
    const bg = resolved === "dark" ? gradientDark : gradientLight;
    async function handleCreate() {
        const name = dashboardName.trim() || "My dashboard";
        setCreating(true);
        setError(null);
        try {
            const res = await fetch("/api/dashboards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    theme: "auto"
                })
            });
            const data = await res.json();
            if (!res.ok) {
                var _data_error;
                setError((_data_error = data === null || data === void 0 ? void 0 : data.error) !== null && _data_error !== void 0 ? _data_error : "Failed to create");
                return;
            }
            if (data === null || data === void 0 ? void 0 : data.id) {
                setDashboard(data.id, name);
                nextStep();
            } else {
                setError("No dashboard id received");
            }
        } catch (e) {
            setError("Request failed");
        } finally{
            setCreating(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex flex-col items-center justify-center p-8 bg-page-light dark:bg-dark-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-90 dark:opacity-95",
                style: {
                    background: bg
                },
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "relative z-10 max-w-2xl mx-auto text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight",
                        children: "Name your dashboard"
                    }, void 0, false, {
                        fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-200 leading-relaxed",
                        children: "Give your dashboard a name. In the next step you will save and finish."
                    }, void 0, false, {
                        fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8 max-w-sm mx-auto text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "dashboard-name",
                                className: "block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200",
                                children: "Dashboard name"
                            }, void 0, false, {
                                fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "dashboard-name",
                                type: "text",
                                value: dashboardName,
                                onChange: (e)=>setDashboardName(e.target.value),
                                placeholder: "My dashboard",
                                className: "w-full rounded-xl border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 px-4 py-3 text-base text-gray-900 dark:text-white placeholder:text-gray-500",
                                disabled: !!dashboardId
                            }, void 0, false, {
                                fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-sm text-red-600 dark:text-red-400",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleCreate,
                        disabled: creating || !!dashboardId,
                        className: "mt-10 inline-block rounded-full bg-accent-yellow dark:bg-accent-green px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:pointer-events-none",
                        children: creating ? "Creating…" : dashboardId ? "Created" : "Create dashboard"
                    }, void 0, false, {
                        fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/onboarding/step-create-dashboard.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(StepCreateDashboard, "K1W8L01Ih7iiyh++Jl/sjTUDwe8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$theme$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThemeStore"]
    ];
});
_c = StepCreateDashboard;
var _c;
__turbopack_context__.k.register(_c, "StepCreateDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/onboarding/step-done.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StepDone",
    ()=>StepDone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/onboarding-fullscreen-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/onboarding-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/onboarding-completed.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function StepDone() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { rooms, dashboardId: storedDashboardId, dashboardName: storedDashboardName } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"])();
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function handleSave() {
        setSaving(true);
        setError(null);
        try {
            let dashboardId = storedDashboardId;
            if (!dashboardId) {
                const res = await fetch("/api/dashboard");
                const d = await res.json();
                if (d === null || d === void 0 ? void 0 : d.id) {
                    dashboardId = d.id;
                } else {
                    const createRes = await fetch("/api/dashboards", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: storedDashboardName || "My dashboard",
                            theme: "auto"
                        })
                    });
                    const created = await createRes.json();
                    var _created_id;
                    dashboardId = (_created_id = created === null || created === void 0 ? void 0 : created.id) !== null && _created_id !== void 0 ? _created_id : null;
                }
            }
            if (dashboardId) {
                await fetch("/api/dashboards/".concat(dashboardId), {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        widgets: JSON.stringify([]),
                        layout: JSON.stringify([])
                    })
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setOnboardingCompleted"])();
            router.push("/dashboards");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
        } finally{
            setSaving(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$onboarding$2d$fullscreen$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OnboardingFullscreenLayout"], {
        step: 6,
        title: "Save",
        subtitle: "Create your dashboard and finish. You can add widgets and change settings later in the app.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4 max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-600 dark:text-gray-400",
                    children: [
                        "Dashboard name: ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: storedDashboardName || "My dashboard"
                        }, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-done.tsx",
                            lineNumber: 66,
                            columnNumber: 27
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/components/onboarding/step-done.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        "Rooms: ",
                        rooms.length
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/onboarding/step-done.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-red-600 dark:text-red-400",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-done.tsx",
                    lineNumber: 71,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: handleSave,
                    disabled: saving,
                    className: "rounded-full bg-accent-yellow dark:bg-accent-green px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50",
                    children: saving ? "Saving…" : "Save and open dashboard"
                }, void 0, false, {
                    fileName: "[project]/src/components/onboarding/step-done.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/onboarding/step-done.tsx",
            lineNumber: 64,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/onboarding/step-done.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, this);
}
_s(StepDone, "7erEboPLDwh5E596mWTBbVv0hLM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"]
    ];
});
_c = StepDone;
var _c;
__turbopack_context__.k.register(_c, "StepDone");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/onboarding/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OnboardingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/stores/onboarding-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$intro$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/step-intro.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$connect$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/step-connect.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$discovery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/step-discovery.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$rooms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/step-rooms.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$create$2d$dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/step-create-dashboard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$done$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/onboarding/step-done.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/onboarding-completed.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
const STEPS = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$intro$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepIntro"],
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$connect$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepConnect"],
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$discovery$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepDiscovery"],
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$rooms$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepRooms"],
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$create$2d$dashboard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepCreateDashboard"],
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$onboarding$2f$step$2d$done$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StepDone"]
];
function OnboardingPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { step, nextStep, prevStep } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"])();
    const CurrentStep = STEPS[step - 1];
    function handleSkip() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$onboarding$2d$completed$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setOnboardingCompleted"])();
        router.push("/dashboards");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CurrentStep, {}, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-6 right-6 flex gap-2 z-40",
                children: [
                    step > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: prevStep,
                        className: "rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 px-4 py-2 text-sm font-medium shadow-lg",
                        children: "Previous"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this),
                    step < 6 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: nextStep,
                        className: "rounded-full bg-accent-yellow dark:bg-accent-green px-4 py-2 text-sm font-medium text-gray-900 shadow-lg",
                        children: "Next"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: handleSkip,
                        className: "rounded-full bg-gray-200 dark:bg-white/10 px-4 py-2 text-sm font-medium",
                        children: "Skip"
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(OnboardingPage, "Lqlo2RlLJeoDOskh9se7gv9Gyx0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$stores$2f$onboarding$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnboardingStore"]
    ];
});
_c = OnboardingPage;
var _c;
__turbopack_context__.k.register(_c, "OnboardingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "mergeClasses",
    ()=>mergeClasses,
    "toKebabCase",
    ()=>toKebabCase
]);
const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = function() {
    for(var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++){
        classes[_key] = arguments[_key];
    }
    return classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
};
;
 //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
 //# sourceMappingURL=defaultAttributes.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((param, ref)=>{
    let { color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest } = param;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", className),
        ...rest
    }, [
        ...iconNode.map((param)=>{
            let [tag, attrs] = param;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs);
        }),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]);
});
;
 //# sourceMappingURL=Icon.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)");
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((param, ref)=>{
        let { className, ...props } = param;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide-".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])(iconName)), className),
            ...props
        });
    });
    Component.displayName = "".concat(iconName);
    return Component;
};
;
 //# sourceMappingURL=createLucideIcon.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Check
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Check", [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
]);
;
 //# sourceMappingURL=check.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Plus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Plus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Plus", [
    [
        "path",
        {
            d: "M5 12h14",
            key: "1ays0h"
        }
    ],
    [
        "path",
        {
            d: "M12 5v14",
            key: "s699le"
        }
    ]
]);
;
 //# sourceMappingURL=plus.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Plus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_664d5932._.js.map