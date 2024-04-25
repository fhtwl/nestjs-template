import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * post请求拦截, 修复nestjs默认post请求成功状态是201的bug
 */
@Injectable()
export class PostInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.method === 'POST') {
      if (context.switchToHttp().getResponse().statusCode === 201) {
        context.switchToHttp().getResponse().status(200);
      }
    }
    return next.handle();
  }
}
