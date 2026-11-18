import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { requireAdmin } from '@/lib/auth-api';

const ALLOWED_ROLES = ['admin', 'super_admin'];

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const adminUsers = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(adminUsers);
  } catch (error) {
    console.error('Erro ao buscar usuários administradores:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar usuários administradores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  // Admins ativos podem criar usuários; apenas super admins podem criar outros super admins.
  if (session.role !== 'super_admin' && session.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role = 'admin' } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nome deve ter pelo menos 2 caracteres' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 8 caracteres' },
        { status: 400 }
      );
    }

    if (typeof role !== 'string' || !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Perfil inválido. Use "admin" ou "super_admin"' },
        { status: 400 }
      );
    }

    // Admins comuns não podem elevar o próprio nível de acesso.
    const finalRole = session.role === 'super_admin' ? role : 'admin';
    if (role === 'super_admin' && finalRole !== role) {
      return NextResponse.json(
        { error: 'Apenas super administradores podem criar super administradores' },
        { status: 403 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Já existe um usuário com este email' },
        { status: 409 }
      );
    }

    // Always bcrypt: this matches the bcrypt.compare used by the login route.
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.adminUser.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: finalRole,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    return NextResponse.json(
      { error: 'Erro interno ao criar usuário administrador' },
      { status: 500 }
    );
  }
}
