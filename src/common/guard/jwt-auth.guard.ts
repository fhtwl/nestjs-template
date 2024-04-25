import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { roleOptioons } from 'src/constants/common.constants';
// import configuration from 'src/config/configuration';

/**
 * jwt 认证守卫
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector, // private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果是公开接口，直接通过
    if (isPublic) {
      return true;
    }

    const routeRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const classRoles = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );
    const role =
      routeRoles?.length > 0
        ? routeRoles[0]
        : classRoles?.length > 0
        ? classRoles[0]
        : undefined;
    const request = context.switchToHttp().getRequest();
    // 通过登录校验后, 将用户角色信息挂载到request上
    request.role = role;
    // return true;
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const request = context.switchToHttp().getRequest();
    // 判断token是否正常
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    // 将解析token的到的用户信息, 挂载到request上
    request.auth = user;
    // 判断角色权限
    if (
      roleOptioons.find((item) => item.label === request.role)?.value <
      user.scope
    ) {
      throw new UnauthorizedException();
    }
    return user;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
