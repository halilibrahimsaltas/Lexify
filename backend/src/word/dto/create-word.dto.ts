import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum Language {
    EN = 'en',
    TR = 'tr',
    DE = 'de',
    FR = 'fr',
    ES = 'es'
}

export class CreateWordDto {
    @ApiProperty({
        description: 'Orijinal kelime',
        example: 'hello',
        minLength: 1,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    originalText: string;

    @ApiProperty({
        description: 'Çevrilmiş kelime',
        example: 'merhaba',
        minLength: 1,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    translatedText: string;

    @ApiProperty({
        description: 'Kaynak dil kodu',
        example: 'en',
        default: 'en',
        enum: Language
    })
    @IsEnum(Language)
    @IsNotEmpty()
    sourceLanguage: Language = Language.EN;

    @ApiProperty({
        description: 'Hedef dil kodu',
        example: 'tr',
        default: 'tr',
        enum: Language
    })
    @IsEnum(Language)
    @IsNotEmpty()
    targetLanguage: Language = Language.TR;
} 