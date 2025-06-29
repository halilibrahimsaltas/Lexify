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

  async createFromPdfWithDetails(userId: number, file: Express.Multer.File, bookDetails: any): Promise<Book> {
    console.log('📚 PDF ile kitap oluşturuluyor:', bookDetails.title);
    
    try {
      // PDF dosyasını kaydet
      const filePath = await this.fileService.saveFile(file);
      console.log('📁 PDF dosyası kaydedildi:', filePath);
      
      // PDF'den metin çıkar (Java'daki PdfExtractor mantığı)
      const extractedText = await this.fileService.extractTextFromPdf(filePath);
      console.log('📖 PDF içeriği çıkarıldı, uzunluk:', extractedText.length);
      
      // Kitabı oluştur (Java'daki saveBook mantığı)
      const book = this.bookRepository.create({
        title: bookDetails.title,
        content: extractedText, // PDF'den çıkarılan içerik
        author: bookDetails.author,
        coverImage: bookDetails.coverImage || null,
        filePath: bookDetails.filePath || filePath, // PDF dosya yolu
        category: bookDetails.category,
        userId
      });

      const savedBook = await this.bookRepository.save(book);
      console.log('✅ Kitap başarıyla kaydedildi, ID:', savedBook.id);
      
      // Geçici dosyayı sil (Java'daki deleteBook mantığı)
      await this.fileService.deleteFile(filePath);
      console.log('🗑️ Geçici PDF dosyası silindi');
      
      return savedBook;
    } catch (error) {
      console.error('❌ Kitap oluşturulurken hata:', error);
      throw error;
    }
  }

  async createFromPdf(userId: number, file: Express.Multer.File): Promise<Book> {
    console.log('📚 PDF ile otomatik kitap oluşturuluyor');
    
    try {
      // PDF dosyasını kaydet
      const filePath = await this.fileService.saveFile(file);
      
      // PDF'den metin çıkar
      const extractedText = await this.fileService.extractTextFromPdf(filePath);
      
      // Kitabı oluştur
      const book = this.bookRepository.create({
        title: file.originalname.replace('.pdf', ''),
        content: extractedText,
        author: 'Bilinmeyen Yazar',
        filePath: filePath,
        category: 'PDF Kitap',
        userId
      });

      const savedBook = await this.bookRepository.save(book);
      
      // Geçici dosyayı sil
      await this.fileService.deleteFile(filePath);
      
      return savedBook;
    } catch (error) {
      console.error('❌ Otomatik kitap oluşturulurken hata:', error);
      throw error;
    }
  }

  async create(createBookDto: CreateBookDto, userId: number): Promise<Book> {
    console.log('📚 Manuel kitap oluşturuluyor:', createBookDto.title);
    
    const book = this.bookRepository.create({
      ...createBookDto,
      userId
    });

    const savedBook = await this.bookRepository.save(book);
    console.log('✅ Manuel kitap kaydedildi, ID:', savedBook.id);
    
    return savedBook;
  }

  async findAllByUserId(userId: number): Promise<Book[]> {
    console.log('📚 Kullanıcının kitapları getiriliyor, User ID:', userId);
    
    const books = await this.bookRepository.find({
      where: { userId }
    });
    
    console.log('✅', books.length, 'kitap bulundu');
    return books;
  }

  async findOne(id: number, userId: number): Promise<Book> {
    console.log('📚 Kitap getiriliyor, ID:', id, 'User ID:', userId);
    
    const book = await this.bookRepository.findOne({
      where: { id, userId }
    });

    if (!book) {
      console.log('❌ Kitap bulunamadı, ID:', id);
      throw new NotFoundException('Book not found');
    }

    console.log('✅ Kitap bulundu:', book.title);
    return book;
  }

  async remove(id: number, userId: number): Promise<void> {
    console.log('🗑️ Kitap siliniyor, ID:', id, 'User ID:', userId);
    
    const book = await this.findOne(id, userId);
    
    // Dosyaları sil (Java'daki deleteBook mantığı)
    if (book.filePath) {
      try {
        await this.fileService.deleteFile(book.filePath);
        console.log('🗑️ PDF dosyası silindi:', book.filePath);
      } catch (error) {
        console.error('❌ PDF dosyası silinirken hata:', error);
      }
    }
    
    await this.bookRepository.remove(book);
    console.log('✅ Kitap silindi:', book.title);
  }

  // Java'daki getBookContentWithProgress mantığına benzer metod
  async getBookContentWithProgress(id: number, userId: number, requestedPage?: number): Promise<any> {
    console.log('📖 Kitap içeriği getiriliyor, ID:', id, 'Sayfa:', requestedPage);
    
    try {
      const book = await this.findOne(id, userId);
      
      if (!book.content || book.content.length === 0) {
        throw new NotFoundException('Book content not found');
      }

      // Sayfa numarası belirtilmemişse 1'den başla
      let page = requestedPage || 1;
      const pageSize = 1000; // Java'daki gibi

      // İçeriği paragraflara böl (Java'daki split("\n\n") mantığı)
      const paragraphs = book.content.split('\n\n');
      const totalParagraphs = paragraphs.length;
      
      // Sayfa sınırlarını kontrol et
      if (page < 1) page = 1;
      const totalPages = Math.ceil(totalParagraphs / pageSize);
      if (page > totalPages) page = totalPages;

      const start = (page - 1) * pageSize;
      const end = Math.min(start + pageSize, totalParagraphs);

      // Sayfa içeriğini oluştur
      const pageContent = paragraphs.slice(start, end).join('\n\n');

      const response = {
        content: pageContent,
        currentPage: page,
        totalPages: totalPages,
        bookTitle: book.title,
        bookAuthor: book.author,
        totalContentLength: book.content.length
      };
      
      console.log('✅ Kitap içeriği getirildi, sayfa:', page, '/', totalPages);
      
      return response;
    } catch (error) {
      console.error('❌ Kitap içeriği getirilirken hata:', error);
      throw error;
    }
  }
}