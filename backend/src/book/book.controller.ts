import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('upload/pdf')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload PDF + book details' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Kitap bilgileri ve PDF dosyası',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        title: { type: 'string', example: 'English Grammar' },
        author: { type: 'string', example: 'John Doe' },
        category: { type: 'string', example: 'Language' },
        coverImage: {
          type: 'string',
          example: 'https://example.com/cover.jpg',
        },
      },
      required: ['file', 'title', 'author', 'category'],
    },
  })
  async uploadPdfWithDetails(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() bookDetails: CreateBookDto,
  ) {
    return this.bookService.createFullBookWithPages(
      req.user.sub,
      file,
      bookDetails,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all books for current user' })
  async findAll(@Request() req) {
    return this.bookService.findAllByUser(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by id' })
  @ApiParam({ name: 'id', type: Number, description: 'Kitap ID değeri' })
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOneByUser(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', type: Number, description: 'Kitap ID değeri' })
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, req.user.sub, updateBookDto);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Get book content with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'İstenen sayfa numarası',
  })
  async getBookContent(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: number,
  ) {
    return this.bookService.getBookPage(id, req.user.sub, Number(page) || 1);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book' })
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id, req.user.sub);
  }

  @Get('search')
  async searchBooks(@Request() req, @Query('query') query: string) {
    return this.bookService.searchBooks(req.user.sub, query);
  }
}
