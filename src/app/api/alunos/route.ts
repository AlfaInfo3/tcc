import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/auth-api';

function normalize(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function generateCodeHash(name: string, className: string) {
  return crypto
    .createHash('md5')
    .update(`${name}-${className}-${Date.now()}`)
    .digest('hex')
    .substring(0, 8);
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const students = await prisma.student.findMany();

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Basic validation. The code hash is always generated server-side.
    if (!data.name || typeof data.name !== 'string' || !data.class || typeof data.class !== 'string') {
        return NextResponse.json({ error: 'Dados inválidos. Nome e Turma são obrigatórios.' }, { status: 400 });
    }

    const name = data.name.trim();
    const className = data.class.trim();
    const normalizedName = normalize(name);

    const existingStudent = await prisma.student.findFirst({
        where: {
          normalizedName,
          class: { equals: className, mode: 'insensitive' }
        }
    });

    if (existingStudent) {
        return NextResponse.json({ error: 'Estudante já cadastrado nesta turma.' }, { status: 409 });
    }

    const student = await prisma.student.create({
      data: {
        name,
        class: className,
        normalizedName,
        codeHash: generateCodeHash(normalizedName, className)
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
