import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TranslationService } from './translation.service';
import { TranslateResponse } from '../common/interface/translate-response.interface';
import { TranslateDto } from './dto/translate.dto';

@ApiTags('translation')
@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post('translate')
  @ApiOperation({ summary: 'Kelime çevirisi yap' })
  @ApiResponse({ status: 200, description: 'Çeviri başarılı' })
  async translate(@Body() dto: TranslateDto): Promise<TranslateResponse> {
    return await this.translationService.translate(dto);
  }

  @Get('search/:word')
  @ApiOperation({ summary: 'Kelime ara' })
  @ApiResponse({ status: 200, description: 'Arama sonuçları' })
  async searchWord(@Param('word') word: string) {
    return await this.translationService.searchWord(word);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Sözlük istatistikleri' })
  @ApiResponse({ status: 200, description: 'Sözlük istatistikleri' })
  async getDictionaryStats() {
    return await this.translationService.getDictionaryStats();
  }
}