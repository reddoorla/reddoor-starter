import { r as redirectToPreviewURL, t as createClient } from "../../../../chunks/prismicio.js";
//#region src/routes/api/preview/+server.js
async function GET({ fetch, request, cookies }) {
	return await redirectToPreviewURL({
		client: createClient({ fetch }),
		request,
		cookies
	});
}
//#endregion
export { GET };
