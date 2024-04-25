import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * 转换响应拦截器, 自定义响应格式
 */
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (
          !(data instanceof Error) &&
          typeof data === 'object' &&
          !(data instanceof StreamableFile)
        ) {
          const code = data.code || ResCodeType.SUCCESS;
          return {
            code,
            data: data.data,
            // 首选使用传递的message, 不传正常默认success, 异常默认操作失败
            msg: data.message
              ? data.message
              : code === ResCodeType.SUCCESS
              ? 'success'
              : '操作失败',
          };
        } else {
          return data;
        }
      }),
    );
  }
}

/**
 * 响应值code类型
 */
export enum ResCodeType {
  /**
   * 正常
   */
  SUCCESS = '0',
  /**
   * 操作失败
   */
  ERROR = '1',
}
