import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import configuration from 'src/config/configuration';

interface MailOptions {
  from?: string; // 发件人
  to: string; // 收件人
  subject: string; // 主题
  text: string; // plain text body
  html: string; // html body
}

@Injectable()
export class EmailService {
  async sendEmail(params: MailOptions): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { user, pass, from } = configuration().email;
      const transporter = nodemailer.createTransport({
        service: 'qq', //使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 456, // SMTP 端口
        auth: {
          user, // 邮箱
          pass, // 这里密码不是邮箱密码，是你设置的smtp授权码
        },
        secureConnection: true, // 使用 SSL
      });
      const mailOptions = {
        from,
        ...params,
      };
      transporter
        .sendMail(mailOptions)
        .then((res: { response: string | string[] }) => {
          if (res.response.indexOf('250') > -1) {
            resolve(true);
          } else {
            reject();
          }
        })
        .catch((error: { message: string }) => {
          reject(error.message);
        });
    });
  }
}
