import { i as derived } from "../../../chunks/server.js";
//#region src/routes/[[preview=preview]]/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		derived(() => data.page.data);
	});
}
//#endregion
export { _page as default };
