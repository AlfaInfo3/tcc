import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    // 1. Find User
    const user = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // 2. Validate Password (SHA256)
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    
    if (passwordHash !== user.password) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // 3. Set Cookie
    // In production, use JWT or similar. Here we use a simple token (User ID) for MVP.
    // For real security, sign this with a secret.
    const cookieStore = await cookies();
    cookieStore.set('admin_token', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({ success: true, name: user.name });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
