import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TranslateDto } from './dto/translate.dto';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private readonly apiUrl = 'http://libretranslate:5000';

  constructor(private readonly httpService: HttpService) {
    this.logger.log(`🔗 LibreTranslate bağlantısı: ${this.apiUrl}`);
  }

  async translate(dto: TranslateDto) {
    const payload = {
      q: dto.text,
      source: dto.sourceLanguage,
      target: dto.targetLanguage,
      format: 'text'
    };

    this.logger.log(`📤 Çeviri isteği gönderiliyor: ${JSON.stringify(payload)}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/translate`, payload, {
          headers: { 'Content-Type': 'application/json' }
        })
      );

      this.logger.log(`✅ Çeviri başarılı: ${response.data.translatedText}`);
      return {
        translatedText: response.data.translatedText,
        detectedLanguage: response.data.detectedLanguage ?? null,
        alternatives: response.data.alternatives ?? []
      };
    } catch (error) {
      this.logger.error('❌ LibreTranslate bağlantı hatası:', error.message);
      throw error;
    }
  }
}
