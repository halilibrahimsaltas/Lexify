import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { WordService } from './word.service';
import { CreateWordDto } from './dto/create-word.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  @ApiOperation({ summary: 'Kelimeyi favorilere ekle' })
  async add(@Request() req, @Body() dto: CreateWordDto) {
    const word = await this.wordService.addToFavorites(req.user.sub, dto);
    // Backend response: { message, word }
    return word;
  }

  @Get()
  @ApiOperation({ summary: 'Favori kelimeleri getir' })
  async list(@Request() req) {
    return this.wordService.getFavorites(req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Favori kelimeyi sil' })
  async remove(@Request() req, @Param('id', ParseIntPipe) wordId: number) {
    await this.wordService.removeFavorite(req.user.sub, wordId);
    return { message: 'Favoriden kaldırıldı' };
  }
}
