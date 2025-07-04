import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookProgressService } from './book-progress.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ParseIntPipe } from '@nestjs/common';

@ApiTags('progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('progress')
export class BookProgressController {
  constructor(private readonly service: BookProgressService) {}

  @Post(':bookId')
  @ApiOperation({ summary: 'Kullanıcının kitapta kaldığı sayfayı kaydet' })
  async save(
    @Request() req,
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() body: { currentPage: number },
  ) {
    await this.service.saveProgress(req.user.sub, bookId, body.currentPage);
    return { message: 'Progress updated' };
  }

  @Get(':bookId')
  @ApiOperation({ summary: 'Kullanıcının kitapta kaldığı sayfayı getir' })
  async get(@Request() req, @Param('bookId', ParseIntPipe) bookId: number) {
    const currentPage = await this.service.getProgress(req.user.sub, bookId);
    return { currentPage };
  }
}
