import { SetMetadata } from '@nestjs/common';
import { UserScope } from 'src/constants/common.constants';

/**
 * 角色装饰器. 用户设置不同接口的角色 , 高等级角色可以访问低等级角色的接口
 * @param roles 角色
 * @returns
 */
export const Roles = (...roles: UserScope[]) => SetMetadata('roles', roles);
