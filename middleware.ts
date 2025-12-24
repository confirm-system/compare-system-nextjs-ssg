import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証不要なパス
  const publicPaths = ['/', '/login', '/register'];
  const apiPaths = ['/api', '/_next', '/favicon.ico'];

  // パブリックパスまたはAPIパスの場合はそのまま通す
  if (
    publicPaths.includes(pathname) ||
    apiPaths.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  // トークンを取得（CookieまたはAuthorizationヘッダーから）
  const token =
    request.cookies.get('user_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // ログイン/登録ページへのアクセス時、既にトークンがある場合はリダイレクト
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // 保護されたページへのアクセス時、トークンがない場合はログインページにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 以下のパス以外にマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
