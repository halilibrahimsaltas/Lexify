import { Module } from '@nestjs/common';
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

@Module({
  imports: [AuthModule, UserModule, AuthModule, BookModule, WordModule, AudioModule, SearchModule, FileModule],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
