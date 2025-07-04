import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookProgress } from './entities/book-progress.entity';

@Injectable()
export class BookProgressService {
  constructor(
    @InjectRepository(BookProgress)
    private progressRepo: Repository<BookProgress>,
  ) {}

  async saveProgress(
    userId: number,
    bookId: number,
    page: number,
  ): Promise<void> {
    const existing = await this.progressRepo.findOne({
      where: {
        user: { id: userId },
        book: { id: bookId },
      },
    });

    if (existing) {
      existing.currentPage = page;
      existing.updatedAt = new Date();
      await this.progressRepo.save(existing);
    } else {
      const progress = this.progressRepo.create({
        user: { id: userId },
        book: { id: bookId },
        currentPage: page,
      });
      await this.progressRepo.save(progress);
    }
  }

  async getProgress(userId: number, bookId: number): Promise<number> {
    const record = await this.progressRepo.findOne({
      where: {
        user: { id: userId },
        book: { id: bookId },
      },
    });

    return record?.currentPage ?? 1;
  }
}
