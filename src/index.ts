/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import katex from "katex";
import {parseFromString}  from "dom-parser";

interface RequestBody{
	data: string
}
export default {
	// request: {data: string}
	// 
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		console.log(request);
		
		switch (url.pathname) {
			case '/message':
				return new Response('Hello, World!');
			case '/markdown':
				const body: RequestBody = await request.json();
				if (body) {
					// delete text <span class="katex-html" aria-hidden="true"> </span>
					let result = katex.renderToString(body["data"])
					let dom = parseFromString(result);
					let span = dom.getElementsByClassName('katex-mathml');
					return new Response(span[0].outerHTML);
				}
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
