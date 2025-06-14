import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WordModule } from '../word/word.module';
import { Word } from '../word/entities/word.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Word]),
    WordModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
