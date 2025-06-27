

export interface DictionaryEntry {
    word: string;
    category: string;
    type: string;
    tr: string;
  }
export interface TranslateResponse {
    originalText: string;
    translatedText: string | null;
    alternatives: Array<{
      word: string;
      translation: string;
      category: string;
      type: string;
    }>;
    groupedResults?: { [key: string]: DictionaryEntry[] };
    totalResults?: number;
    message?: string;
  }