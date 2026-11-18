import { prisma } from '@/lib/prisma';
import type { Book } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySignedSessionToken } from '@/lib/security';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('student_session')?.value;

    if (!sessionToken) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const verification = verifySignedSessionToken(sessionToken, 'student');
    const profileId = verification.valid && verification.payload ? verification.payload.sub : null;

    if (!profileId) {
        return NextResponse.json({ error: 'Sessão inválida ou expirada' }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
        where: { id: profileId },
        include: {
            badges: { include: { badge: true } },
            student: {
                include: {
                    loans: {
                        include: { book: true },
                        orderBy: { loanDate: 'desc' }
                    },
                    reservations: {
                        include: { book: true },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            }
        }
    });

    if (!profile) {
        return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });
    }

    const totalReads = profile.student.loans.filter(l => l.status === 'returned').length;
    const activeLoans = profile.student.loans.filter(l => l.status === 'active');
    const currentLoansCount = activeLoans.length;

    // Calculate Stats
    // --- Quests Logic ---
    const dailyQuests = [
        { 
            id: 'q1', 
            title: 'Leitor Diário', 
            desc: 'Faça login no portal', 
            progress: 1, 
            total: 1, 
            completed: true,
            xp: 10 
        },
        { 
            id: 'q2', 
            title: 'Maratona', 
            desc: 'Leia 1 livro esta semana', 
            progress: totalReads > 0 ? 1 : 0, // Simplified for demo
            total: 1, 
            completed: totalReads > 0,
            xp: 50
        }
    ];

    // --- Recommendation Logic ---
    // 1. Extract genres from history
    const allGenres = profile.student.loans
        .filter(l => l.status === 'returned' && l.book?.genres)
        .flatMap(l => l.book.genres || []);
    
    // 2. Count frequency
    const genreCounts: Record<string, number> = {};
    allGenres.forEach(g => { if(g) genreCounts[g] = (genreCounts[g] || 0) + 1; });
    
    // 3. Find top genre
    const topGenre = Object.entries(genreCounts).sort((a,b) => b[1] - a[1])[0]?.[0];

    // 4. Fetch recommendations
    let recommendations: Book[] = [];
    if (topGenre) {
        // Get IDs of read books to exclude
        const readBookIds = profile.student.loans.map(l => l.bookId);
        
        recommendations = await prisma.book.findMany({
            where: {
                genres: { has: topGenre },
                id: { notIn: readBookIds },
                quantity: { gt: 0 } // Only available books
            },
            take: 3
        });
    }

    // Fallback if no specific recommendations (or not enough history)
    if (recommendations.length === 0) {
         const readBookIds = profile.student.loans.map(l => l.bookId);
         recommendations = await prisma.book.findMany({
            where: {
                id: { notIn: readBookIds },
                 quantity: { gt: 0 }
            },
            take: 3,
            orderBy: { createdAt: 'desc' } // Newest books
        });
    }

    return NextResponse.json({
        profile: {
            username: profile.username,
            level: profile.level,
            xp: profile.xp,
            streak: profile.streak,
            badges: profile.badges
        },
        student: {
            name: profile.student.name,
            class: profile.student.class
        },
        history: {
            loans: profile.student.loans,
            reservations: profile.student.reservations,
            totalReads,
            currentLoans: activeLoans,
            currentLoansCount
        },
        quests: dailyQuests,
        recommendations
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao carregar dashboard' }, { status: 500 });
  }
}
