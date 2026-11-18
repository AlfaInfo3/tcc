import axios from 'axios';

export interface BookSearchResult {
  title: string;
  authors: string[];
  isbn: string;
  publishedYear?: number;
  coverUrl?: string;
  description?: string;
  genres: string[];
  publisher?: string;
  pageCount?: number;
  source: 'google' | 'brasilapi' | 'openlibrary';
}

/**
 * Remove HTML tags from Google Books or other API descriptions.
 */
function cleanHtml(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Translates English/foreign synopsis to Portuguese (PT-BR) using Google Translate GTX endpoint.
 */
export async function translateToPortuguese(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return '';
  
  // Quick heuristic: if it looks like Portuguese already, return as is
  const ptWords = ['livro', 'história', 'obra', 'publicado', 'autor', 'edição', 'vida', 'mundo', 'sobre'];
  const lower = text.toLowerCase();
  const ptScore = ptWords.filter(w => lower.includes(w)).length;
  if (ptScore >= 2) {
    return text; // Already in Portuguese
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${encodeURIComponent(text.slice(0, 2500))}`;
    const response = await axios.get(url, { timeout: 4500 });
    if (response.data && Array.isArray(response.data[0])) {
      const translated = (response.data[0] as unknown[])
        .map((segment) => (Array.isArray(segment) ? segment[0] : ''))
        .filter(Boolean)
        .join('');
      if (translated && translated.trim().length > 0) {
        return translated.trim();
      }
    }
  } catch (err) {
    console.warn('[translateToPortuguese] Fallback: unable to translate synopsis:', (err as Error).message);
  }

  return text; // Fallback to original text if translation fails
}

/**
 * Normalizes ISBN (removes hyphens, spaces, etc.)
 */
export function normalizeIsbn(raw: string): string {
  return raw.replace(/[^0-9X]/gi, '').trim();
}

/**
 * High-resolution cover extractor from Google Books volume imageLinks.
 */
function extractGoogleCoverUrl(imageLinks?: Record<string, string | undefined>): string | undefined {
  if (!imageLinks) return undefined;
  const bestUrl =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail;

  if (!bestUrl) return undefined;

  // Upgrade http to https and remove edge curl parameters
  return bestUrl
    .replace(/^http:\/\//i, 'https://')
    .replace(/&edge=curl/g, '')
    .replace(/zoom=\d/g, 'zoom=1');
}

/**
 * Search Google Books API prioritizing Portuguese (Brazil) results.
 */
async function searchGoogleBooks(query: string, isIsbn = false): Promise<BookSearchResult[]> {
  try {
    const qParam = isIsbn ? `isbn:${normalizeIsbn(query)}` : query;
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: qParam,
        langRestrict: 'pt',
        country: 'BR',
        maxResults: isIsbn ? 3 : 8,
        printType: 'books',
      },
      timeout: 5000,
    });

    const items = response.data.items || [];
    const results: BookSearchResult[] = [];

    for (const item of items) {
      const info = item.volumeInfo || {};
      const rawIsbns = info.industryIdentifiers || [];
      const isbnObj = rawIsbns.find((id: { type?: string }) => id.type === 'ISBN_13') || rawIsbns.find((id: { type?: string }) => id.type === 'ISBN_10') || rawIsbns[0];
      const isbn = isbnObj ? isbnObj.identifier : '';

      let year: number | undefined;
      if (info.publishedDate) {
        const parsedYear = parseInt(info.publishedDate.slice(0, 4));
        if (!isNaN(parsedYear)) year = parsedYear;
      }

      const rawDescription = cleanHtml(info.description || '');
      const description = rawDescription ? await translateToPortuguese(rawDescription) : undefined;

      results.push({
        title: info.title || 'Título Desconhecido',
        authors: info.authors || ['Autor Desconhecido'],
        isbn: isbn || query,
        publishedYear: year,
        coverUrl: extractGoogleCoverUrl(info.imageLinks),
        description,
        genres: info.categories || [],
        publisher: info.publisher,
        pageCount: info.pageCount,
        source: 'google',
      });
    }

    return results;
  } catch (err) {
    console.warn('[searchGoogleBooks] Error:', (err as Error).message);
    return [];
  }
}

/**
 * Search BrasilAPI for official Brazilian ISBN records.
 */
async function searchBrasilApi(isbn: string): Promise<BookSearchResult | null> {
  const cleanIsbn = normalizeIsbn(isbn);
  if (cleanIsbn.length !== 10 && cleanIsbn.length !== 13) return null;

  try {
    const response = await axios.get(`https://brasilapi.com.br/api/isbn/v1/${cleanIsbn}`, {
      timeout: 4500,
    });

    const data = response.data;
    if (!data || !data.title) return null;

    let year: number | undefined = data.year;
    if (!year && data.published_date) {
      const y = parseInt(data.published_date.slice(0, 4));
      if (!isNaN(y)) year = y;
    }

    return {
      title: data.title,
      authors: data.authors && data.authors.length > 0 ? data.authors : ['Autor Desconhecido'],
      isbn: cleanIsbn,
      publishedYear: year,
      coverUrl: data.cover_url || undefined,
      description: data.synopsis ? cleanHtml(data.synopsis) : undefined,
      genres: data.subjects || [],
      publisher: data.publisher,
      pageCount: data.page_count,
      source: 'brasilapi',
    };
  } catch (err) {
    console.warn('[searchBrasilApi] Not found or error:', (err as Error).message);
    return null;
  }
}

/**
 * Fallback to OpenLibrary if no Portuguese API returned results.
 */
async function searchOpenLibrary(query: string, isIsbn = false): Promise<BookSearchResult[]> {
  try {
    const params: { limit: number; fields: string; isbn?: string; q?: string } = {
      limit: isIsbn ? 1 : 5,
      fields: 'key,title,author_name,cover_i,first_publish_year,isbn,subject',
    };

    if (isIsbn) {
      params.isbn = normalizeIsbn(query);
    } else {
      params.q = `${query} language:por`;
    }

    const response = await axios.get('https://openlibrary.org/search.json', {
      params,
      timeout: 5000,
    });

    const docs = response.data.docs || [];
    const results: BookSearchResult[] = [];

    for (const doc of docs) {
      const isbn = doc.isbn?.[0] || '';
      const coverUrl = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : undefined;

      results.push({
        title: doc.title,
        authors: doc.author_name || ['Autor Desconhecido'],
        isbn: isbn || query,
        publishedYear: doc.first_publish_year,
        coverUrl,
        genres: doc.subject?.slice(0, 5) || [],
        source: 'openlibrary',
      });
    }

    return results;
  } catch (err) {
    console.warn('[searchOpenLibrary] Error:', (err as Error).message);
    return [];
  }
}

/**
 * Unified Book Search Provider:
 * Prioritizes PT-BR Google Books and BrasilAPI, with automatic synopsis translation.
 */
export async function searchBooksUnified(query: string): Promise<BookSearchResult[]> {
  const isNumericIsbn = /^[\d-Xx]{9,17}$/.test(query.trim());

  if (isNumericIsbn) {
    // 1. Try BrasilAPI first for exact Brazilian editions
    const brasilApiResult = await searchBrasilApi(query);
    
    // 2. Query Google Books (PT-BR)
    const googleResults = await searchGoogleBooks(query, true);

    if (brasilApiResult) {
      // If BrasilAPI doesn't have a cover but Google Books does, combine them!
      if (!brasilApiResult.coverUrl && googleResults.length > 0 && googleResults[0].coverUrl) {
        brasilApiResult.coverUrl = googleResults[0].coverUrl;
      }
      if (!brasilApiResult.description && googleResults.length > 0 && googleResults[0].description) {
        brasilApiResult.description = googleResults[0].description;
      }
      return [brasilApiResult, ...googleResults.filter(g => g.title !== brasilApiResult.title)];
    }

    if (googleResults.length > 0) {
      return googleResults;
    }

    // 3. Fallback to OpenLibrary
    return searchOpenLibrary(query, true);
  }

  // Text query (title or author)
  // 1. Google Books (PT-BR)
  const googleResults = await searchGoogleBooks(query, false);
  if (googleResults.length > 0) {
    return googleResults;
  }

  // 2. OpenLibrary fallback
  return searchOpenLibrary(query, false);
}
