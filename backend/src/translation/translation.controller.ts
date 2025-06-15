import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TranslateDto } from './dto/translate.dto';


@ApiTags('translation')
@Controller('translation')
export class TranslationController {
    constructor(private readonly translationService: TranslationService) {}

    @Post('translate')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Translate text using LibreTranslate' })
    @ApiBody({ type: TranslateDto })
    @ApiResponse({ 
        status: 200, 
        description: 'Text successfully translated',
        schema: {
            type: 'object',
            properties: {
                translatedText: {
                    type: 'string',
                    example: 'Merhaba dünya'
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Translation service error' })
    async translate(
        @Body() translateDto: TranslateDto
    ): Promise<{ translatedText: string }> {
        const translatedText = await this.translationService.translate(
            translateDto.text,
            translateDto.sourceLanguage,
            translateDto.targetLanguage
        );
        return { translatedText };
    }
}
