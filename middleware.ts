import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getBrowserCookie } from "@/server/authentication/session";



export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const identityRoutes = pathname === "/identity/create" || pathname === "/identity/signin";
    const appRoute = pathname === "/app" || pathname === "/identity";
    const user = getBrowserCookie();
    const session = user.sessionExists



    if (identityRoutes && session) {
        console.log("MIDDLEWAR PRVENTED THE ACCESS TO THIS PAGE");
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    if (appRoute && !session) {
        console.log("MIDDLEWAR PRVENTED THE ACCESS TO THIS PAGE");
        return NextResponse.redirect(new URL('/identity/signin', request.url));
    }

}

