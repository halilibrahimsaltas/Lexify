import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Word {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    word: string;

    @Column()
    definition: string;

    @ManyToMany(() => User, (user) => user.words)
    @JoinTable({
        name: 'user_words',
        joinColumn: {
            name: 'word_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
    })
    users: User[];
}