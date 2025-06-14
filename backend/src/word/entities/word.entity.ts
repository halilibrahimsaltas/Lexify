import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('words')
export class Word {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    originalText: string;

    @Column()
    translatedText: string;

    @Column({ default: 'en' })
    sourceLanguage: string;

    @Column({ default: 'tr' })
    targetLanguage: string;

    @Column()
    userId: number;

    @ManyToMany(() => User, (user) => user.words)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}