import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "@/lib/edge-auth";

// Gate server-rendered pages that require a signed-in user (or an admin).
// Client components under these paths still double-check via useAuth() /
// /api/auth/me, since middleware only sees the request, not React state.
const PROTECTED_PREFIXES = ["/dashboard"];
const ADMIN_PREFIXES = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const payload = token ? await verifyTokenEdge(token) : null;

  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const needsAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  if (needsAuth && !payload) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (needsAdmin && payload?.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
