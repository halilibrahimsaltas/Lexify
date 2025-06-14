import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
    Matches,
    IsDate,
    IsEnum,
} from 'class-validator';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { UserRole } from '../../common/enum/user-role.enum';
import { Word } from '../../word/entities/word.entity';

@Entity('users')
@Unique(['email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters.' })
    name: string;

    @Column()
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format.' })
    email: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    @IsNotEmpty()
    @IsEnum(UserRole, { message: 'Invalid role' })
    role: UserRole;

    @Column()
    @IsNotEmpty()
    @IsString()
    @Length(8, 32, { message: 'Password must be 8-32 characters long.' })
    @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]+$/, {
        message: 'Password must contain only letters, numbers, and allowed special characters.',
    })
    password: string;

    @ManyToMany(() => Word, (word) => word.users)
    @JoinTable({
        name: 'user_words',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'word_id',
            referencedColumnName: 'id',
        },
    })
    words: Word[];

    @CreateDateColumn()
    @IsDate()
    createdAt: Date;

    @UpdateDateColumn()
    @IsDate()
    updatedAt: Date;
}