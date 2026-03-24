import "./internal.js";
import { T as attr, i as derived, o as head } from "./server.js";
import { n as goto, t as beforeNavigate } from "./client.js";
import * as prismic from "@prismicio/client";
import { getToolbarSrc } from "@prismicio/client";
//#region node_modules/@prismicio/svelte/dist/kit/PrismicPreview.svelte
function PrismicPreview($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/**
		* The name of your Prismic repository. A Prismic Toolbar will be registered
		* using this repository.
		*/
		/**
		* The name of your Prismic repository. A Prismic Toolbar will be registered
		* using this repository.
		*/
		/**
		* The route parameter prefixed during preview sessions.
		*/
		/**
		* The name of the preview-specific route parameter prefixed during preview
		* sessions.
		*
		* Only set this value if the route parameter's name differs from the
		* parameter's value.
		*/
		const { repositoryName, routePrefix = "preview", routePrefixName = routePrefix } = $$props;
		const toolbarSrc = derived(() => getToolbarSrc(repositoryName));
		/**
		* Set to `true` when the next `beforeNavigate()` call should not prefix the
		* route.
		*/
		let endingPreview = false;
		beforeNavigate((navigation) => {
			if (navigation.to && navigation.from?.params?.[routePrefixName] === routePrefix && !(routePrefixName in (navigation.to.params || {}))) {
				if (endingPreview) {
					endingPreview = false;
					return;
				}
				navigation.cancel();
				goto(new URL(routePrefix + navigation.to.url.pathname, navigation.to.url.origin));
			}
		});
		head("9url44", $$renderer, ($$renderer) => {
			$$renderer.push(`<script defer=""${attr("src", toolbarSrc())}><\/script>`);
			$$renderer.push(`<!---->`);
		});
	});
}
//#endregion
//#region node_modules/@prismicio/svelte/dist/kit/enableAutoPreviews.js
/**
* Configures a Prismic client to automatically query draft content during a
* preview session.
*
* @param config - Configuration for the function.
*/
var enableAutoPreviews = (config) => {
	if (!config.cookies) return;
	const cookie = config.cookies.get(prismic.cookie.preview);
	if (cookie && /\.prismic\.io/.test(cookie)) config.client.queryContentFromRef(cookie);
};
//#endregion
//#region node_modules/@prismicio/svelte/dist/kit/redirectToPreviewURL.js
/**
* Redirects a visitor to the URL of a previewed Prismic document from within a
* SvelteKit `+server` file.
*
* Return the created `Response` in your `+server` file.
*
* @example
*
* ```typescript
* import { createClient } from "../lib/prismicio.js";
* import { redirectToPreviewURL } from "@prismicio/svelte/kit";
*
* export async function GET({ fetch, request }) {
* 	const client = createClient({ fetch });
*
* 	return await redirectToPreviewURL({ client, request });
* }
* ```
*/
var redirectToPreviewURL = async (config) => {
	const previewToken = new URL(config.request.url).searchParams.get("token") ?? void 0;
	const documentID = new URL(config.request.url).searchParams.get("documentId") ?? void 0;
	const routePrefix = config.routePrefix ?? "preview";
	const previewURL = await config.client.resolvePreviewURL({
		previewToken,
		documentID,
		defaultURL: config.defaultURL || "/"
	});
	if (previewToken) config.cookies.set(prismic.cookie.preview, previewToken, {
		path: "/",
		httpOnly: false
	});
	return new Response(void 0, {
		status: 307,
		headers: { Location: "/" + routePrefix + previewURL }
	});
};
//#endregion
//#region src/lib/prismicio.js
/**
* The project's Prismic repository name.
*/
var repositoryName = {
	repositoryName: "reddoor-wireframer",
	adapter: "@slicemachine/adapter-sveltekit",
	libraries: ["./src/lib/slices"],
	localSliceSimulatorURL: "http://localhost:5173/slice-simulator"
}.repositoryName;
/**
* A list of Route Resolver objects that define how a document's `url` field is resolved.
*
* {@link https://prismic.io/docs/route-resolver#route-resolver}
*
* @type {prismic.ClientConfig["routes"]}
*/
var routes = [{
	type: "page",
	uid: "home",
	path: "/"
}, {
	type: "page",
	path: "/:uid"
}];
/**
* Creates a Prismic client for the project's repository. The client is used to
* query content from the Prismic API.
*
* @param {import('@prismicio/svelte/kit').CreateClientConfig} config - Configuration for the Prismic client.
*/
var createClient = ({ cookies, ...config } = {}) => {
	const client = prismic.createClient(repositoryName, {
		routes,
		...config
	});
	enableAutoPreviews({
		client,
		cookies
	});
	return client;
};
//#endregion
export { PrismicPreview as i, repositoryName as n, redirectToPreviewURL as r, createClient as t };
