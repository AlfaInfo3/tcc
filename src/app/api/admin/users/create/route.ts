import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { isAuthenticated } from '@/lib/auth-api';

export async function POST(req: NextRequest) {
  if (!await isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ error: 'Preencha todos os campos obrigatórios' }, { status: 400 });
    }

    // Check duplicate
    const existing = await prisma.adminUser.findUnique({
        where: { email }
    });

    if (existing) {
        return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }

    // Hash password (SHA256 to match existing project pattern)
    // Note: In a real prod app, use bcrypt/argon2.
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const user = await prisma.adminUser.create({
        data: {
            name,
            email,
            password: passwordHash,
            role: role || 'admin',
            isActive: true
        }
    });

    return NextResponse.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
    });

  } catch (error) {
    console.error("Create Admin error:", error);
    return NextResponse.json({ error: 'Erro interno ao criar usuário' }, { status: 500 });
  }
}
