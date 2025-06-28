import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TranslationService } from '../translation/translation.service';

@ApiTags('dictionary')
@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly translationService: TranslationService) {}

  @Get('search')
  @ApiOperation({ summary: 'Sözlükte kelime ara' })
  @ApiResponse({ status: 200, description: 'Arama sonuçları' })
  async searchWords(@Query('query') query: string, @Query('limit') limit?: number) {
    const results = await this.translationService.searchWord(query);
    return {
      words: results.results.map((item, index) => ({
        id: index.toString(),
        word: item.word,
        translation: item.translation,
        language: 'en',
        category: item.category,
        type: item.type
      })),
      total: results.totalResults,
      hasMore: results.totalResults > (limit || 20)
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Sözlük istatistikleri' })
  @ApiResponse({ status: 200, description: 'Sözlük istatistikleri' })
  async getDictionaryStats() {
    return await this.translationService.getDictionaryStats();
  }

  @Get('word/:word')
  @ApiOperation({ summary: 'Belirli bir kelimeyi getir' })
  @ApiResponse({ status: 200, description: 'Kelime detayları' })
  async getWord(@Param('word') word: string) {
    const result = await this.translationService.translate({ text: word });
    if (result.translatedText) {
      return {
        id: '1',
        word: result.originalText,
        translation: result.translatedText,
        language: 'en',
        alternatives: result.alternatives
      };
    }
    throw new Error('Kelime bulunamadı');
  }
} 