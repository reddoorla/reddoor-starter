import "../../../../chunks/server.js";
import { t as SliceZone } from "../../../../chunks/dist.js";
//#region src/routes/[[preview=preview]]/[uid]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		data.page.data;
		SliceZone($$renderer, { slices: data.page.data.slices });
	});
}
//#endregion
export { _page as default };
