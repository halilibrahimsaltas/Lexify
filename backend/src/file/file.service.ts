import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';
import * as epubParser from 'epub-parser';
import Epub = require('epub');

@Injectable()
export class FileService {
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    // Dosya uzantısını al
    const ext = path.extname(file.originalname) || '';
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);
    await fs.promises.writeFile(filePath, file.buffer);
    return filePath;
  }

  async extractText(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      // PDF işle
      const buffer = await fs.promises.readFile(filePath);
      const data = await pdf(buffer, {
        pagerender: this.renderPage,
        max: 0,
        normalizeWhitespace: true,
        disableCombineTextItems: false,
      });
      return this.formatExtractedText(data.text);
    } else if (ext === '.epub') {
      return await this.extractEpubText(filePath);
    } else {
      throw new Error('Desteklenmeyen dosya türü');
    }
  }

  private renderPage(pageData: any): Promise<string> {
    return pageData.getTextContent({
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    }).then((textContent: any) => {
      let lastY: number | undefined = undefined;
      let text = '';
  
      for (let item of textContent.items) {
        const currentY = item.transform[5];
        if (lastY === undefined) {
          text += item.str;
        } else if (Math.abs(lastY - currentY) > 10) {
          text += '\n\n' + item.str; // paragraf boşluğu
        } else if (Math.abs(lastY - currentY) > 1) {
          text += '\n' + item.str; // yeni satır
        } else {
          text += item.str;
        }
        lastY = currentY;
      }
      return text;
    });
  }

  private formatExtractedText(text: string): string {
    return text
      // Kelime bölünmelerini düzelt
      .replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2')
  
      // Gereksiz fazla satır boşluklarını sadeleştir
      .replace(/\n{3,}/g, '\n\n')
  
      // Büyük harfli başlıklar öncesine boşluk ekle (CHAPTER gibi)
      .replace(/(CHAPTER\s+[IVXLC]+\b.*)/g, '\n\n$1\n\n')
  
      // Gereksiz satır sonlarını birleştir (ama başlıkları koruyarak)
      .replace(/(?<![\.\?!])\n(?!\n|[A-Z])/g, ' ')
  
      // Çoklu boşlukları tek boşluk yap
      .replace(/[ \t]{2,}/g, ' ')
      
      .trim();
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error(`Dosya silinemedi: ${filePath}`, error);
    }
  }

  async extractChaptersFromEpub(filePath: string): Promise<string[]> {
    const buffer = await fs.promises.readFile(filePath);
    const book = await epubParser(buffer);
    // Her bölümün HTML içeriğini düz metne çevir ve paragraflara böl
    return book.chapters.map((ch: any) =>
      stripHtml(ch.content)
        .split(/\n{2,}|<p>|<\/p>/) // Paragraflara böl
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0)
        .join('\n\n')
    );
  }

  async extractEpubText(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const epub = new Epub(filePath);

      epub.on('error', reject);

      epub.on('end', async function () {
        const chapters = epub.flow;
        const texts: string[] = [];

        for (const chapter of chapters) {
          try {
            const text = await new Promise<string>((res, rej) =>
              epub.getChapter(chapter.id, (err, text) => {
                if (err) rej(err);
                else res(text);
              }),
            );
            texts.push(stripHtml(text));
          } catch (err) {
            console.warn('Chapter error:', err);
          }
        }

        resolve(texts.join('\n\n'));
      });

      epub.parse();
    });
  }
}

// Basit HTML tag temizleyici
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}
