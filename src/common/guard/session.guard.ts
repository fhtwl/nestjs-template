import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 验证码守卫
 */
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const sessionKey = this.reflector.get<string>(
      'checkSession',
      context.getHandler(),
    );
    // 如果有checkSession装饰器，则需要判断sessionKey
    if (sessionKey) {
      const request = context.switchToHttp().getRequest();
      const sessionValue1 = request.session[sessionKey];
      const sessionValue2 =
        request.query[sessionKey] || request.body[sessionKey];
      if (sessionValue1 && Number(sessionValue1) === Number(sessionValue2)) {
        return true;
      }
      // throw new Error('验证码错误');
      // return false;
      throw new HttpException('验证码错误', 200);
    } else {
      return true;
    }
  }
}
