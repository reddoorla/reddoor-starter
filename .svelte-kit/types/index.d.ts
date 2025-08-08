type DynamicRoutes = {
	"/[[preview=preview]]": { preview?: string };
	"/[[preview=preview]]/[uid]": { preview?: string; uid: string }
};

type Layouts = {
	"/": { preview?: string; uid?: string };
	"/api": undefined;
	"/api/preview": undefined;
	"/slice-simulator": undefined;
	"/[[preview=preview]]": { preview?: string; uid?: string };
	"/[[preview=preview]]/[uid]": { preview?: string; uid: string }
};

export type RouteId = "/" | "/api" | "/api/preview" | "/slice-simulator" | "/[[preview=preview]]" | "/[[preview=preview]]/[uid]";

export type RouteParams<T extends RouteId> = T extends keyof DynamicRoutes ? DynamicRoutes[T] : Record<string, never>;

export type LayoutParams<T extends RouteId> = Layouts[T] | Record<string, never>;

export type Pathname = "/" | "/api" | "/api/preview" | "/slice-simulator" | `${string}` & {} | `${string}/${string}` & {};

export type ResolvedPathname = `${"" | `/${string}`}${Pathname}`;

export type Asset = "/favicon.png";