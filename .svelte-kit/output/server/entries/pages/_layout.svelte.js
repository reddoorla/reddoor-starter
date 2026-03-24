import "../../chunks/internal.js";
import { D as escape_html, T as attr, o as head } from "../../chunks/server.js";
import { i as PrismicPreview, n as repositoryName } from "../../chunks/prismicio.js";
import { t as page } from "../../chunks/state.js";
//#region src/lib/components/LandscapeModal.svelte
function LandscapeModal($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/Nav.svelte
function Nav($$renderer) {
	$$renderer.push(`<nav class="fixed top-0 left-0 w-full z-50 px-8 py-4 flex items-center justify-between"><a href="/" class="font-bold text-lg">Logo</a></nav>`);
}
//#endregion
//#region src/lib/components/Footer.svelte
function Footer($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<footer class="w-full px-8 py-12 mt-auto"><div class="flex flex-col sm:flex-row items-center justify-between gap-4"><p class="text-sm opacity-60">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Company Name</p></div></footer>`);
	});
}
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { children } = $$props;
		head("12qhfyh", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>${escape_html(page.data.title ?? "Reddoor")}</title>`);
			});
			$$renderer.push(`<link rel="canonical"${attr("href", page.url.href)}/> <meta property="og:url"${attr("content", page.url.href)}/> <meta property="og:type" content="website"/> `);
			if (page.data.meta_description) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<meta name="description"${attr("content", page.data.meta_description)}/> <meta name="twitter:description"${attr("content", page.data.meta_description)}/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (page.data.meta_title) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<meta property="og:title"${attr("content", page.data.meta_title)}/> <meta name="twitter:title"${attr("content", page.data.meta_title)}/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> `);
			if (page.data.meta_image) {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<meta property="og:image"${attr("content", page.data.meta_image)}/> <meta name="twitter:card" content="summary_large_image"/> <meta name="twitter:image"${attr("content", page.data.meta_image)}/>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]-->`);
		});
		$$renderer.push(`<main class="flex flex-col min-h-screen">`);
		Nav($$renderer, {});
		$$renderer.push(`<!----> `);
		children?.($$renderer);
		$$renderer.push(`<!----> `);
		Footer($$renderer, {});
		$$renderer.push(`<!----></main> `);
		LandscapeModal($$renderer, {});
		$$renderer.push(`<!----> `);
		PrismicPreview($$renderer, { repositoryName });
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _layout as default };
