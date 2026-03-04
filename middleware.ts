import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const LOGIN_PATH = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login은 보호하지 않음
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    response.cookies.delete("admin_token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
