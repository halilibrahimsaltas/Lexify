import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class WordService {
    private readonly CACHE_TTL = 3600; // 1 saat
    private readonly USER_WORDS_CACHE_KEY = 'user_words:';
    private readonly WORD_CACHE_KEY = 'word:';

    constructor(
        @InjectRepository(Word) private wordRepository: Repository<Word>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}

    async create(createWordDto: CreateWordDto): Promise<Word> {
        // Kelime zaten kullanıcıya eklenmiş mi kontrol et
        const existingWord = await this.wordRepository.findOne({
            where: {
                originalText: createWordDto.originalText,
                userId: createWordDto.userId
            }
        });

        if (existingWord) {
            throw new ConflictException('Word already exists for this user');
        }

        // Yeni kelime oluştur
        const newWord = this.wordRepository.create(createWordDto);
        const savedWord = await this.wordRepository.save(newWord);
        
        // Cache'i temizle
        await this.clearUserWordsCache(createWordDto.userId);
        
        return savedWord;
    }

    async findAllByUserId(userId: number): Promise<Word[]> {
        // Cache'den kontrol et
        const cacheKey = this.USER_WORDS_CACHE_KEY + userId;
        const cachedWords = await this.cacheManager.get<Word[]>(cacheKey);
        
        if (cachedWords) {
            return cachedWords;
        }

        // Cache'de yoksa veritabanından al
        const words = await this.wordRepository.find({
            where: { userId }
        });

        // Cache'e kaydet
        await this.cacheManager.set(cacheKey, words, this.CACHE_TTL);
        
        return words;
    }

    async update(id: number, updateWordDto: UpdateWordDto): Promise<Word> {
        const word = await this.wordRepository.findOne({
            where: { id }
        });

        if (!word) {
            throw new NotFoundException('Word not found');
        }

        // Kelimeyi güncelle
        Object.assign(word, updateWordDto);
        const updatedWord = await this.wordRepository.save(word);
        
        // Cache'i temizle
        await this.clearWordCache(id);
        await this.clearUserWordsCache(word.userId);
        
        return updatedWord;
    }

    async remove(id: number): Promise<void> {
        const word = await this.wordRepository.findOne({
            where: { id }
        });

        if (!word) {
            throw new NotFoundException('Word not found');
        }

        await this.wordRepository.remove(word);
        
        // Cache'i temizle
        await this.clearWordCache(id);
        await this.clearUserWordsCache(word.userId);
    }

    private async clearUserWordsCache(userId: number): Promise<void> {
        const cacheKey = this.USER_WORDS_CACHE_KEY + userId;
        await this.cacheManager.del(cacheKey);
    }

    private async clearWordCache(wordId: number): Promise<void> {
        const cacheKey = this.WORD_CACHE_KEY + wordId;
        await this.cacheManager.del(cacheKey);
    }
}
