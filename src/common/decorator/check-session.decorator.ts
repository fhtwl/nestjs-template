import { SetMetadata } from '@nestjs/common';

/**
 * 添加名为checkSession的元数据, 当存在改该元数据时，表示需要进行session校验key字段
 * @param key session key
 * @returns
 */
export const CheckSession = (key: string = 'code') => {
  return SetMetadata('checkSession', key);
};
