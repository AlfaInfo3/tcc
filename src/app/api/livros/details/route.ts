import { NextRequest, NextResponse } from 'next/server';
import { OpenLibraryService } from '@/lib/openlibrary';
import { getCache, setCache } from '@/lib/cache';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  const cacheKey = `details_${key}`;
  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  try {
    const details = await OpenLibraryService.getBookDetails(key);
    setCache(cacheKey, details);
    return NextResponse.json(details);
  } catch {
    return NextResponse.json({ error: 'Falha ao buscar detalhes' }, { status: 500 });
  }
}
