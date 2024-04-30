import {
  Controller,
  // UploadedFile,
  UseInterceptors,
  Post,
  UploadedFiles,
  UsePipes,
} from '@nestjs/common';
import {
  // AnyFilesInterceptor,
  // FileFieldsInterceptor,
  // FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { FileNameEncodePipe } from 'src/common/pipes/file.name.encode.pipe';
import { ApiTags } from '@nestjs/swagger';
import { QiniuService } from 'src/external-services/qiniu.service';
import { MinioService } from 'src/external-services/minio.service';
import configuration from 'src/config/configuration';
// import { ApiTags } from '@nestjs/swagger';

@ApiTags('公共文件上传模块')
@Controller('common/upload')
@UsePipes(new FileNameEncodePipe())
export class UploadController {
  constructor(
    private readonly qiniuService: QiniuService,
    private readonly minioService: MinioService,
  ) {}

  // // 单文件上传
  // @Post('/file')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  // // 单图片上传
  // @Post('/img')
  // @UseInterceptors(FileInterceptor('img'))
  // uploadImg(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  // 文件数组上传
  @Post('/fileList')
  // @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFileList(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      data: await this.qiniuService.uploadList(files),
    };
  }

  // 文件上传
  @Post('/file')
  // @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (configuration().minio.accessKey) {
      return {
        data: await this.minioService.upload(files[0]),
      };
    } else {
      return {
        data: await this.qiniuService.upload(files[0]),
      };
    }
  }

  // // 上传多个文件（全部使用不同的键）
  // @Post('/files')
  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'avatar', maxCount: 1 },
  //     { name: 'background', maxCount: 1 },
  //   ]),
  // )
  // uploadFiles(
  //   @UploadedFiles()
  //   files: {
  //     avatar?: Express.Multer.File[];
  //     background?: Express.Multer.File[];
  //   },
  // ) {
  //   console.log(files);
  // }

  // // 使用任意字段名称键上载所有字段
  // @Post('/allFiles')
  // @UseInterceptors(AnyFilesInterceptor())
  // uploadAllFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   console.log(files);
  // }

  // 文件数组上传
  @Post('/gptFile')
  // @Post('upload')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadGptFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      data: await this.qiniuService.upload(files[0]),
    };
  }
}
