import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { WordService } from './word.service';
import { Word } from './entities/word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('words')
@Controller('words')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WordController {
    constructor(private wordService: WordService) {}

    @Post()
    @ApiOperation({ summary: 'Add a new word' })
    @ApiResponse({ status: 201, description: 'Word successfully added' })
    async create(
        @Request() req,
        @Body() createWordDto: CreateWordDto
    ): Promise<Word> {
        return this.wordService.create(createWordDto, req.user.sub);
    }

    @Get()
    @ApiOperation({ summary: 'Get all words for current user' })
    @ApiResponse({ status: 200, description: 'Return all words for user' })
    async findAll(@Request() req): Promise<Word[]> {
        return this.wordService.findAllByUserId(req.user.sub);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a word' })
    @ApiResponse({ status: 200, description: 'Word successfully updated' })
    async update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWordDto: UpdateWordDto
    ): Promise<Word> {
        return this.wordService.update(id, updateWordDto, req.user.sub);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a word' })
    @ApiResponse({ status: 200, description: 'Word successfully deleted' })
    async remove(
        @Request() req,
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        return this.wordService.remove(id, req.user.sub);
    }
}
