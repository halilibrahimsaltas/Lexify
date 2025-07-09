import { Injectable, Logger } from '@nestjs/common';
import { TranslateDto } from './dto/translate.dto';
import { DictionaryEntry, TranslateResponse } from '../common/interface/translate-response.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private dictionaryCache: DictionaryEntry[] = [];
  private isDictionaryLoaded = false;

  constructor() {
    this.loadDictionary();
  }

  private async loadDictionary() {
    try {
      const possiblePaths = [
        path.join(__dirname, '../dictionary/dictionary.json'),
        path.join(__dirname, '../../src/dictionary/dictionary.json'),
        path.join(process.cwd(), 'src/dictionary/dictionary.json'),
      ];

      let dictionaryPath: string | null = null;
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          dictionaryPath = p;
          break;
        }
      }

      if (!dictionaryPath) {
        throw new Error(`Dictionary file not found. Tried paths: ${possiblePaths.join(', ')}`);
      }

      this.logger.log(`📚 Sözlük yükleniyor: ${dictionaryPath}`);
      
      const fileContent = fs.readFileSync(dictionaryPath, 'utf8');
      const lines = fileContent.trim().split('\n');
      
      let parseErrors = 0;
      this.dictionaryCache = lines.map(line => {
        try {
          // Satır sonlarındaki virgül ve boşlukları temizle
          const cleanLine = line.trim().replace(/,$/, '');
          if (!cleanLine) return null;
          
          return JSON.parse(cleanLine);
        } catch (error) {
          parseErrors++;
          return null;
        }
      }).filter(entry => entry !== null);
      
      this.isDictionaryLoaded = true;
      this.logger.log(`✅ Sözlük başarıyla yüklendi: ${this.dictionaryCache.length} kelime${parseErrors > 0 ? ` (${parseErrors} parse hatası)` : ''}`);
    } catch (error) {
      this.logger.error('❌ Sözlük yükleme hatası:', error.message);
      throw error;
    }
  }

  async translate(dto: TranslateDto): Promise<TranslateResponse> {
    if (!this.isDictionaryLoaded) {
      await this.loadDictionary();
    }

    const searchText = dto.text.toLowerCase().trim();
    this.logger.log(`🔍 Aranan kelime: "${searchText}"`);

    // Tam eşleşme ara
    let exactMatches = this.dictionaryCache.filter(entry => 
      entry.word.toLowerCase() === searchText
    );

   

    // Sonuçları kategorilere göre grupla
    const groupedResults = this.groupByCategory(exactMatches);

    if (exactMatches.length === 0) {
      this.logger.log(`❌ Kelime bulunamadı: "${searchText}"`);
      return {
        originalText: dto.text,
        translatedText: null,
        alternatives: [],
        message: 'Kelime sözlükte bulunamadı'
      };
    }

    this.logger.log(`✅ ${exactMatches.length} sonuç bulundu`);
    
    return {
      originalText: dto.text,
      translatedText: exactMatches[0]?.tr || null,
      alternatives: exactMatches.slice(1, 10).map(entry => ({
        word: entry.word,
        translation: entry.tr,
        category: entry.category,
        type: entry.type
      })),
      groupedResults,
      totalResults: exactMatches.length
    };
  }

  private groupByCategory(entries: DictionaryEntry[]) {
    const grouped: { [key: string]: DictionaryEntry[] } = {};
    
    entries.forEach(entry => {
      if (!grouped[entry.category]) {
        grouped[entry.category] = [];
      }
      grouped[entry.category].push(entry);
    });

    return grouped;
  }

  async searchWord(word: string) {
    if (!this.isDictionaryLoaded) {
      await this.loadDictionary();
    }

    const searchText = word.toLowerCase().trim();
    const matches = this.dictionaryCache.filter(entry => 
      entry.word.toLowerCase().includes(searchText)
    );

    return {
      searchTerm: word,
      results: matches.slice(0, 20).map(entry => ({
        word: entry.word,
        translation: entry.tr,
        category: entry.category,
        type: entry.type
      })),
      totalResults: matches.length
    };
  }

  async getDictionaryStats() {
    if (!this.isDictionaryLoaded) {
      await this.loadDictionary();
    }

    const categories = this.dictionaryCache.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalWords: this.dictionaryCache.length,
      categories,
      isLoaded: this.isDictionaryLoaded
    };
  }
}
