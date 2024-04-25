import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

// const baseTypeNames = ['String', 'Number', 'Boolean'];

/**
 * @description: 分页接口请求参数装饰器
 */
export const ApiReqPaging = <TModel extends Type<any>>(type?: TModel) => {
  // const prop = {
  //   type: 'object',
  //   items: { $ref: getSchemaPath(type as unknown as string) },
  // };
  console.log(getSchemaPath(type as unknown as string));
  const resProps = {
    type: 'object',
    properties: {
      pageNum: { type: 'number', default: 1 },
      pageSize: { type: 'number', default: 10 },
      params: {
        $ref: getSchemaPath(type as unknown as string),
      },
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
