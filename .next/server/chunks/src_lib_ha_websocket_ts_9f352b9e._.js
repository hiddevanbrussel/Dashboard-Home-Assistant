module.exports = [
"[project]/src/lib/ha/websocket.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/node_modules_ws_wrapper_mjs_51661af3._.js",
  "server/chunks/src_lib_ha_websocket_ts_a882718e._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/ha/websocket.ts [app-route] (ecmascript)");
    });
});
}),
];