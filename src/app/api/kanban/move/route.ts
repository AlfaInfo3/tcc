
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, fromStatus, toStatus, loanDate, dueDate, returnDate } = body;

    // Transition: Reserved -> Active (Loan Creation)
    if (fromStatus === 'reserved' && toStatus === 'active') {
      // 1. Find the reservation
      const reservation = await prisma.reservation.findUnique({
        where: { id: itemId },
        include: { book: true }
      });

      if (!reservation) {
        return NextResponse.json({ error: 'Reserva não encontrada' }, { status: 404 });
      }

      // 2. Create the Loan
      // Default to 14 days if not provided
      const defaultDuration = 14; 
      const finalDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + defaultDuration * 24 * 60 * 60 * 1000);

      const loan = await prisma.loan.create({
        data: {
          bookId: reservation.bookId,
          studentId: reservation.studentId,
          status: 'active',
          loanType: 'online', // Converted from reservation means it originated from Web
          dueDate: finalDueDate,
          loanDate: new Date()
        }
      });

      // 3. Update Reservation status to 'confirmed' (or delete?)
      // Let's keep it as history 'confirmed'
      await prisma.reservation.update({
        where: { id: itemId },
        data: { status: 'confirmed' }
      });

      // 4. Update Book Stock?
      // "Quantity" usually refers to total stock. 
      // If we want to track "available", we might decrement availability or just count active loans.
      // Current system seems to check quantity > 0.
      // If quantity means "Available on shelf", then we decrement.
      // If quantity means "Total assets", we don't change it, but availability check needs to count loans.
      // Existing BookCard logic: `isAvailable = book.quantity > 0`.
      // This implies `quantity` is "Available Items". So we decrement.
      await prisma.book.update({
        where: { id: reservation.bookId },
        data: {
          quantity: { decrement: 1 }
        }
      });

      return NextResponse.json({ success: true, loan });
    }

    // Transition: Active -> Returned
    if (fromStatus === 'active' && toStatus === 'returned') {
      // 1. Find the Loan (itemId here is expected to be the LOAN ID, NOT Reservation ID)
      // *Correction*: When dragging, the frontend must know if it's dragging a Reservation or a Loan.
      // If it was in "Emprestados" column, it's a Loan ID.
      
      const loan = await prisma.loan.update({
        where: { id: itemId },
        data: {
          status: 'returned',
          returnDate: new Date() // Now
        }
      });

      // 2. Increment Book Stock
      await prisma.book.update({
        where: { id: loan.bookId },
        data: {
          quantity: { increment: 1 }
        }
      });

      // 3. GAMIFICATION: Award XP
      try {
        const profile = await prisma.studentProfile.findUnique({
             where: { studentId: loan.studentId }
        });
        
        if (profile) {
            await prisma.studentProfile.update({
                where: { id: profile.id },
                data: {
                    xp: { increment: 50 }, // +50 XP per book
                    level: { 
                        set: Math.floor((profile.xp + 50) / 100) + 1 
                    },

                }
            });
            // We could check badges here too
        }
      } catch (e) {
        console.error('Error awarding XP:', e);
        // Don't fail the return if XP fails
      }

      return NextResponse.json({ success: true, loan });
    }

    // Transition: Returned -> Active (Re-opening a loan? - Unlikely but possible error correction)
    // Not implementing for MVP unless requested.

    return NextResponse.json({ error: 'Transição inválida' }, { status: 400 });

  } catch (error) {
    console.error('Error processing kanban move:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a movimentação' },
      { status: 500 }
    );
  }
}
