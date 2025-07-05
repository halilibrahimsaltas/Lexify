import api from "./api";

export interface Word {
  id: number;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  createdAt: string;
  updatedAt: string;
}

class WordService {
  async getUserWords(): Promise<Word[]> {
    const response = await api.get("/favorites");
    return response.data;
  }
}

export default new WordService();
