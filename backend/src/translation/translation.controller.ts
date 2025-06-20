import { Controller, Post, Body } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslateDto } from './dto/translate.dto';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post('translate')
  async translate(@Body() dto: TranslateDto) {
    return await this.translationService.translate(dto);
  }
}