import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { BookPage } from './entities/book-page.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { FileService } from '../file/file.service';
import { ILike } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(BookPage)
    private readonly bookPageRepository: Repository<BookPage>,

    private readonly fileService: FileService,
  ) {}

  async createFullBookWithPages(
    userId: number,
    file: Express.Multer.File,
    details: CreateBookDto,
  ): Promise<Book> {
    const filePath = await this.fileService.saveFile(file);
    const rawText = await this.fileService.extractText(filePath);

    const pageSize = 1000;
    const paragraphs = rawText.split(/\n\n|\r\n\r\n/).filter((p) => p.trim());

    const pageEntities: BookPage[] = [];
    let pageNumber = 1;
    let buffer = '';

    for (const para of paragraphs) {
      if ((buffer + para).length > pageSize) {
        if (buffer.trim()) {
          pageEntities.push(
            this.bookPageRepository.create({
              pageNumber: pageNumber++,
              content: buffer.trim(),
            }),
          );
          buffer = para + '\n\n';
        } else {
          let start = 0;
          while (start < para.length) {
            const chunk = para.slice(start, start + pageSize);
            pageEntities.push(
              this.bookPageRepository.create({
                pageNumber: pageNumber++,
                content: chunk.trim(),
              }),
            );
            start += pageSize;
          }
          buffer = '';
        }
      } else {
        buffer += para + '\n\n';
      }
    }

    if (buffer.trim()) {
      pageEntities.push(
        this.bookPageRepository.create({
          pageNumber: pageNumber++,
          content: buffer.trim(),
        }),
      );
    }

    // 1. Kitabı kaydet
    const book = this.bookRepository.create({
      ...details,
      userId,
      filePath,
    });
    const savedBook = await this.bookRepository.save(book);

    // 2. Sayfaları ilişkilendirerek tek tek kaydet
    for (const page of pageEntities) {
      page.book = savedBook;
      await this.bookPageRepository.save(page);
    }

    // 3. Dosyayı sil
    await this.fileService.deleteFile(filePath);

    // 4. Kitap + sayfalar ile geri dön
    const bookWithPages = await this.bookRepository.findOne({
      where: { id: savedBook.id },
      relations: ['pages'],
    });
    if (!bookWithPages)
      throw new NotFoundException('Book not found after save');
    return bookWithPages;
  }

  async getBookPage(
    bookId: number,
    userId: number,
    page: number,
  ): Promise<any> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId, userId },
    });
    if (!book) throw new NotFoundException('Book not found');
    const totalPages = await this.bookPageRepository.count({
      where: { bookId },
    });
    if (page < 1 || page > totalPages) page = 1;
    const pageData = await this.bookPageRepository.findOne({
      where: { bookId, pageNumber: page },
    });
    return {
      content: pageData?.content || '',
      currentPage: page,
      totalPages,
      bookTitle: book.title,
      bookAuthor: book.author,
      totalContentLength: -1,
    };
  }

  async findAllByUser(userId: number): Promise<Book[]> {
    return await this.bookRepository.find({
      where: { userId },
      relations: ['progress'], // progress ilişkisini ekle
    });
  }
  
  async findOneByUser(id: number, userId: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id, userId },
      relations: ['progress'], // progress ilişkisini ekle
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async remove(id: number, userId: number): Promise<void> {
    const book = await this.findOneByUser(id, userId);
    if (book.filePath) {
      try {
        await this.fileService.deleteFile(book.filePath);
      } catch (err) {
        console.error('⚠️ File deletion failed:', err);
      }
    }
    await this.bookRepository.remove(book);
  }

  async searchBooks(userId: number, query: string): Promise<Book[]> {
    return this.bookRepository.find({
      where: [
        { userId, title: ILike(`%${query}%`) },
        { userId, author: ILike(`%${query}%`) },
      ],
      relations: ['progress'],
    });
  }
}
