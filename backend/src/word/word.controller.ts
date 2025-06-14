import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { WordService } from './word.service';
import { Word } from './entities/word.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('words')
@Controller('words')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WordController {
    constructor(private wordService: WordService) {}

    @Post(':userId')
    @ApiOperation({ summary: 'Add a word to user\'s list' })
    @ApiResponse({ status: 201, description: 'Word successfully added to user\'s list' })
    createWord(
        @Param('userId', ParseIntPipe) userId: number,
        @Body('word') word: string,
        @Body('definition') definition: string
    ): Promise<Word> {
        return this.wordService.createWord(userId, word, definition);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Get all words for user' })
    @ApiResponse({ status: 200, description: 'Return all words for user' })
    getUserWords(@Param('userId', ParseIntPipe) userId: number): Promise<Word[]> {
        return this.wordService.getUserWords(userId);
    }

    @Put(':wordId/definition')
    @ApiOperation({ summary: 'Update word definition' })
    @ApiResponse({ status: 200, description: 'Word definition successfully updated' })
    updateWordDefinition(
        @Param('wordId', ParseIntPipe) wordId: number,
        @Body('definition') definition: string
    ): Promise<Word> {
        return this.wordService.updateWordDefinition(wordId, definition);
    }

    @Delete(':userId/:wordId')
    @ApiOperation({ summary: 'Remove word from user\'s list' })
    @ApiResponse({ status: 200, description: 'Word successfully removed from user\'s list' })
    removeWordFromUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('wordId', ParseIntPipe) wordId: number
    ): Promise<void> {
        return this.wordService.removeWordFromUser(userId, wordId);
    }
}
