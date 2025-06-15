import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Language } from './constants/language.enum';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TranslationService {
    private readonly logger = new Logger(TranslationService.name);
    private readonly libreTranslateUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.libreTranslateUrl = this.configService.get<string>('LIBRETRANSLATE_URL') || 'http://libretranslate:5000';
    }

    async translate(
        text: string,
        sourceLanguage: Language = Language.EN,
        targetLanguage: Language = Language.TR
    ): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.libreTranslateUrl}/translate`, {
                    q: text,
                    source: sourceLanguage,
                    target: targetLanguage,
                })
            );

            return response.data.translatedText;
        } catch (error) {
            this.logger.error(`Translation error: ${error.message}`);
            throw error;
        }
    }
}
