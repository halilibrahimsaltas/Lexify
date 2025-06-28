import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { FileService } from '../file/file.service';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private fileService: FileService
  ) {}

  async createFromPdf(userId: number, file: Express.Multer.File): Promise<Book> {
    // PDF'den metin çıkar
    const filePath = await this.fileService.saveFile(file);
    const extractedText = await this.fileService.extractTextFromPdf(filePath);
    
    // Kitabı oluştur
    const book = this.bookRepository.create({
      title: file.originalname.replace('.pdf', ''),
      content: extractedText,
      author: 'Bilinmeyen Yazar', // PDF'den yazar bilgisi çıkarılamadığı için varsayılan değer
      filePath: filePath,
      category: 'PDF Kitap', // Varsayılan kategori
      userId
    });

    const savedBook = await this.bookRepository.save(book);
    
    // Geçici dosyayı sil
    await this.fileService.deleteFile(filePath);
    
    return savedBook;
  }

  async create(createBookDto: CreateBookDto, userId: number): Promise<Book> {
    const book = this.bookRepository.create({
      ...createBookDto,
      userId
    });

    return this.bookRepository.save(book);
  }

  async findAllByUserId(userId: number): Promise<Book[]> {
    return this.bookRepository.find({
      where: { userId }
    });
  }

  async findOne(id: number, userId: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id, userId }
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async remove(id: number, userId: number): Promise<void> {
    const book = await this.findOne(id, userId);
    await this.bookRepository.remove(book);
  }
}