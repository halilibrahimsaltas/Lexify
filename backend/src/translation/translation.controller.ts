import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('translation')
@Controller('translation')
export class TranslationController {
    constructor(private readonly translationService: TranslationService) {}

    @Post('translate')
    @ApiOperation({ summary: 'Translate text from English to Turkish' })
    @ApiResponse({ status: 200, description: 'Text successfully translated' })
    async translate(
        @Body('text') text: string
    ): Promise<{ translatedText: string }> {
        const translatedText = await this.translationService.translate(text);
        return { translatedText };
    }

    @Post('save-word')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Save translated word to user list' })
    @ApiResponse({ status: 200, description: 'Word successfully saved to user list' })
    async saveWord(
        @Request() req,
        @Body('originalText') originalText: string,
        @Body('translatedText') translatedText: string
    ) {
        return this.translationService.addTranslatedWordToUserList(
            req.user.sub,
            originalText,
            translatedText
        );
    }
}
