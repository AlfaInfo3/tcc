import { NextRequest, NextResponse } from 'next/server';
import { verifySignedSessionTokenEdge } from '@/lib/security-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Expose the current pathname to Server Components. Layouts cannot read the
  // pathname directly, and the admin layout needs it to skip the login page.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  const passThrough = () => NextResponse.next({ request: { headers: requestHeaders } });

  // Login/logout endpoints and the login page must stay public.
  if (pathname.startsWith('/admin/auth') || pathname.startsWith('/api/admin/auth')) {
    return passThrough();
  }

  const isAdminApi = pathname.startsWith('/api/admin/');
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');

  if (!isAdminApi && !isAdminPage) {
    return passThrough();
  }

  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const token = request.cookies.get('admin_token')?.value || bearer;

  // Cryptographically validate signature, expiry and role. This blocks forged
  // cookies such as `admin_token=x`, which a mere presence check would accept.
  const verification = token
    ? await verifySignedSessionTokenEdge(token, 'admin')
    : { valid: false };

  if (!verification.valid) {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, error: 'Acesso não autorizado' },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL('/admin/auth', request.url));
  }

  return passThrough();
}

// Executar em todas as rotas exceto arquivos estáticos e favicon
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
