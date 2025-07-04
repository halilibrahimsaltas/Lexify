import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookProgress } from './entities/book-progress.entity';
import { BookProgressService } from './book-progress.service';
import { BookProgressController } from './book-progress.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookProgress])],
  providers: [BookProgressService],
  controllers: [BookProgressController],
})
export class BookProgressModule {}
