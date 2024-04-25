import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { QiniuService } from 'src/external-services/qiniu.service';
// import { MulterModule } from '@nestjs/platform-express';
// import { QiniuMulterConfigService } from './qiniu.multer.config.service';

@Module({
  imports: [
    // MulterModule.registerAsync({
    //   useClass: QiniuMulterConfigService,
    // }),
  ],
  providers: [QiniuService],
  controllers: [UploadController],
})
export default class UploadModule {}
