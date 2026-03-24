import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CrLCxnsU.js","_app/immutable/chunks/CD8BJFR3.js","_app/immutable/chunks/kG6nnWAp.js","_app/immutable/chunks/9I0lYmcL.js","_app/immutable/chunks/D1hYfEew.js","_app/immutable/chunks/DbhimMXQ.js"];
export const stylesheets = ["_app/immutable/assets/0.Dkcb1wrz.css"];
export const fonts = [];
