import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSignedSessionToken } from '@/lib/security';
import { hashPassword, verifyPassword } from '@/lib/password';
import { getClientIp, rateLimit, resetRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    const rateLimitKey = `student-login:${getClientIp(req)}:${String(username).toLowerCase()}`;
    const limit = rateLimit(rateLimitKey, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Muitas tentativas. Tente novamente em ${limit.retryAfterSeconds}s.` },
        { status: 429 }
      );
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { username }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
    }

    const { valid, needsRehash } = await verifyPassword(password, profile.password);

    if (!valid) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
    }

    // Transparently upgrade legacy unsalted SHA-256 hashes to bcrypt on login.
    if (needsRehash) {
      try {
        await prisma.studentProfile.update({
          where: { id: profile.id },
          data: { password: await hashPassword(password) },
        });
      } catch (rehashError) {
        console.error('Falha ao migrar hash de senha do aluno:', rehashError);
      }
    }

    resetRateLimit(rateLimitKey);

    // Gera token de sessão assinado criptograficamente
    const sessionToken = createSignedSessionToken(profile.id, 'student', 60 * 60 * 24 * 7);

    const cookieStore = await cookies();
    cookieStore.set('student_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/'
    });

    return NextResponse.json({ success: true, token: sessionToken });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro no login' }, { status: 500 });
  }
}
