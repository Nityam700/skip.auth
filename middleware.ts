import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/server/authentication/session";

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const identityRoutes = pathname === "/identity/create" || pathname === "/identity/signin";
    const appRoute = pathname === "/app";
    const user = getSession();
    const session = user.sessionExists

    if (identityRoutes && session) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    if (appRoute && !session) {
        return NextResponse.redirect(new URL('/identity/signin', request.url))
    }
}

export const config = {
    matcher: [
        '/identity/create',
        '/app',
        '/identity/signin',
    ]
}