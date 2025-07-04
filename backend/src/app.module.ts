import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WordModule } from './word/word.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TranslationModule } from './translation/translation.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { BookModule } from './book/book.module';
import { FileModule } from './file/file.module';
import { BookProgressModule } from './book-progress/book-progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('POSTGRES_HOST'),
          port: config.get<number>('POSTGRES_PORT'),
          username: config.get<string>('POSTGRES_USER'),
          password: config.get<string>('POSTGRES_PASSWORD'),
          database: config.get<string>('POSTGRES_DB'),
          synchronize: true,
          autoLoadEntities: true,
          entities: [__dirname + '/**/entities/*.entity.ts'],
          logging: config.get<string>('NODE_ENV') !== 'production',
          cache: {
            duration: config.get<number>('TYPEORM_CACHE_DURATION'),
          },
        };
      },
    }),

    AuthModule,
    UserModule,
    WordModule,
    TranslationModule,
    DictionaryModule,
    BookModule,
    FileModule,
    BookProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
