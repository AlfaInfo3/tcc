import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

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

    // Busca o usuário no banco de dados
    const adminUser = await prisma.adminUser.findUnique({
      where: {
        email: email,
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

    // Em um sistema real, você geraria um JWT real aqui
    // Por enquanto, estamos usando um token fixo para demonstração
    // Mas o importante é que agora estamos autenticando contra o banco de dados
    return NextResponse.json({
      success: true,
      token: 'fake-jwt-token',
      userId: adminUser.id,
      userName: adminUser.name,
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