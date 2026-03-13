
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth-api';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  if (!await isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo: 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    // Data URL que pode ser usada diretamente em <img src="..." />
    // e salva no campo coverUrl do banco (Neon/PostgreSQL)
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Falha no upload' }, { status: 500 });
  }
}
