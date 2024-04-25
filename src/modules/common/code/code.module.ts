import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { SmsService } from './sms.service';
import { EmailService } from './email.service';

@Module({
  providers: [SmsService, EmailService],
  controllers: [CodeController],
})
export default class CodeModule {}
