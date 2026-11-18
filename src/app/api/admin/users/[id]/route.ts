import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { requireAdmin } from '@/lib/auth-api';

const ALLOWED_ROLES = ['admin', 'super_admin'];

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isPrismaNotFound(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2025'
  );
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário administrador:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar usuário administrador' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  // Only super admins may edit, deactivate or change roles.
  if (session.role !== 'super_admin') {
    return NextResponse.json(
      { error: 'Apenas super administradores podem editar usuários' },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, email, password, role, isActive } = body;

    const target = await prisma.adminUser.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const data: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      isActive?: boolean;
    } = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return NextResponse.json(
          { error: 'Nome deve ter pelo menos 2 caracteres' },
          { status: 400 }
        );
      }
      data.name = name.trim();
    }

    if (email !== undefined) {
      if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
        return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
      }

      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail !== target.email) {
        const existing = await prisma.adminUser.findUnique({
          where: { email: normalizedEmail },
        });
        if (existing && existing.id !== id) {
          return NextResponse.json(
            { error: 'Já existe um usuário com este email' },
            { status: 409 }
          );
        }
      }
      data.email = normalizedEmail;
    }

    if (role !== undefined) {
      if (typeof role !== 'string' || !ALLOWED_ROLES.includes(role)) {
        return NextResponse.json(
          { error: 'Perfil inválido. Use "admin" ou "super_admin"' },
          { status: 400 }
        );
      }
      data.role = role;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'isActive deve ser um valor booleano' },
          { status: 400 }
        );
      }

      // Never allow the current admin to deactivate their own account.
      if (id === session.userId && isActive === false) {
        return NextResponse.json(
          { error: 'Você não pode desativar a própria conta' },
          { status: 400 }
        );
      }

      data.isActive = isActive;
    }

    if (password !== undefined && password !== '') {
      if (typeof password !== 'string' || password.length < 8) {
        return NextResponse.json(
          { error: 'Senha deve ter pelo menos 8 caracteres' },
          { status: 400 }
        );
      }
      data.password = await bcrypt.hash(password, 10);
    }

    // Protect the last active super admin from being demoted or deactivated.
    const willLoseSuperAdmin =
      target.role === 'super_admin' &&
      ((data.role !== undefined && data.role !== 'super_admin') ||
        data.isActive === false);

    if (willLoseSuperAdmin) {
      const otherSuperAdmins = await prisma.adminUser.count({
        where: {
          id: { not: id },
          role: 'super_admin',
          isActive: true,
        },
      });

      if (otherSuperAdmins === 0) {
        return NextResponse.json(
          {
            error:
              'Não é possível remover ou desativar o último super administrador ativo',
          },
          { status: 400 }
        );
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 });
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar usuário administrador:', error);

    if (isPrismaNotFound(error)) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Erro interno ao atualizar usuário administrador' },
      { status: 500 }
    );
  }
}
