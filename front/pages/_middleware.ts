import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkCookies, getCookie } from "cookies-next";
// In rewrite method you pass a page folder name(as a string). which // you create to handle underConstraction  functionalty.
export function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { pathname } = req.nextUrl
    const undesireableCookie = [undefined, null, ""]
    // const loggedIn = validateToken(token)
    return NextResponse.next();
    if (pathname == '/login' || pathname == '/register/user') {
        // return NextResponse.next();
        // return NextResponse.rewrite('/login')
    }
    return NextResponse.redirect(`/login`)
    // return NextResponse.redirect('/login')

}