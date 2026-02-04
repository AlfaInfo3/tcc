import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth-api';

export async function PUT(request: NextRequest) {
  if (!await isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, author, coverUrl, description, publishedAt, quantity, genre } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do livro é obrigatório' }, { status: 400 });
    }

    // Check if book exists
    const existingBook = await prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 });
    }

    // Validations
    if (title && (typeof title !== 'string' || title.trim().length === 0)) {
       return NextResponse.json({ error: 'Título inválido' }, { status: 400 });
    }
    
    // Prepare update data (only defined fields)
    const updateData: any = {};
    if (title) updateData.title = title.trim();
    if (author !== undefined) updateData.author = author ? author.trim() : null;
    if (coverUrl !== undefined) updateData.coverUrl = coverUrl;
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (genre !== undefined) {
         // If legacy 'genre' is sent, we ignore or warn? 
         // But better to expect 'genres'. 
         // Let's assume frontend sends 'genres'.
    }
    if (body.genres !== undefined) {
        if (Array.isArray(body.genres) && body.genres.every((g: any) => typeof g === 'string')) {
            updateData.genres = body.genres;
        }
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Falha ao atualizar o livro' }, { status: 500 });
  }
}