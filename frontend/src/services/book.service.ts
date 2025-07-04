import api from './api';
import storageService from './storage.service';
import * as FileSystem from 'expo-file-system';

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
  const fileUri = FileSystem.cacheDirectory + file.name;

  // ✅ Dosyayı erişilebilir bir yere kopyala
  await FileSystem.copyAsync({
    from: file.uri,
    to: fileUri,
  });

  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: file.name || 'document.pdf',
    type: file.mimeType || 'application/pdf',
  } as any);

  const token = await storageService.getAuthToken();

  const response = await api.post('/books/upload/pdf', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      //'Content-Type': 'multipart/form-data',
    },
  });

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

  async getBookContent(bookId: number, page: number) {
    const token = await storageService.getAuthToken();
    const response = await api.get(`/books/${bookId}/content?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export default new BookService();
