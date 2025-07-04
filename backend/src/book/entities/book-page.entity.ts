import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';

@Entity('book_pages')
export class BookPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pageNumber: number;

  @Column('text')
  content: string;

  @Column()
  bookId: number;

  @ManyToOne(() => Book, (book) => book.pages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' }) // BookPage.bookId ile eşle
  book: Book;
}
