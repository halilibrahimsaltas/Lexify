import { Controller, Post, Get, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, Request, ParseIntPipe, Query } from '@nestjs/common';
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

    @Post('upload/pdf-with-details')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload PDF with book details and create book' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                title: {
                    type: 'string',
                },
                author: {
                    type: 'string',
                },
                category: {
                    type: 'string',
                },
                coverImage: {
                    type: 'string',
                },
                filePath: {
                    type: 'string',
                },
            },
        },
    })
    async uploadPdfWithDetails(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
        @Body() bookDetails: any
    ) {
        return this.bookService.createFromPdfWithDetails(req.user.sub, file, bookDetails);
    }

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
        console.log('📁 Upload PDF - File received:', file ? 'YES' : 'NO');
        console.log('📁 File details:', file);
        
        if (!file) {
            throw new Error('No file uploaded');
        }
        
        if (!file.originalname) {
            throw new Error('File has no originalname');
        }
        
        if (!file.buffer) {
            throw new Error('File has no buffer');
        }
        
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

    @Get(':id/content')
    @ApiOperation({ summary: 'Get book content with pagination' })
    async getBookContent(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page?: number
    ) {
        return this.bookService.getBookContentWithProgress(id, req.user.sub, page);
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