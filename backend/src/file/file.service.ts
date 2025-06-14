import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'pdf-parse';

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
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(this.uploadDir, fileName);
        
        await fs.promises.writeFile(filePath, file.buffer);
        return filePath;
    }

    async extractTextFromPdf(filePath: string): Promise<string> {
        const dataBuffer = await fs.promises.readFile(filePath);
        const data = await pdf(dataBuffer, {
            pagerender: this.renderPage,
            max: 0 // Tüm sayfaları işle
        });

        return this.formatExtractedText(data.text);
    }

    private renderPage(pageData: any): string {
        let renderOptions = {
            normalizeWhitespace: true,
            disableCombineTextItems: false
        };

        return pageData.getTextContent(renderOptions)
            .then((textContent: any) => {
                let lastY, text = '';
                for (let item of textContent.items) {
                    if (lastY == item.transform[5] || !lastY) {
                        text += item.str;
                    } else {
                        text += '\n' + item.str;
                    }
                    lastY = item.transform[5];
                }
                return text;
            });
    }

    private formatExtractedText(text: string): string {
        return text
            // Birden fazla boş satırı tek satıra indir
            .replace(/^\s+$/gm, '')
            .replace(/\n{3,}/g, '\n\n')
            // Tire ile bölünmüş kelimeleri birleştir
            .replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2')
            // Cümle ortasındaki gereksiz satır sonlarını kaldır
            .replace(/(?<![\\.\\!\\?])\s*\n(?!\s*[A-Z])/g, ' ')
            .trim();
    }

    async deleteFile(filePath: string): Promise<void> {
        try {
            await fs.promises.unlink(filePath);
        } catch (error) {
            console.error(`Error deleting file: ${filePath}`, error);
        }
    }
}
