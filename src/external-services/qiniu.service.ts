import { Injectable } from '@nestjs/common';
// import { join } from 'path';
import qiniu from 'qiniu';
// import formidable from 'formidable';
import configuration from 'src/config/configuration';
export interface RespBody {
  key: string;
  hash: string;
  size: number;
  bucket: string;
  mimeType: string;
  name: string;
  oldName: string;
}

const { accessKey, secretKey, bucket } = configuration().qiniu;

const putPolicy = new qiniu.rs.PutPolicy({
  scope: bucket,
  // 上传成功后返回数据键值对参数设置
  returnBody:
    '{"key":"$(key)","hash":"$(etag)","size":$(fsize),"bucket":"$(bucket)", "mimeType":"$(mimeType)"}',
});

@Injectable()
export class QiniuService {
  // async uploadImg(file: Express.Multer.File) {
  //   const date = new Date();
  //   const suffixName = file.mimetype?.split('/')[1];
  //   const fileName = `${date.getTime()}-${Math.floor(
  //     Math.random() * 100000,
  //   )}.${suffixName}`;
  //   // const path = join(`${Config.UPLOAD_DIR}`, fileName);
  //   // await fsExtra.move(file.filepath, path);
  //   // return {
  //   //   path: `${Config.UPLOAD.PATH}/${fileName}`,
  //   //   name: fileName,
  //   //   mimetype: file.mimetype,
  //   //   size: file.size,
  //   // };
  // }
  updateToken() {
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    return putPolicy.uploadToken(mac);
  }
  upload(file: Express.Multer.File): Promise<RespBody[]> {
    return new Promise((resolve, reject) => {
      const config: qiniu.conf.Config = new qiniu.conf.Config({
        useHttpsDomain: true, // 是否使用https域名
        useCdnDomain: true, // 上传是否使用cdn加速
      });
      const formUploader = new qiniu.form_up.FormUploader(config); //  生成表单上传的类
      const name = `${Date.now()}-${file.originalname}`;
      const putExtra = new qiniu.form_up.PutExtra(); //  生成表单提交额外参数
      formUploader.put(
        this.updateToken(),
        `uploads/${name}`,
        file.buffer,
        putExtra,
        function (respErr, respBody, respInfo) {
          if (respErr) {
            console.error(respErr);
            reject(respErr);
            // throw new InternalServerErrorException(respErr.message);
          }

          if (respInfo.statusCode == 200) {
            // _res({
            //   url: new url.URL(respBody.key, process.env.qn_host).href,
            // });
            resolve([
              {
                ...respBody,
                key: `/uploads/${name}`,
                name,
                oldName: file.originalname,
              },
            ]);
          } else {
            console.error(respInfo.statusCode, respBody);
            reject(respErr);
            // throw new InternalServerErrorException(respInfo);
          }
        },
      );
    });
  }

  uploadList(files: Express.Multer.File[]): Promise<RespBody[]> {
    return new Promise((resolve, reject) => {
      Promise.all(files.map((item) => this.upload(item)))
        .then((res) => {
          const list: RespBody[] = [];
          res.map((item) => {
            list.push(...item);
          });
          resolve(list);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
