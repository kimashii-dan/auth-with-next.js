import { jwtVerify } from "jose";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup";
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (refreshToken) {
    try {
      await jwtVerify(
        refreshToken,
        new TextEncoder().encode(process.env.TOKEN_SECRET)
      );
      if (isPublicPath) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch (error) {
      console.error("Invalid token:", error);

      if (!isPublicPath) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }
  } else {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/profile", "/login", "/signup", "/", "/game"],
};
