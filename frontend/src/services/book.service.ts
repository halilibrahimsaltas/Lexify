import api from './api';

export interface Book {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  title: string;
  content: string;
  author: string;
  coverImage?: string;
  filePath: string;
  category: string;
}

class BookService {
  async uploadPdf(file: any): Promise<Book> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/books/upload/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async createBook(bookData: CreateBookRequest): Promise<Book> {
    const response = await api.post('/books', bookData);
    return response.data;
  }

  async getUserBooks(): Promise<Book[]> {
    const response = await api.get('/books');
    return response.data;
  }

  async getBook(id: number): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  }

  async deleteBook(id: number): Promise<void> {
    await api.delete(`/books/${id}`);
  }
}

export default new BookService(); 