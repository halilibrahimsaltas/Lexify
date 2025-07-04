import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Book } from '../../book/entities/book.entity';

@Entity('book_progress')
@Unique(['user', 'book']) // Her kullanıcı-kitap çifti için sadece bir kayıt
export class BookProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookProgress, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Book, (book) => book.progress, { onDelete: 'CASCADE' })
  book: Book;

  @Column()
  currentPage: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
