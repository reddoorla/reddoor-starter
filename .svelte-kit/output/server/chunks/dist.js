import { a as ensure_array_like, i as derived, u as spread_props } from "./server.js";
import "@prismicio/client";
import "@prismicio/simulator/kit";
//#region node_modules/@prismicio/svelte/dist/SliceZone/TodoComponent.svelte
function TodoComponent($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { slice } = $$props;
		derived(() => "slice_type" in slice ? slice.slice_type : slice.type);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region node_modules/@prismicio/svelte/dist/SliceZone/SliceZone.svelte
function SliceZone($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* An array of Prismic Slices, such as the `slices` property from a Prismic
		* document.
		*/
		/**
		* An array of Prismic Slices, such as the `slices` property from a Prismic
		* document.
		*/
		/**
		* An object that maps Slice components to their corresponding API IDs.
		*
		* @example An example map:
		*
		* ```js
		* import BlockQuote from "./BlockQuote.svelte";
		* import HeroImage from "./HeroImage.svelte";
		*
		* const components = {
		* 	block_quote: BlockQuote,
		* 	hero_image: HeroImage,
		* };
		* ```
		*/
		/**
		* Arbitrary data passed to all Slice components as a `context` prop.
		*/
		/**
		* The Svelte component rendered if a component mapping from the
		* `components` prop cannot be found.
		*/
		const { slices = [], components = {}, context = {}, defaultComponent = void 0 } = $$props;
		$$renderer.push(`<!--[-->`);
		const each_array = ensure_array_like(slices);
		for (let index = 0, $$length = each_array.length; index < $$length; index++) {
			let slice = each_array[index];
			const Component = components["slice_type" in slice ? slice.slice_type : slice.type] || defaultComponent;
			if (Component) {
				$$renderer.push("<!--[0-->");
				if (slice.__mapped) {
					$$renderer.push("<!--[0-->");
					const { __mapped, ...mappedProps } = slice;
					if (Component) {
						$$renderer.push("<!--[-->");
						Component($$renderer, spread_props([mappedProps]));
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				} else {
					$$renderer.push("<!--[-1-->");
					if (Component) {
						$$renderer.push("<!--[-->");
						Component($$renderer, {
							slice,
							slices,
							context,
							index
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				}
				$$renderer.push(`<!--]-->`);
			} else {
				$$renderer.push("<!--[-1-->");
				TodoComponent($$renderer, { slice });
			}
			$$renderer.push(`<!--]-->`);
		}
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
export { SliceZone as t };
