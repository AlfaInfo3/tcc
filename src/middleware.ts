import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Verifica se o caminho atual é uma rota administrativa (mas não as páginas de autenticação)
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin/') &&
                     !request.nextUrl.pathname.startsWith('/admin/auth') &&
                     request.nextUrl.pathname !== '/admin/auth' &&
                     request.nextUrl.pathname !== '/admin' &&
                     !request.nextUrl.pathname.startsWith('/api/');

  if (isAdminPath) {
    // Verifica se o usuário está autenticado como administrador
    const token = request.cookies.get('admin_token')?.value;

    // Se não houver token e não estivermos na página de autenticação, redireciona para login
    if (!token) {
      return NextResponse.redirect(new URL('/admin/auth', request.url));
    }
  }

  return NextResponse.next();
}

// Especifica os caminhos para os quais o middleware deve ser executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};