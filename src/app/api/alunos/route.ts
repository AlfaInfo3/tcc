import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-api';
import { findOrCreateStudent } from '@/lib/students';

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
    const { student, created } = await findOrCreateStudent(name, className);

    if (!created) {
      return NextResponse.json(
        { error: 'Estudante já cadastrado nesta turma.', student },
        { status: 409 }
      );
    }

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
