import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiHeader } from '@nestjs/swagger';
import { TranslateDto } from './dto/translate.dto';

@ApiTags('translation')
@Controller('translation')
export class TranslationController {
    constructor(private readonly translationService: TranslationService) {}

    @Post('translate')
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true
    })
    @ApiOperation({ 
        summary: 'Translate text using LibreTranslate',
        description: 'Translates the given text from source language to target language using LibreTranslate service.'
    })
    @ApiBody({ 
        type: TranslateDto,
        description: 'Translation request parameters',
        examples: {
            example1: {
                summary: 'English to Turkish',
                value: {
                    text: 'Hello world',
                    sourceLanguage: 'en',
                    targetLanguage: 'tr'
                }
            },
            example2: {
                summary: 'Turkish to English',
                value: {
                    text: 'Merhaba dünya',
                    sourceLanguage: 'tr',
                    targetLanguage: 'en'
                }
            }
        }
    })
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
    @ApiResponse({ 
        status: 400, 
        description: 'Bad Request - Invalid input parameters',
        schema: {
            type: 'object',
            properties: {
                statusCode: {
                    type: 'number',
                    example: 400
                },
                message: {
                    type: 'string',
                    example: 'Invalid language code'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Unauthorized - Invalid or missing token',
        schema: {
            type: 'object',
            properties: {
                statusCode: {
                    type: 'number',
                    example: 401
                },
                message: {
                    type: 'string',
                    example: 'Unauthorized'
                }
            }
        }
    })
    @ApiResponse({ 
        status: 500, 
        description: 'Translation service error',
        schema: {
            type: 'object',
            properties: {
                statusCode: {
                    type: 'number',
                    example: 500
                },
                message: {
                    type: 'string',
                    example: 'Translation service is currently unavailable'
                }
            }
        }
    })
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
