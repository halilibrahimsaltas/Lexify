import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity';
import { FileModule } from '../file/file.module';
import { BookPage } from './entities/book-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookPage]), FileModule],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
