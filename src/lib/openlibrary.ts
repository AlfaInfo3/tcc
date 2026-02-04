// Integration with Open Library API for intelligent book cataloging
import axios from 'axios';

interface OpenLibrarySearchResult {
  key: string;
  title: string;
  author_name?: string[];
  isbn?: string[];
  publish_year?: number[];
  cover_i?: number;
  subject?: string[]; // Added subject support
}

interface BookDetails {
  title: string;
  authors: string[];
  isbn: string;
  publishedYear?: number;
  coverUrl?: string;
  description?: string; // Added description
  genre?: string; // Kept for backward compat if needed, or remove? Let's remove to enforce array usage
  genres?: string[]; // Added genres array
  workKey?: string; // To fetch more details
}

export class OpenLibraryService {
  private static readonly BASE_URL = 'https://openlibrary.org';
  private static readonly COVER_URL = 'https://covers.openlibrary.org/b/id';

  static async searchBooks(query: string): Promise<BookDetails[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/search.json`, {
        params: {
          q: `${query} language:por`,
          fields: 'key,title,author_name,cover_i,first_publish_year,isbn,language,subject',
          limit: 10
        }
      });

      const books: BookDetails[] = response.data.docs.map((doc: OpenLibrarySearchResult) => ({
        title: doc.title,
        authors: doc.author_name || ['Desconhecido'],
        isbn: doc.isbn?.[0] || '',
        publishedYear: doc.publish_year?.[0],
        coverUrl: doc.cover_i ? `${this.COVER_URL}/${doc.cover_i}-M.jpg` : undefined,
        genres: doc.subject?.slice(0, 5) || [], // Return top 5 genres
        workKey: doc.key
      }));

      return books;
    } catch (error) {
      console.error('Error searching books on Open Library:', error);
      throw new Error('Falha ao buscar livros na Open Library');
    }
  }

  static async getBookDetails(workKey: string): Promise<{ description?: string; genres?: string[] }> {
      try {
          const response = await axios.get(`${this.BASE_URL}${workKey}.json`);
          const data = response.data;
          
          let description = '';
          if (typeof data.description === 'string') {
              description = data.description;
          } else if (data.description && data.description.value) {
              description = data.description.value;
          }

          // Sometimes subjects are in the Work object too
          let genres: string[] = [];
          if (data.subjects && Array.isArray(data.subjects)) {
              genres = data.subjects.slice(0, 5);
          }

          return { description, genres };
      } catch (error) {
          console.error('Error fetching book details:', error);
          return {};
      }
  }

  static async getBookByISBN(isbn: string): Promise<BookDetails | null> {
    try {
      // Search by ISBN
      const response = await axios.get(`${this.BASE_URL}/search.json`, {
        params: {
          isbn: isbn,
          fields: 'key,title,author_name,cover_i,first_publish_year,isbn,language,subject'
        }
      });

      if (response.data.docs.length > 0) {
        const doc = response.data.docs[0];
        return {
          title: doc.title,
          authors: doc.author_name || ['Desconhecido'],
          isbn: doc.isbn?.[0] || isbn,
          publishedYear: doc.publish_year?.[0],
          coverUrl: doc.cover_i ? `${this.COVER_URL}/${doc.cover_i}-M.jpg` : undefined,
          genres: doc.subject?.slice(0, 5) || [],
          workKey: doc.key
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching book by ISBN:', error);
      throw new Error('Falha ao buscar livro por ISBN na Open Library');
    }
  }
}