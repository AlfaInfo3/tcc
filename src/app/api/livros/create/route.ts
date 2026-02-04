import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth-api';

export async function POST(req: NextRequest) {
  if (!await isAuthenticated(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, author, coverUrl, description, publishedAt, quantity, genres } = body;

    // Validations
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Título é obrigatório e deve ser uma string válida' },
        { status: 400 }
      );
    }

    if (title.trim().length > 255) {
      return NextResponse.json(
        { error: 'Título deve ter no máximo 255 caracteres' },
        { status: 400 }
      );
    }

    if (author && typeof author !== 'string') {
      return NextResponse.json(
        { error: 'Autor deve ser uma string válida' },
        { status: 400 }
      );
    }

    if (coverUrl && typeof coverUrl !== 'string') {
      return NextResponse.json(
        { error: 'URL da capa deve ser uma string válida' },
        { status: 400 }
      );
    }

    if (description && typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Descrição deve ser uma string válida' },
        { status: 400 }
      );
    }

    if (publishedAt && (typeof publishedAt !== 'number' || publishedAt < 0)) {
      return NextResponse.json(
        { error: 'Ano de publicação deve ser um número positivo' },
        { status: 400 }
      );
    }

    if (quantity !== undefined && (typeof quantity !== 'number' || quantity < 0)) {
      return NextResponse.json(
        { error: 'Quantidade deve ser um número não negativo' },
        { status: 400 }
      );
    }
    
    if (genres && (!Array.isArray(genres) || !genres.every(g => typeof g === 'string'))) {
        return NextResponse.json(
            { error: 'Gêneros deve ser uma lista de strings' },
            { status: 400 }
        );
    }

    const book = await prisma.book.create({
      data: {
        title: title.trim(),
        author: author ? author.trim() : null,
        coverUrl: coverUrl || null,
        description: description ? description.trim() : null,
        publishedAt: publishedAt || null,
        quantity: quantity !== undefined ? quantity : 1,
        genres: genres || []
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Erro interno ao criar o livro' },
      { status: 500 }
    );
  }
}