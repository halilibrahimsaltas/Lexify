import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class WordService {
    private readonly CACHE_TTL = 3600; // 1 saat
    private readonly USER_WORDS_CACHE_KEY = 'user_words:';
    private readonly WORD_CACHE_KEY = 'word:';

    constructor(
        @InjectRepository(Word) private wordRepository: Repository<Word>,
        private userService: UserService,
        private redisService: RedisService
    ) {}

    async createWord(userId: number, word: string, definition: string): Promise<Word> {
        const user = await this.userService.findUserById(userId);
        
        // Önce kelimeyi kontrol et, varsa onu kullan
        let existingWord = await this.wordRepository.findOne({
            where: { word },
            relations: ['users']
        });

        if (existingWord) {
            // Kelime zaten kullanıcıya eklenmiş mi kontrol et
            if (existingWord.users.some(u => u.id === userId)) {
                throw new ConflictException('Word already exists for this user');
            }
            // Kelimeyi kullanıcıya ekle
            existingWord.users.push(user);
            const savedWord = await this.wordRepository.save(existingWord);
            
            // Cache'i temizle
            await this.clearUserWordsCache(userId);
            await this.clearWordCache(savedWord.id);
            
            return savedWord;
        }

        // Yeni kelime oluştur
        const newWord = this.wordRepository.create({
            word,
            definition,
            users: [user]
        });

        const savedWord = await this.wordRepository.save(newWord);
        
        // Cache'i temizle
        await this.clearUserWordsCache(userId);
        
        return savedWord;
    }

    async getUserWords(userId: number): Promise<Word[]> {
        // Cache'den kontrol et
        const cacheKey = this.USER_WORDS_CACHE_KEY + userId;
        const cachedWords = await this.redisService.get<Word[]>(cacheKey);
        
        if (cachedWords) {
            return cachedWords;
        }

        // Cache'de yoksa veritabanından al
        await this.userService.findUserById(userId); // Kullanıcının var olduğunu kontrol et
        const words = await this.wordRepository
            .createQueryBuilder('word')
            .innerJoin('word.users', 'user', 'user.id = :userId', { userId })
            .getMany();

        // Cache'e kaydet
        await this.redisService.set(cacheKey, words, this.CACHE_TTL);
        
        return words;
    }

    async updateWordDefinition(wordId: number, definition: string): Promise<Word> {
        const word = await this.wordRepository.findOne({
            where: { id: wordId }
        });

        if (!word) {
            throw new NotFoundException('Word not found');
        }

        word.definition = definition;
        const updatedWord = await this.wordRepository.save(word);
        
        // Cache'i temizle
        await this.clearWordCache(wordId);
        // İlgili kullanıcıların kelime listesi cache'ini temizle
        for (const user of word.users) {
            await this.clearUserWordsCache(user.id);
        }
        
        return updatedWord;
    }

    async removeWordFromUser(userId: number, wordId: number): Promise<void> {
        const word = await this.wordRepository.findOne({
            where: { id: wordId },
            relations: ['users']
        });

        if (!word) {
            throw new NotFoundException('Word not found');
        }

        // Kelimeyi kullanıcının listesinden çıkar
        word.users = word.users.filter(user => user.id !== userId);
        
        // Cache'i temizle
        await this.clearUserWordsCache(userId);
        
        // Eğer kelimeyi kullanan başka kullanıcı yoksa kelimeyi sil
        if (word.users.length === 0) {
            await this.wordRepository.remove(word);
            await this.clearWordCache(wordId);
        } else {
            await this.wordRepository.save(word);
        }
    }

    private async clearUserWordsCache(userId: number): Promise<void> {
        const cacheKey = this.USER_WORDS_CACHE_KEY + userId;
        await this.redisService.del(cacheKey);
    }

    private async clearWordCache(wordId: number): Promise<void> {
        const cacheKey = this.WORD_CACHE_KEY + wordId;
        await this.redisService.del(cacheKey);
    }
}
