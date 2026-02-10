module.exports = [
"[project]/src/lib/ha/websocket.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Home Assistant WebSocket client. Server-side only.
 * Connects to /api/websocket, authenticates, subscribes to state_changed.
 */ __turbopack_context__.s([
    "connectHaWebSocket",
    ()=>connectHaWebSocket,
    "fetchAreasViaWebSocket",
    ()=>fetchAreasViaWebSocket
]);
function getWsUrl(baseUrl) {
    const u = baseUrl.trim().replace(/\/+$/, "");
    return u.replace(/^http/, "ws") + "/api/websocket";
}
async function fetchAreasViaWebSocket(baseUrl, token) {
    const WebSocket = (await __turbopack_context__.A("[project]/node_modules/ws/wrapper.mjs [app-route] (ecmascript, async loader)")).default;
    const url = getWsUrl(baseUrl);
    const ws = new WebSocket(url);
    return new Promise((resolve, reject)=>{
        const timeout = setTimeout(()=>{
            ws.close();
            reject(new Error("WebSocket timeout"));
        }, 15000);
        let authenticated = false;
        const listId = 1;
        ws.on("message", (raw)=>{
            let msg;
            try {
                msg = JSON.parse(raw.toString());
            } catch  {
                return;
            }
            if (msg.type === "auth_required") {
                ws.send(JSON.stringify({
                    type: "auth",
                    access_token: token
                }));
                return;
            }
            if (msg.type === "auth_ok") {
                authenticated = true;
                ws.send(JSON.stringify({
                    id: listId,
                    type: "config/area_registry/list"
                }));
                return;
            }
            if (msg.type === "auth_invalid") {
                clearTimeout(timeout);
                ws.close();
                reject(new Error(msg.message ?? "WebSocket auth failed"));
                return;
            }
            if (msg.type === "result" && msg.id === listId) {
                clearTimeout(timeout);
                ws.close();
                const result = msg.result;
                const list = Array.isArray(result) ? result.map((a)=>({
                        area_id: a.area_id ?? "",
                        name: a.name ?? ""
                    })) : [];
                resolve(list);
            }
        });
        ws.on("error", (err)=>{
            clearTimeout(timeout);
            reject(err);
        });
        ws.on("close", ()=>{
            clearTimeout(timeout);
        });
    });
}
async function connectHaWebSocket(baseUrl, token, onEvent) {
    const WebSocket = (await __turbopack_context__.A("[project]/node_modules/ws/wrapper.mjs [app-route] (ecmascript, async loader)")).default;
    const url = getWsUrl(baseUrl);
    const ws = new WebSocket(url);
    let messageId = 1;
    const pending = new Map();
    return new Promise((resolve, reject)=>{
        ws.on("open", ()=>{});
        ws.on("message", (raw)=>{
            let msg;
            try {
                msg = JSON.parse(raw.toString());
            } catch  {
                return;
            }
            if (msg.type === "auth_required") {
                ws.send(JSON.stringify({
                    type: "auth",
                    access_token: token
                }));
                return;
            }
            if (msg.type === "auth_ok") {
                ws.send(JSON.stringify({
                    id: messageId,
                    type: "subscribe_events",
                    event_type: "state_changed"
                }));
                const id = messageId++;
                pending.set(id, {
                    resolve: ()=>{}
                });
                return;
            }
            if (msg.type === "auth_invalid") {
                reject(new Error(msg.message ?? "WebSocket auth failed"));
                return;
            }
            if (msg.type === "result" && msg.id !== undefined) {
                const p = pending.get(msg.id);
                if (p) {
                    pending.delete(msg.id);
                    p.resolve();
                }
                if (pending.size === 0) {
                    resolve(()=>ws.close());
                }
                return;
            }
            if (msg.type === "event" && msg.event?.data) {
                const d = msg.event.data;
                onEvent({
                    entity_id: d.entity_id,
                    old_state: d.old_state ?? null,
                    new_state: d.new_state ?? null
                });
            }
        });
        ws.on("error", (err)=>reject(err));
        ws.on("close", ()=>{
            pending.forEach((p)=>p.resolve());
        });
    });
}
}),
];

//# sourceMappingURL=src_lib_ha_websocket_ts_a882718e._.js.map