import { E as clsx, c as sanitize_props, d as stringify, dt as fallback, l as slot, n as attr_style, ot as invalid_default_snippet, p as html, r as bind_props, t as attr_class } from "../../../chunks/server.js";
import { t as SliceZone } from "../../../chunks/dist.js";
import { SimulatorManager, StateEventType, getDefaultMessage, getDefaultProps, getDefaultSlices, simulatorClass, simulatorRootClass } from "@prismicio/simulator/kit";
//#region node_modules/@slicemachine/adapter-sveltekit/dist/simulator/SliceSimulator.svelte
function SliceSimulator($$renderer, $$props) {
	const $$sanitized_props = sanitize_props($$props);
	$$renderer.component(($$renderer) => {
		const defaultProps = getDefaultProps();
		let zIndex = fallback($$props["zIndex"], () => defaultProps.zIndex, true);
		let background = fallback($$props["background"], () => defaultProps.background, true);
		let slices = getDefaultSlices();
		let message = getDefaultMessage();
		if (typeof window !== "undefined") {
			const simulatorManager = new SimulatorManager();
			simulatorManager.state.on(StateEventType.Slices, (newSlices) => {
				slices = newSlices;
			}, "simulator-slices");
			simulatorManager.state.on(StateEventType.Message, (newMessage) => {
				message = newMessage;
			}, "simulator-message");
			simulatorManager.init();
		}
		$$renderer.push(`<div${attr_class(`${stringify(simulatorClass)} ${stringify($$sanitized_props.class)}`)}${attr_style(`z-index: ${stringify(zIndex)}; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; overflow: auto; background: ${stringify(background)}`)}>`);
		if (message) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<article>${html(message)}</article>`);
		} else if (slices.length) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div id="root"${attr_class(clsx(simulatorRootClass))}><!--[-->`);
			slot($$renderer, $$props, "default", { slices }, null);
			$$renderer.push(`<!--]--></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, {
			zIndex,
			background
		});
	});
}
//#endregion
//#region src/routes/slice-simulator/+page.svelte
function _page($$renderer) {
	SliceSimulator($$renderer, {
		children: invalid_default_snippet,
		$$slots: { default: ($$renderer, { slices }) => {
			SliceZone($$renderer, { slices });
		} }
	});
}
//#endregion
export { _page as default };
