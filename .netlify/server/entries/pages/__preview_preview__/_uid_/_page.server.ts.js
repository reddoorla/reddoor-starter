import { t as createClient } from "../../../../chunks/prismicio.js";
import { error } from "@sveltejs/kit";
import { asText } from "@prismicio/client";
//#region src/routes/[[preview=preview]]/[uid]/+page.server.ts
async function load({ params, fetch, cookies }) {
	const client = createClient({
		fetch,
		cookies
	});
	try {
		const page = await client.getByUID("page", params.uid);
		return {
			page,
			title: asText(page.data.title),
			meta_description: page.data.meta_description,
			meta_title: page.data.meta_title,
			meta_image: page.data.meta_image.url
		};
	} catch (e) {
		error(404, { message: "Page not found" });
	}
}
async function entries() {
	return (await createClient().getAllByType("page")).map((page) => {
		return { uid: page.uid };
	});
}
//#endregion
export { entries, load };
