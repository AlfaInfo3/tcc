import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/password';
import { findOrCreateStudent } from '@/lib/students';

export async function POST(req: Request) {
  try {
    const { name, className, username, password } = await req.json();

    if (!name || !className || !username || !password) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    // 1. Check if username is taken
    const existingProfile = await prisma.studentProfile.findUnique({
      where: { username }
    });

    if (existingProfile) {
      return NextResponse.json({ error: 'Usuário já existe' }, { status: 409 });
    }

    // 2. Localiza o aluno pelo nome/turma normalizados ou cria o cadastro.
    const { student } = await findOrCreateStudent(name, className);

    // 4. Check if student already has a profile
    const existingLink = await prisma.studentProfile.findUnique({
      where: { studentId: student.id }
    });

    if (existingLink) {
        return NextResponse.json({ error: 'Este aluno já possui um perfil gamificado.' }, { status: 409 });
    }

    // 5. Create Profile with a bcrypt hash
    const passwordHash = await hashPassword(password);

    const profile = await prisma.studentProfile.create({
      data: {
        studentId: student.id,
        username,
        password: passwordHash,
        xp: 0,
        level: 1,
        streak: 0
      }
    });

    return NextResponse.json({ success: true, profileId: profile.id });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro no cadastro' }, { status: 500 });
  }
}
