import { Module } from '@nestjs/common';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TRANSLATION_CONSTANTS } from './constants/translation.constants';
import { WordModule } from '../word/word.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    CacheModule.register({
      ttl: TRANSLATION_CONSTANTS.CACHE.TTL,
      max: 100
    }),
    WordModule
  ],
  controllers: [TranslationController],
  providers: [TranslationService],
  exports: [TranslationService]
})
export class TranslationModule {}
