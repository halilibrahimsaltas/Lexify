import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateWordDto {
    @ApiProperty({
        description: 'Orijinal kelime (İngilizce)',
        example: 'hello'
    })
    @IsString()
    @IsNotEmpty()
    originalText: string;

    @ApiProperty({
        description: 'Çevrilmiş kelime (Türkçe)',
        example: 'merhaba'
    })
    @IsString()
    @IsNotEmpty()
    translatedText: string;

    @ApiProperty({
        description: 'Kaynak dil (varsayılan: en)',
        example: 'en',
        default: 'en'
    })
    @IsString()
    @IsNotEmpty()
    sourceLanguage: string = 'en';

    @ApiProperty({
        description: 'Hedef dil (varsayılan: tr)',
        example: 'tr',
        default: 'tr'
    })
    @IsString()
    @IsNotEmpty()
    targetLanguage: string = 'tr';

    @ApiProperty({
        description: 'Kullanıcı ID',
        example: 1
    })
    @IsNotEmpty()
    userId: number;
} 