import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateWordDto {
    @ApiProperty({
        description: 'Orijinal kelime (İngilizce)',
        example: 'hello',
        required: false
    })
    @IsString()
    @IsOptional()
    originalText?: string;

    @ApiProperty({
        description: 'Çevrilmiş kelime (Türkçe)',
        example: 'merhaba',
        required: false
    })
    @IsString()
    @IsOptional()
    translatedText?: string;

    @ApiProperty({
        description: 'Kaynak dil',
        example: 'en',
        required: false
    })
    @IsString()
    @IsOptional()
    sourceLanguage?: string;

    @ApiProperty({
        description: 'Hedef dil',
        example: 'tr',
        required: false
    })
    @IsString()
    @IsOptional()
    targetLanguage?: string;
} 