import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Proteger rotas de API Administrativa (/api/admin/*)
  if (pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth')) {
    const token = request.cookies.get('admin_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Acesso não autorizado' },
        { status: 401 }
      );
    }
  }

  // 2. Proteger páginas administrativas (/admin, /admin/* exceto /admin/auth)
  const isAdminPage = (pathname === '/admin' || pathname.startsWith('/admin/')) &&
                      !pathname.startsWith('/admin/auth');

  if (isAdminPage) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/auth', request.url));
    }
  }

  return NextResponse.next();
}

// Executar em todas as rotas exceto arquivos estáticos e favicon
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};