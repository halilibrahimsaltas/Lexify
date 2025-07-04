import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'Kitap başlığı',
    example: 'English Grammar'
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Kitap yazarı',
    example: 'John Doe'
  })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({
    description: 'Kitap kapak resmi URL\'i',
    example: 'https://example.com/cover.jpg',
    required: false
  })
  @IsOptional()
  @IsString()
  coverImage?: string;


  @ApiProperty({
    description: 'Kitap kategorisi',
    example: 'Language Learning'
  })
  @IsNotEmpty()
  @IsString()
  category: string;
}
