import { Injectable, Logger } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_APP_PASSWORD'),
      },
    });
  }

  async create(createFeedbackDto: CreateFeedbackDto) {
    const { subject, body } = createFeedbackDto;
    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to: this.configService.get<string>('FEEDBACK_EMAIL'),
        subject: `[Geri Bildirim] ${subject}`,
        text: body,
      };
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.debug(`Feedback email sent: ${info.messageId}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to send feedback email: ${error.message}`);
      throw new Error(`Failed to send feedback email: ${error.message}`);
    }
  }

  findAll() {
    return `This action returns all feedback`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
