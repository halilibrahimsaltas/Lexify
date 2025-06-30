import api from './api';
import storageService from './storage.service';

export interface Book {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

class BookService {
  async uploadPdf(file: any): Promise<Book> {
    console.log('📁 BookService - Dosya alındı:', file);
    
    const formData = new FormData();

    formData.append('file', {
      uri: file.uri,
      name: file.name || 'document.pdf',
      type: file.mimeType || 'application/pdf',
    } as any);

    console.log('📁 BookService - FormData oluşturuldu');
    console.log('📁 BookService - Dosya URI:', file.uri);
    console.log('📁 BookService - Dosya adı:', file.name);
    console.log('📁 BookService - Dosya tipi:', file.mimeType);

    const token = await storageService.getAuthToken();
    console.log('📁 BookService - Token alındı:', token ? 'VAR' : 'YOK');

    const response = await api.post('/books/upload/pdf', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ⚠️ Content-Type manuel yazılmaz
      },
    });
    
    console.log('✅ BookService - Upload başarılı');
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
