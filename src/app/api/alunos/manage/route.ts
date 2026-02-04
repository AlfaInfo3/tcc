import { prisma } from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { isAuthenticated } from '@/lib/auth-api';

function normalize(str: string) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, class: className, username, password } = await request.json();

    if (!name || !className) {
        return NextResponse.json({ error: 'Nome e Turma são obrigatórios' }, { status: 400 });
    }

    // 1. If username provided, check availability first
    if (username) {
        const existingProfile = await prisma.studentProfile.findUnique({
             where: { username }
        });
        if (existingProfile) {
            return NextResponse.json({ error: 'Nome de usuário já está em uso.' }, { status: 409 });
        }
    }

    const normalizedName = normalize(name);
    
    // 2. Check duplicate Student
    const existing = await prisma.student.findFirst({
        where: { 
            normalizedName,
            class: {
                equals: className.trim(),
                mode: 'insensitive'
            }
        }
    });

    if (existing) {
        return NextResponse.json({ 
            error: 'Aluno já cadastrado nesta turma', 
            student: existing 
        }, { status: 409 });
    }

    // 3. Create Student
    const codeHash = crypto.createHash('md5').update(`${normalizedName}-${className}-${Date.now()}`).digest('hex').substring(0, 8);

    const student = await prisma.student.create({
        data: {
            name,
            class: className,
            normalizedName,
            codeHash
        }
    });

    // 4. Create Profile (if requested)
    if (username && password) {
         const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
         await prisma.studentProfile.create({
             data: {
                 studentId: student.id,
                 username,
                 password: passwordHash,
                 xp: 0,
                 level: 1
             }
         });
    }

    return NextResponse.json(student);

  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: 'Erro ao criar aluno' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    if (!await isAuthenticated(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, name, class: className } = await request.json();
    
        if (!id || !name || !className) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }
    
        const normalizedName = normalize(name);
        
        await prisma.student.update({
            where: { id },
            data: {
                name,
                class: className,
                normalizedName
            }
        });
    
        return NextResponse.json({ success: true });
    
      } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
      }
}
