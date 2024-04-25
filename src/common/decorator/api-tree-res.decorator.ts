import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

// const baseTypeNames = ['String', 'Number', 'Boolean'];

/**
 * @description: tree返回结果装饰器
 */
export const ApiTreeRes = <TModel extends Type<any>>(
  type?: TModel | TModel[],
) => {
  const children = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number', default: 0 },
        name: { type: 'string', default: '' },
        // treeObj: { $ref: getSchemaPath(type as unknown as string) },
      },
    },
  };

  const resProps = {
    type: 'object',
    properties: {
      id: { type: 'number', default: 0 },
      name: { type: 'string', default: '' },
      treeObj: { $ref: getSchemaPath(type as unknown as string) },
      children,
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
