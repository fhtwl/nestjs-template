import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import configuration from 'src/config/configuration';
import { FileRes } from './qiniu.service';

@Injectable()
export class MinioService {
  private readonly minioClient: Minio.Client;

  constructor() {
    const { endPoint, port, accessKey, secretKey } = configuration().minio;
    if (accessKey) {
      this.minioClient = new Minio.Client({
        endPoint,
        port,
        accessKey,
        secretKey,
        useSSL: false,
      });
    }
  }

  async upload(file: Express.Multer.File): Promise<FileRes[]> {
    return new Promise(async (resolve, reject) => {
      const { originalname, buffer, size, mimetype } = file;
      const { bucketName } = configuration().minio;
      try {
        const name = `${new Date().getTime()}-${originalname}`;
        const res = await this.minioClient.putObject(bucketName, name, buffer);
        // return `File ${fileName} uploaded successfully`;
        resolve([
          {
            hash: res.etag,
            key: `https://resource.fhtwl.cc/${bucketName}/${name}`,
            name,
            oldName: file.originalname,
            size,
            mimeType: mimetype,
            bucket: bucketName,
          },
        ]);
      } catch (error) {
        // throw new Error(`Failed to upload file: ${error.message}`);
        console.log(error);
        reject(error);
      }
    });
  }
}
