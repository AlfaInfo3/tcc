import { NextRequest, NextResponse } from 'next/server';
import { translateToPortuguese } from '@/lib/book-search';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto não fornecido' }, { status: 400 });
    }

    const translated = await translateToPortuguese(text);
    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Erro na tradução:', error);
    return NextResponse.json({ error: 'Erro ao traduzir texto' }, { status: 500 });
  }
}
