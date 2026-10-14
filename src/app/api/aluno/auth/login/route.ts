import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createSignedSessionToken } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { username }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    if (profile.password !== passwordHash) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos' }, { status: 401 });
    }

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
