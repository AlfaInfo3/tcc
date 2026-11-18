export interface Book {
  id: string;
  title: string;
  author?: string;
  coverUrl?: string;
  description?: string;
  genres?: string[];
  publishedAt?: number;
  quantity: number;
  createdAt: string;
  corridor?: string | null;
  shelf?: string | null;
  shelfLevel?: string | null;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  codeHash: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  bookId: string;
  studentId: string;
  status: 'reserved' | 'confirmed' | 'cancelled'; // Adicionando tipos específicos para status
  createdAt: string;
}

// Interface for the Open Library API response
export interface OpenLibraryBook {
  title: string;
  author: string;
  coverUrl: string | null;
  description: string | null;
  publishedAt: number | null;
}