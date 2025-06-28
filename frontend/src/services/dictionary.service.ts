import api from './api';

export interface Word {
  id: string;
  word: string;
  translation: string;
  language: string;
  definition?: string;
  examples?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
}

export interface CreateWordRequest {
  word: string;
  translation: string;
  language: string;
  definition?: string;
  examples?: string[];
}

export interface SearchWordsRequest {
  query: string;
  language?: string;
  limit?: number;
  offset?: number;
}

export interface SearchWordsResponse {
  words: Word[];
  total: number;
  hasMore: boolean;
}

class DictionaryService {
  async searchWords(request: SearchWordsRequest): Promise<SearchWordsResponse> {
    try {
      const response = await api.get('/dictionary/search', { params: request });
      return response.data;
    } catch (error) {
      throw new Error('Kelime arama başarısız');
    }
  }

  async getWordById(id: string): Promise<Word> {
    try {
      const response = await api.get(`/dictionary/words/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Kelime bulunamadı');
    }
  }

  async createWord(wordData: CreateWordRequest): Promise<Word> {
    try {
      const response = await api.post('/dictionary/words', wordData);
      return response.data;
    } catch (error) {
      throw new Error('Kelime eklenemedi');
    }
  }

  async updateWord(id: string, wordData: Partial<CreateWordRequest>): Promise<Word> {
    try {
      const response = await api.put(`/dictionary/words/${id}`, wordData);
      return response.data;
    } catch (error) {
      throw new Error('Kelime güncellenemedi');
    }
  }

  async deleteWord(id: string): Promise<void> {
    try {
      await api.delete(`/dictionary/words/${id}`);
    } catch (error) {
      throw new Error('Kelime silinemedi');
    }
  }

  async getFavoriteWords(): Promise<Word[]> {
    try {
      const response = await api.get('/dictionary/favorites');
      return response.data;
    } catch (error) {
      throw new Error('Favori kelimeler alınamadı');
    }
  }

  async addToFavorites(wordId: string): Promise<void> {
    try {
      await api.post(`/dictionary/favorites/${wordId}`);
    } catch (error) {
      throw new Error('Favorilere eklenemedi');
    }
  }

  async removeFromFavorites(wordId: string): Promise<void> {
    try {
      await api.delete(`/dictionary/favorites/${wordId}`);
    } catch (error) {
      throw new Error('Favorilerden çıkarılamadı');
    }
  }
}

export default new DictionaryService(); 