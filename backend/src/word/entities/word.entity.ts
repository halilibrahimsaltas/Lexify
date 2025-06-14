import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Word {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    word: string;

    @Column()
    definition: string;

    @Column()
    example: string;

    @Column()
    category: string; 
}