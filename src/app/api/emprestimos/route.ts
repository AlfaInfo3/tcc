import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Filtrar por status opcionalmente
    
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }
    
    const loans = await prisma.loan.findMany({
      where: whereClause,
      include: {
        book: true,
        student: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json({ error: 'Failed to fetch loans' }, { status: 500 });
  }
}