import api from './api';

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
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

  async getSupportedLanguages(): Promise<Language[]> {
    try {
      const response = await api.get('/translation/languages');
      return response.data;
    } catch (error) {
      throw new Error('Desteklenen diller alınamadı');
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await api.post('/translation/detect', { text });
      return response.data.language;
    } catch (error) {
      throw new Error('Dil algılanamadı');
    }
  }
}

export default new TranslationService(); 