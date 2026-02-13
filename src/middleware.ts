import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";

/**
 * Защита роутов админа. Роль берётся из cookie app_role (устанавливается на клиенте после загрузки профиля).
 * Если пользователь заходит на /admin без cookie или с ролью не admin — редирект на /profile.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  const appRole = request.cookies.get("app_role")?.value;

  if (appRole !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
