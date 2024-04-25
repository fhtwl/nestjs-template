import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * 当存在Public装饰器时, 接口是公开的, 不需要权限
 * @returns
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
