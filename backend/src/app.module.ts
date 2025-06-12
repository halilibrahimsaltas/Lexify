import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { BookModule } from './book/book.module';
import { WordModule } from './word/word.module';
import { AudioModule } from './audio/audio.module';
import { SearchModule } from './search/search.module';
import { FileModule } from './file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    AuthModule,
    BookModule,
    WordModule,
    AudioModule,
    SearchModule,
    FileModule
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
