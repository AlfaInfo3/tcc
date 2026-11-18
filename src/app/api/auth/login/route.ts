import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { createSignedSessionToken } from '@/lib/security';
import { getClientIp, rateLimit, resetRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validações
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email e senha devem ser strings válidas' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const rateLimitKey = `admin-login:${getClientIp(request)}:${normalizedEmail}`;
    const limit = rateLimit(rateLimitKey, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Muitas tentativas de login. Tente novamente em ${limit.retryAfterSeconds}s.`,
        },
        { status: 429 }
      );
    }

    // Busca o usuário no banco de dados
    const adminUser = await prisma.adminUser.findUnique({
      where: {
        email: normalizedEmail,
        isActive: true
      }
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verifica a senha (assumindo que ela está armazenada como hash no banco)
    const isValidPassword = await bcrypt.compare(password, adminUser.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    resetRateLimit(rateLimitKey);

    // Gera token de sessão criptograficamente assinado (HMAC-SHA256)
    const signedToken = createSignedSessionToken(adminUser.id, 'admin', 60 * 60 * 24 * 7);

    // Set secure HTTP-only Cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', signedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({
      success: true,
      token: signedToken,
      userId: adminUser.id,
      userName: adminUser.name,
      role: adminUser.role,
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro durante o login:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
