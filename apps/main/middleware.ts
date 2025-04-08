import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

const protectedRoutes = [
  "/dashboard",
  "/archive"
]

const onlyPublicRoutes = [
  "/sign-in",
  "/sign-up"
]

export async function middleware(req: NextRequest) {
  const isProtecteRoute = protectedRoutes.includes(req.nextUrl.pathname)
  const isOnlyPublicRoute = onlyPublicRoutes.includes(req.nextUrl.pathname)
  // console.log("isProtecteRoute: ", isProtecteRoute)
  // console.log("isOnlyPublicRoute: ", isOnlyPublicRoute)

  const cookies = getSessionCookie(req);
  if (!cookies && isProtecteRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const session = await auth.api.getSession({
    headers: await headers()
  })

  // console.log("session: ", session)

  if (!session && isProtecteRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (session && isOnlyPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
