import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const LOGIN_PATH = "/admin/login";

function unauthorizedResponse(isApi: boolean, request: NextRequest) {
  if (isApi) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 }
    );
  }
  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // 로그인 관련 경로는 보호하지 않음
  if (pathname === LOGIN_PATH || pathname === "/api/admin/auth") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return unauthorizedResponse(isApi, request);
  }

  try {
    const jwtSecret = process.env.ADMIN_JWT_SECRET;
    if (!jwtSecret) {
      return unauthorizedResponse(isApi, request);
    }
    const secret = new TextEncoder().encode(jwtSecret);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    if (isApi) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }
    const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    response.cookies.delete("admin_token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
