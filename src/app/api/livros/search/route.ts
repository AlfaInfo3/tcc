import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { OpenLibraryService } from '@/lib/openlibrary';
import { getCache, setCache } from '@/lib/cache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  // Validation
  if (!q) {
    return NextResponse.json(
      { error: 'Parâmetro de busca "q" é obrigatório' },
      { status: 400 }
    );
  }

  if (typeof q !== 'string' || q.trim().length < 2) {
    return NextResponse.json(
      { error: 'Termo de busca deve ter pelo menos 2 caracteres' },
      { status: 400 }
    );
  }

  const searchTerm = q.trim();

  const cached = getCache(`search_${searchTerm}`);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const books = await OpenLibraryService.searchBooks(searchTerm);
    setCache(`search_${searchTerm}`, books);

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar livros' },
      { status: 500 }
    );
  }
}