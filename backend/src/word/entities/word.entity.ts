import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}