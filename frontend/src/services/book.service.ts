import api from "./api";
import storageService from "./storage.service";
import * as FileSystem from "expo-file-system";
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

    // Dosyayı güvenli bir dizine kopyala
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

    // Gerekli alanları ekle
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    const token = await storageService.getAuthToken();

    const response = await api.post("/books/upload/pdf", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
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
}

export default new BookService();
