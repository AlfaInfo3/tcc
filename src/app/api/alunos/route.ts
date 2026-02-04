import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const students = await prisma.student.findMany();

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Basic validation
    if (!data.name || typeof data.name !== 'string' || !data.class || typeof data.class !== 'string' || !data.codeHash || typeof data.codeHash !== 'string') {
        return NextResponse.json({ error: 'Dados inválidos. Nome, Turma e Código são obrigatórios.' }, { status: 400 });
    }

    // Check for existing student with same code
    const existingStudent = await prisma.student.findFirst({
        where: { codeHash: data.codeHash }
    });

    if (existingStudent) {
        return NextResponse.json({ error: 'Estudante com este código já existe.' }, { status: 409 });
    }

    const student = await prisma.student.create({
      data: {
        name: data.name.trim(),
        class: data.class.trim(),
        codeHash: data.codeHash.trim()
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}