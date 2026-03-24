
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/preview" | "/slice-simulator" | "/[[preview=preview]]" | "/[[preview=preview]]/[uid]";
		RouteParams(): {
			"/[[preview=preview]]": { preview?: MatcherParam<typeof import('../src/params/preview.js').match> };
			"/[[preview=preview]]/[uid]": { preview?: MatcherParam<typeof import('../src/params/preview.js').match>; uid: string }
		};
		LayoutParams(): {
			"/": { preview?: MatcherParam<typeof import('../src/params/preview.js').match>; uid?: string };
			"/api": Record<string, never>;
			"/api/preview": Record<string, never>;
			"/slice-simulator": Record<string, never>;
			"/[[preview=preview]]": { preview?: MatcherParam<typeof import('../src/params/preview.js').match>; uid?: string };
			"/[[preview=preview]]/[uid]": { preview?: MatcherParam<typeof import('../src/params/preview.js').match>; uid: string }
		};
		Pathname(): "/" | "/api/preview" | "/slice-simulator" | `${string}` & {} | `${string}/` & {} | `${string}/${string}` & {} | `${string}/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | "/robots.txt" | string & {};
	}
}