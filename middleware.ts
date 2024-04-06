import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useSession } from "./hooks/useSession";



export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const identityRoutes = pathname === "/identity/create" || pathname === "/identity/signin";
    const appRoute = pathname === "/app" || pathname === "/identity";

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const user = useSession()
    if (identityRoutes && user) {
        console.log("MIDDLEWAR PRVENTED THE ACCESS TO THIS PAGE");
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }
    if (appRoute && !user) {
        console.log("MIDDLEWAR PRVENTED THE ACCESS TO THIS PAGE");
        return NextResponse.redirect(new URL('/identity/signin', request.url));
    }
}

