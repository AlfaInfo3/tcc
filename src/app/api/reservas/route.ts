import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { findOrCreateStudent } from '@/lib/students';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, className, bookId } = body;

    if (!name || !className || !bookId) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Informe o nome completo do aluno (mínimo 2 caracteres).' },
        { status: 400 }
      );
    }

    if (typeof className !== 'string' || className.trim().length === 0) {
      return NextResponse.json(
        { error: 'Informe a turma ou série do aluno.' },
        { status: 400 }
      );
    }

    // 1. Verify and locate the book
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        loans: {
          where: { status: 'active' }
        },
        reservations: {
          where: { status: 'reserved' }
        }
      }
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Livro não localizado no acervo escolar.' },
        { status: 404 }
      );
    }

    // 2. Check available physical copies
    const activeLoansCount = book.loans ? book.loans.length : 0;
    const activeResCount = book.reservations ? book.reservations.length : 0;
    const availableCopies = Math.max(0, book.quantity - activeLoansCount - activeResCount);

    if (availableCopies <= 0) {
      return NextResponse.json(
        { error: 'Todos os exemplares deste título já estão reservados ou emprestados no momento.' },
        { status: 409 }
      );
    }

    // 3. Identificação inteligente ou cadastro automático do aluno
    const { student } = await findOrCreateStudent(name, className);

    // 4. Verify if student already has a pending reservation for this book
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        bookId: book.id,
        studentId: student.id,
        status: 'reserved'
      }
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: 'Você já possui uma reserva ativa para este livro. Dirija-se à biblioteca para a retirada.' },
        { status: 400 }
      );
    }

    // 5. Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        bookId: book.id,
        studentId: student.id,
        status: 'reserved'
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            class: true
          }
        }
      }
    });

    revalidateTag('public-books', 'default');

    return NextResponse.json(
      {
        success: true,
        message: 'Reserva realizada com sucesso!',
        reservation
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Erro interno ao registrar a reserva. Tente novamente mais tarde.' },
      { status: 500 }
    );
  }
}