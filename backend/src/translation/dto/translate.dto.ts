import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Language } from '../constants/language.enum';


export class TranslateDto {
    @ApiProperty({
        description: 'Text to translate',
        example: 'Hello world'
    })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({
        description: 'Source language',
        enum: Language,
        example: Language.EN
    })
    @IsEnum(Language)
    @IsNotEmpty()
    sourceLanguage: Language;

    @ApiProperty({
        description: 'Target language',
        enum: Language,
        example: Language.TR
    })
    @IsEnum(Language)
    @IsNotEmpty()
    targetLanguage: Language;
} 