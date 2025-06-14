import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word]),
    UserModule,
    RedisModule
  ],
  controllers: [WordController],
  providers: [WordService],
  exports: [WordService]
})
export class WordModule {}
