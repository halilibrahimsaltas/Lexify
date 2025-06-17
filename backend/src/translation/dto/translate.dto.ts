import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, MaxLength, MinLength } from 'class-validator';
import { Language } from '../constants/language.enum';

export class TranslateDto {
    @ApiProperty({
        description: 'Text to translate',
        example: 'Hello world',
        minLength: 1,
        maxLength: 5000,
        required: true
    })
    @IsString()
    @IsNotEmpty({ message: 'Text cannot be empty' })
    @MinLength(1, { message: 'Text must be at least 1 character long' })
    @MaxLength(5000, { message: 'Text cannot be longer than 5000 characters' })
    text: string;

    @ApiProperty({
        description: 'Source language code (ISO 639-1)',
        enum: Language,
        example: Language.EN,
        required: true,
        default: Language.EN,
        enumName: 'Language'
    })
    @IsEnum(Language, { 
        message: 'Invalid source language. Supported languages: ' + Object.values(Language).join(', ')
    })
    @IsNotEmpty({ message: 'Source language is required' })
    sourceLanguage: Language;

    @ApiProperty({
        description: 'Target language code (ISO 639-1)',
        enum: Language,
        example: Language.TR,
        required: true,
        default: Language.TR,
        enumName: 'Language'
    })
    @IsEnum(Language, { 
        message: 'Invalid target language. Supported languages: ' + Object.values(Language).join(', ')
    })
    @IsNotEmpty({ message: 'Target language is required' })
    targetLanguage: Language;
} 