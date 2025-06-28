import api from './api';

export interface TranslationRequest {
  text: string;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string | null;
  alternatives: Array<{
    word: string;
    translation: string;
    category: string;
    type: string;
  }>;
  groupedResults?: any;
  totalResults: number;
  message?: string;
}

export interface SearchWordResponse {
  searchTerm: string;
  results: Array<{
    word: string;
    translation: string;
    category: string;
    type: string;
  }>;
  totalResults: number;
}

export interface DictionaryStats {
  totalWords: number;
  categories: { [key: string]: number };
  isLoaded: boolean;
}

class TranslationService {
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await api.post('/translation/translate', request);
      return response.data;
    } catch (error) {
      throw new Error('Çeviri başarısız');
    }
  }

  async searchWord(word: string): Promise<SearchWordResponse> {
    try {
      const response = await api.get(`/translation/search/${word}`);
      return response.data;
    } catch (error) {
      throw new Error('Kelime arama başarısız');
    }
  }

  async getDictionaryStats(): Promise<DictionaryStats> {
    try {
      const response = await api.get('/translation/stats');
      return response.data;
    } catch (error) {
      throw new Error('Sözlük istatistikleri alınamadı');
    }
  }
}

export default new TranslationService(); 