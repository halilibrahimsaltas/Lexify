// translate.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength, IsIn } from 'class-validator';
import { Language } from '../constants/language.enum';

export class TranslateDto {

  @ApiProperty({ example: 'Hello', description: 'Text to translate' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  text: string;


  @ApiProperty({ example: 'auto', description: 'Source language (ISO code or auto)' })
  @IsString()
  @IsIn(['auto', 'en', 'tr', 'fr', 'de'])
  sourceLanguage: string;

 
 
  @ApiProperty({ example: 'tr', description: 'Target language (ISO code)' })
  @IsString()
  @IsIn(['en', 'tr', 'fr', 'de'])
  targetLanguage: string;
}
