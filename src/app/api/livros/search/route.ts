import { NextRequest, NextResponse } from 'next/server';
import { searchBooksUnified } from '@/lib/book-search';
import { getCache, setCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || searchParams.get('isbn') || '';

  // Validation
  if (!q) {
    return NextResponse.json(
      { error: 'Parâmetro de busca "q" ou "isbn" é obrigatório' },
      { status: 400 }
    );
  }

  const searchTerm = q.trim();
  if (searchTerm.length < 2) {
    return NextResponse.json(
      { error: 'Termo de busca deve ter pelo menos 2 caracteres' },
      { status: 400 }
    );
  }

  const cacheKey = `search_unified_${searchTerm.toLowerCase()}`;
  const cached = getCache(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const books = await searchBooksUnified(searchTerm);
    setCache(cacheKey, books);

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar livros' },
      { status: 500 }
    );
  }
}