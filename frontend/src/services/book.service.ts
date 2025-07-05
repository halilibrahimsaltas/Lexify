import * as FileSystem from "expo-file-system";
import api from "./api";
import storageService from "./storage.service";
import { Book } from "../types/index";

class BookService {
  async uploadPdf(data: {
    file: any;
    title: string;
    author: string;
    category: string;
    coverImage?: string;
  }): Promise<Book> {
    const { file, title, author, category, coverImage } = data;

    // Dosya güvenli dizine kopyalanıyor
    const fileUri = FileSystem.cacheDirectory + file.name;
    await FileSystem.copyAsync({
      from: file.uri,
      to: fileUri,
    });

    const formData = new FormData();

    formData.append("file", {
      uri: fileUri,
      name: file.name || "document.pdf",
      type: file.mimeType || "application/pdf",
    } as any);

    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);

    // Boş bile olsa coverImage eklenmeli (Swagger ile uyumlu olması için)
    formData.append("coverImage", coverImage || "");

    const token = await storageService.getAuthToken();

    const response = await fetch("http://10.0.2.2:3000/books/upload/pdf", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Content-Type YAZMA!
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  }
  async getUserBooks(): Promise<Book[]> {
    const response = await api.get("/books");
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

  async getBookChapters(bookId: number) {
    const token = await storageService.getAuthToken();
    const response = await api.get(`/books/${bookId}/chapters`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // { chapters: [ ... ] }
  }

  async searchBooks(query: string): Promise<Book[]> {
    const token = await storageService.getAuthToken();
    const response = await api.get(`/books/search?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
}

export default new BookService();
