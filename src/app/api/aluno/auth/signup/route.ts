import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { hashPassword } from '@/lib/password';

function normalize(str: string) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

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

    // 2. Normalize and Find Student (Smart Link)
    const normalizedName = normalize(name);
    
    let student = await prisma.student.findFirst({
      where: {
        normalizedName,
        class: {
          equals: className.trim(),
          mode: 'insensitive'
        }
      }
    });

    // 3. Create Student if not exists
    if (!student) {
      const codeHash = crypto.createHash('md5').update(`${normalizedName}-${className.trim()}-${Date.now()}`).digest('hex').substring(0, 8);
      student = await prisma.student.create({
        data: {
          name: name.trim(),
          class: className.trim(),
          normalizedName,
          codeHash
        }
      });
    }

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
