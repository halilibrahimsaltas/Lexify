import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TRANSLATION_CONSTANTS } from './constants/translation.constants';
import { WordService } from '../word/word.service';
import { CreateWordDto, Language } from '../word/dto/create-word.dto';

@Injectable()
export class TranslationService {
    private readonly apiUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly wordService: WordService
    ) {
        this.apiUrl = this.configService.get<string>('LIBRETRANSLATE_API_URL') || TRANSLATION_CONSTANTS.API.DEFAULT_URL;
    }

    async translate(text: string) {
        const cacheKey = `${TRANSLATION_CONSTANTS.CACHE.KEY_PREFIX}${Language.EN}:${Language.TR}:${text}`;
        
        const cachedTranslation = await this.cacheManager.get<string>(cacheKey);
        if (cachedTranslation) {
            return cachedTranslation;
        }

        const response = await this.httpService.axiosRef.post(
            `${this.apiUrl}${TRANSLATION_CONSTANTS.API.ENDPOINTS.TRANSLATE}`,
            {
                q: text,
                source: Language.EN,
                target: Language.TR
            }
        );

        const translation = response.data.translatedText;
        await this.cacheManager.set(cacheKey, translation, TRANSLATION_CONSTANTS.CACHE.TTL);
        
        return translation;
    }

    async detectLanguage(text: string) {
        const response = await this.httpService.axiosRef.post(
            `${this.apiUrl}${TRANSLATION_CONSTANTS.API.ENDPOINTS.DETECT}`,
            { q: text }
        );
        return response.data;
    }

    async getSupportedLanguages() {
        const response = await this.httpService.axiosRef.get(
            `${this.apiUrl}${TRANSLATION_CONSTANTS.API.ENDPOINTS.LANGUAGES}`
        );
        return response.data;
    }

    async addTranslatedWordToUserList(
        userId: number,
        originalText: string,
        translatedText: string
    ) {
        const createWordDto: CreateWordDto = {
            originalText,
            translatedText,
            sourceLanguage: Language.EN,
            targetLanguage: Language.TR
        };

        return this.wordService.create(createWordDto, userId);
    }
}
