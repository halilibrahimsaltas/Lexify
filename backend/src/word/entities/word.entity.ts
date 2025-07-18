import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('words')
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalText: string; // Örn: hello

  @Column()
  translatedText: string; // Örn: merhaba

  @Column({ default: 'en' })
  sourceLanguage: string;

  @Column({ default: 'tr' })
  targetLanguage: string;

  @Column({ nullable: true })
  type?: string; // Örn: interj.

  @Column({ nullable: true })
  category?: string; // Örn: General, Speaking vs.

  @ManyToMany(() => User, (user) => user.words)
  @JoinTable({
    name: 'user_words',
    joinColumn: {
      name: 'word_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
