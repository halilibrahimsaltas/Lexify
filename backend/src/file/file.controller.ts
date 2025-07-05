import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import * as epubParser from 'epub-parser';

@ApiTags('files')
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
    constructor(private readonly fileService: FileService) {}

    @Post('upload/pdf')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload PDF file' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadPdf(@UploadedFile() file: Express.Multer.File) {
        const filePath = await this.fileService.saveFile(file);
        const extractedText = await this.fileService.extractText(filePath);
        
        // İşlem bittikten sonra dosyayı sil
        await this.fileService.deleteFile(filePath);
        
        return {
            message: 'PDF processed successfully',
            text: extractedText
        };
    }
}
