import { Controller, Get, Session, Query } from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import * as svgCaptcha from 'svg-captcha';
import { SmsService } from './sms.service';
import { PhoneSmsDto } from './dto/sms.dto';
import { ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto';

@ApiTags('验证码模块')
@Controller('common/code')
export class CodeController {
  constructor(
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
  ) {}

  @Get('/img')
  @Public()
  getCode(@Session() session: Record<string, any>) {
    const captcha: svgCaptcha.CaptchaObj = svgCaptcha.createMathExpr({
      size: 6, //验证码长度
      fontSize: 45, //验证码字号
      ignoreChars: '0o1i', // 过滤掉某些字符， 如 0o1i
      noise: 1, //干扰线条数目
      width: 100, //宽度
      // heigth:40,//高度
      color: true, //验证码字符是否有颜色，默认是没有，但是如果设置了背景颜色，那么默认就是有字符颜色
      background: '#cc9966', //背景大小
    });
    console.log('captcha.text', captcha.text);
    // return captcha.text;
    session.code = captcha.text;
    return captcha.data;
    // return new StreamableFile(captcha.data);
  }

  @Get('/phone')
  @Public()
  async getPhoneCode(
    @Session() session: Record<string, any>,
    @Query() params: PhoneSmsDto,
  ) {
    // session.code = '666666';
    session.code = Math.random().toString().slice(2, 8);
    try {
      const result = await this.smsService.sendSms(params.phone, session.code);
      console.log(result);
      return {};
    } catch (error) {
      return {
        code: '1',
        message: error,
      };
    }

    // return {
    //   data: session.code,
    // };
    // return new StreamableFile(captcha.data);
  }

  @Get('/email')
  @Public()
  async getEmailCode(
    @Session() session: Record<string, any>,
    @Query() params: EmailDto,
  ) {
    session.code = Math.random().toString().slice(2, 8);
    try {
      const result = await this.emailService.sendEmail({
        to: params.email,
        subject: '验证码',
        text: '验证码',
        html: `
        <div >
          <p style="font-weight: 600;margin: 0 6px;text-align: center; font-size: 20px">Suno Music</p>

          <p>欢迎, 您正在进行邮箱验证, 您的验证码是:</p> 
          <p style="color: green;font-weight: 600;margin: 0 6px;text-align: center; font-size: 20px">${session.code}</p>
          <hr />
          <p>如果您没有请求次验证码，请忽略此邮件。此验证码请在10分钟后过期，请勿向他人透露验证码。</p>
        </div>
        `,
      });
      console.log(result);
      return {};
    } catch (error) {
      return {
        code: '1',
        message: error,
      };
    }
  }
}
