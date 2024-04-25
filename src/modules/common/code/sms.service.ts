import { Injectable } from '@nestjs/common';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import configuration from 'src/config/configuration';

@Injectable()
export class SmsService {
  // constructor...

  async sendSms(phoneNumbers: string, message: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const params = {
        phoneNumbers,
        signName: '东湖新技术开发区君峰软件',
        templateCode: 'SMS_280065122',
        templateParam: `{"code":"${message}"}`,
      };
      console.log(params);
      const { key, secret } = configuration().sms;
      const client = this.createClient(key, secret);
      const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
        ...params,
      });
      const runtime = new $Util.RuntimeOptions({});
      try {
        // 复制代码运行请自行打印 API 的返回值
        const res = await client.sendSmsWithOptions(sendSmsRequest, runtime);
        console.log(res);
        if (res.statusCode !== 200 || res.body.code !== 'OK') {
          reject(res.body.message);
        }
        resolve(res.body);
      } catch (error) {
        console.log(error);
        // 如有需要，请打印 error
        Util.assertAsString((error as Error).message);
        reject((error as Error).message);
      }
    });
  }

  private createClient(
    accessKeyId: string,
    accessKeySecret: string,
  ): Dysmsapi20170525 {
    const config = new $OpenApi.Config({
      // 必填，您的 AccessKey ID
      accessKeyId: accessKeyId,
      // 必填，您的 AccessKey Secret
      accessKeySecret: accessKeySecret,
    });
    // 访问的域名
    config.endpoint = `dysmsapi.aliyuncs.com`;
    return new Dysmsapi20170525(config);
  }
}
