import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-api';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  if (session.role !== 'super_admin') {
    return NextResponse.json(
      { error: 'Apenas super administradores podem alterar o status de usuários' },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { isActive } = body;

    if (isActive === undefined) {
      return NextResponse.json(
        { error: 'O campo isActive é obrigatório' },
        { status: 400 }
      );
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive deve ser um valor booleano' },
        { status: 400 }
      );
    }

    const target = await prisma.adminUser.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (id === session.userId && isActive === false) {
      return NextResponse.json(
        { error: 'Você não pode desativar a própria conta' },
        { status: 400 }
      );
    }

    if (target.role === 'super_admin' && isActive === false) {
      const otherSuperAdmins = await prisma.adminUser.count({
        where: {
          id: { not: id },
          role: 'super_admin',
          isActive: true,
        },
      });

      if (otherSuperAdmins === 0) {
        return NextResponse.json(
          { error: 'Não é possível desativar o último super administrador ativo' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar status do usuário administrador:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2025'
    ) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Erro interno ao atualizar status do usuário administrador' },
      { status: 500 }
    );
  }
}
