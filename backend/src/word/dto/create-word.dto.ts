import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum Language {
  EN = 'en',
  TR = 'tr',
  DE = 'de',
  FR = 'fr',
  ES = 'es',
}

export class CreateWordDto {
  @ApiProperty({
    description: 'Orijinal kelime',
    example: 'hello',
  })
  @IsString()
  @IsNotEmpty()
  originalText: string;

  @ApiProperty({
    description: 'Çevrilmiş kelime',
    example: 'merhaba',
  })
  @IsString()
  @IsNotEmpty()
  translatedText: string;

  @ApiProperty({
    description: 'Kelimenin türü (interj., n., v. vs)',
    example: 'interj.',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Kategori bilgisi (General, Speaking vs)',
    example: 'General',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Kaynak dil (varsayılan: en)',
    enum: Language,
    required: false,
    default: Language.EN,
  })
  @IsOptional()
  @IsEnum(Language)
  sourceLanguage?: Language;

  @ApiProperty({
    description: 'Hedef dil (varsayılan: tr)',
    enum: Language,
    required: false,
    default: Language.TR,
  })
  @IsOptional()
  @IsEnum(Language)
  targetLanguage?: Language;
}
