import * as server from '../entries/pages/__preview_preview__/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/__preview_preview__/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[[preview=preview]]/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.OToi4OcR.js","_app/immutable/chunks/CD8BJFR3.js","_app/immutable/chunks/D1hYfEew.js"];
export const stylesheets = [];
export const fonts = [];
