import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        TypeOrmModule.forFeature([Word]),
        CacheModule.register({
            ttl: 3600, // 1 saat
            max: 100
        })
    ],
    controllers: [WordController],
    providers: [WordService],
    exports: [WordService]
})
export class WordModule {}
