import { PartialType } from '@nestjs/swagger';
import { CreateBookProgressDto } from './create-book-progress.dto';

export class UpdateBookProgressDto extends PartialType(CreateBookProgressDto) {}
