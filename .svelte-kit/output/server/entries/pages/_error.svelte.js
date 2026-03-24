import { D as escape_html } from "../../chunks/server.js";
import { t as page } from "../../chunks/state.js";
//#region src/routes/+error.svelte
function _error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-8"><h1>${escape_html(page.status)}</h1> <p class="mt-4 text-lg opacity-70">${escape_html(page.error?.message ?? "Something went wrong")}</p> <a href="/" class="mt-8 underline hover:no-underline">Go home</a></div>`);
	});
}
//#endregion
export { _error as default };
