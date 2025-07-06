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

  async deleteUserWord(id: number): Promise<void> {
    await api.delete(`/favorites/${id}`);
  }

  async addUserWord(word: {
    originalText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
  }): Promise<Word> {
    const response = await api.post('/favorites', word);
    // Backend response: { message, word }
    return response.data.word;
  }
}

export default new WordService();
