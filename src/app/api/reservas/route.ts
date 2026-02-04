import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Since we don't have a public Student model registration in this flow,
    // we need to decide how to link the reservation.
    // The requirement says "Aluno (sem login)".
    // We should probably find or create a Student record based on name+class/code
    // OR linked to a "Guest" student concept if the schema requires strict relation.
    // The provided schema has `model Reservation { student Student ... }`.
    // So we MUST have a student ID.
    
    // For this MVP/Project Plan where "Aluno sem login" reserves:
    // We will auto-create a student record if one doesn't exist with this name/class
    // to satisfy the foreign key constraint.
    
    // Generate a pseudo-unique hash or use name+class as identifier key
    const { normalizeString } = require('@/lib/utils/string');
    
    // Smart Linking Logic
    const normalizedName = normalizeString(name);
    // Note: Class matching should also be somewhat loose or exact? 
    // The user said "Ignorar acentos..." for name. Assuming class is also normalized.
    // However, classes like "1º A" vs "1 A" might be tricky. 
    // For now, strict string normalization on input.
    // But we should strictly search for the student.

    // Try to find existing student
    // We search by normalizedName to catch slight variations if they were stored normalized
    // But since `class` is free text, it's safer to check normalizedName AND class?
    // Let's assume the user enters "1º A" consistently.
    // If we only check name, we might link "Rickson" of "1B" to "Rickson" of "1A".
    // So we MUST check class too.

    let student = await prisma.student.findFirst({
        where: { 
            normalizedName: normalizedName,
            // Use case-insensitive mode for class to catch '1a' vs '1A'
            class: {
                equals: className.trim(),
                mode: 'insensitive' // Postgres specific, fails on SQLite but we are using Postgres? schema says postgres.
            }
        }
    });

    if (!student) {
        // If not found, create new
        const crypto = require('crypto');
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

    const reservation = await prisma.reservation.create({
      data: {
        bookId,
        studentId: student.id,
        status: 'reserved'
      }
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Erro ao criar reserva' },
      { status: 500 }
    );
  }
}