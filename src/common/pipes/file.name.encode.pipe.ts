import { PipeTransform, Injectable } from '@nestjs/common';

/**
 * 用户修复文件上传时, 文件名是中文会乱码的bug
 * 目前仅用户文件上传模块
 */
@Injectable()
export class FileNameEncodePipe implements PipeTransform {
  transform(value: Express.Multer.File[]) {
    return value.map((item) => {
      if (!/[^\u0000-\u00ff]/.test(item.originalname)) {
        item.originalname = Buffer.from(item.originalname, 'latin1').toString(
          'utf8',
        );
      }
      return item;
    });
  }
}
