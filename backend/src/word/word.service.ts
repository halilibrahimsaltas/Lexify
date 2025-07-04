import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepo: Repository<Word>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async addToFavorites(userId: number, dto: CreateWordDto): Promise<Word> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['words'],
    });
    if (!user) throw new NotFoundException('User not found');

    let whereClause: any = {
      originalText: dto.originalText,
      translatedText: dto.translatedText,
    };
    if (dto.type !== undefined) whereClause.type = dto.type;
    if (dto.category !== undefined) whereClause.category = dto.category;

    let word = await this.wordRepo.findOne({
      where: whereClause,
    });

    if (!word) {
      word = this.wordRepo.create({ ...dto });
      word = await this.wordRepo.save(word);
    }

    const alreadySaved = user.words.some((w) => w.id === word.id);
    if (!alreadySaved) {
      user.words.push(word);
      await this.userRepo.save(user);
    }

    return word;
  }

  async getFavorites(userId: number): Promise<Word[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['words'],
    });
    return user?.words || [];
  }

  async removeFavorite(userId: number, wordId: number): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['words'],
    });
    if (!user) throw new NotFoundException('User not found');

    user.words = user.words.filter((w) => w.id !== wordId);
    await this.userRepo.save(user);
  }
}
