import { Controller, Post, Get, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, Request, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post('upload/pdf')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload PDF and create book' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadPdf(
        @Request() req,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.bookService.createFromPdf(req.user.sub, file);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new book' })
    async create(
        @Request() req,
        @Body() createBookDto: CreateBookDto
    ) {
        return this.bookService.create(createBookDto, req.user.sub);
    }

    @Get()
    @ApiOperation({ summary: 'Get all books for current user' })
    async findAll(@Request() req) {
        return this.bookService.findAllByUserId(req.user.sub);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a book by id' })
    async findOne(
        @Request() req,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.bookService.findOne(id, req.user.sub);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a book' })
    async remove(
        @Request() req,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.bookService.remove(id, req.user.sub);
    }
}