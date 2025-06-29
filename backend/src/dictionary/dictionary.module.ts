import { Module } from '@nestjs/common';
import { DictionaryController } from './dictionary.controller';
import { TranslationModule } from '../translation/translation.module';

@Module({
  imports: [TranslationModule],
  controllers: [DictionaryController],
})
export class DictionaryModule {} 