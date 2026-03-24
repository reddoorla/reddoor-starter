import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CQt7mFmM.js","_app/immutable/chunks/DXddV-Qf.js","_app/immutable/chunks/CaZTh6wa.js","_app/immutable/chunks/B09JuRqH.js","_app/immutable/chunks/D1hYfEew.js","_app/immutable/chunks/D7V6ZGtf.js"];
export const stylesheets = ["_app/immutable/assets/0._5qMCjfU.css"];
export const fonts = [];
