import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BookPage } from './book-page.entity';
import { BookProgress } from '../../book-progress/entities/book-progress.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column()
  author: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column()
  filePath: string;

  @Column()
  category: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // Book.userId ile eşle
  user: User;

  @OneToMany(() => BookPage, (page) => page.book, {
    cascade: true,
    eager: true, // kitap getirilince sayfaları da getirsin (isteğe bağlı)
  })
  pages: BookPage[];

  @OneToMany(() => BookProgress, (progress) => progress.book)
  progress: BookProgress[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
