import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  words?: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  words?: string[];
}

class UserService {
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error('Kullanıcı bilgileri alınamadı');
    }
  }

  async updateUser(userId: number, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Geçersiz bilgiler');
      }
      if (error.response?.status === 404) {
        throw new Error('Kullanıcı bulunamadı');
      }
      throw new Error('Güncelleme başarısız');
    }
  }

  async getUserWords(userId: number): Promise<string[]> {
    try {
      const response = await api.get(`/users/${userId}/words`);
      return response.data;
    } catch (error) {
      throw new Error('Kullanıcı kelimeleri alınamadı');
    }
  }
}

export default new UserService(); 