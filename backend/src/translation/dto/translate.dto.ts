// translate.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class TranslateDto {
  @ApiProperty({ 
    example: 'hello', 
    description: 'Çevirisi yapılacak kelime' 
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(1)
  text: string;
}
