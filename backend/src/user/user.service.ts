import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Word } from '../word/entities/word.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enum/user-role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Word) private wordRepository: Repository<Word>
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // Eğer rol gönderilmezse, otomatik olarak 'user' ata
        if (!createUserDto.role) {
            createUserDto.role = UserRole.USER;
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword
        });
        return this.userRepository.save(user);
    }

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.find({ relations: ['words'] });
    }

    async findUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ 
            where: { id },
            relations: ['words']
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { words, password, ...userData } = updateUserDto;
        const user = await this.userRepository.findOne({ 
            where: { id },
            relations: ['words']
        });
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (words) {
            // Mevcut kelimeleri sil
            await this.wordRepository.delete({ users: { id: user.id } });
            // Yeni kelimeleri ekle
            const wordEntities = words.map(wordText => {
                const word = new Word();
                word.originalText = wordText;
                word.translatedText = ''; // Varsayılan boş çeviri
                word.sourceLanguage = 'en';
                word.targetLanguage = 'tr';
                word.users = [user];
                return word;
            });
            await this.wordRepository.save(wordEntities);
        }


        // Parola güncelleniyorsa hashle
        if (password && password.trim()) {
            user.password = await bcrypt.hash(password, 10);
        }

        Object.assign(user, userData);
        return this.userRepository.save(user);
    }

    async deleteUser(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ 
            where: { email },
            relations: ['words']
        });
        return user;
    }

    async getUserWords(userId: number): Promise<string[]> {
        const user = await this.userRepository.findOne({ 
            where: { id: userId },
            relations: ['words']
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user.words.map(word => word.originalText);
    }
}
