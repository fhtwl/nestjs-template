import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

// const baseTypeNames = ['String', 'Number', 'Boolean'];

/**
 * @description: 生成返回结果装饰器
 * @param {TModel} type
 * @param {boolean} isPage 是否分页
 * @param {null} data 数据
 */
export const ApiRes = <TModel extends Type<any>>(
  type?: TModel | TModel[],
  isPage?: boolean,
  data?: null,
) => {
  let prop = null;

  if (isPage) {
    prop = {
      type: 'object',
      properties: {
        records: {
          type: 'array',
          items: { $ref: getSchemaPath(type as unknown as string) },
        },
        pages: { type: 'number', default: 0 },
        total: { type: 'number', default: 0 },
        current: { type: 'number', default: 0 },
        pageSize: { type: 'number', default: 0 },
      },
    };
  } else {
    if (type) {
      prop = { $ref: getSchemaPath(type as unknown as string) };
    } else {
      prop = data;
    }
  }

  const resProps = {
    type: 'object',
    properties: {
      code: { type: 'string', default: '0' },
      msg: { type: 'string', default: 'ok' },
      data: prop,
    },
  };

  return applyDecorators(
    ApiExtraModels(type ? (Array.isArray(type) ? type[0] : type) : String),
    ApiResponse({
      schema: {
        allOf: [resProps],
      },
    }),
  );
};

export const ApiStringRes = () => {
  const resProps = {
    type: 'object',
    properties: {
      code: { type: 'string', default: '0' },
      msg: { type: 'string', default: 'ok' },
      data: { type: 'string', default: '' },
    },
  };

  return applyDecorators(
    ApiResponse({
      schema: {
        allOf: [resProps],
      },
    }),
  );
};
