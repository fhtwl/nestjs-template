import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

/**
 * 分页参数
 */
export class PagingDto<T = unknown> {
  @ApiProperty()
  @IsInt()
  pageSize: number;

  @ApiProperty()
  @IsInt()
  pageNum: number;

  @ApiProperty()
  params: T;
}

/**
 * 通用返回值
 */
export class ResponseDto<T> {
  @ApiProperty({ description: '状态码' })
  code: string;
  @ApiProperty({ description: '消息' })
  msg: string;
  @ApiProperty()
  data: T;
}

/**
 * 分页data
 */
export class PagingResponse<T> {
  @ApiProperty({ description: '每页条数' })
  @IsInt()
  pageSize: number;

  @ApiProperty({ description: '总条数' })
  @IsInt()
  total: number;

  @ApiProperty({ description: '当前页' })
  @IsInt()
  current: number;

  @ApiProperty({ description: '总页数' })
  @IsInt()
  pages: number;

  @ApiProperty()
  records: T[];
}

/**
 * 分页返回值
 */
export class PagingResponseDto<T> {
  @ApiProperty({ description: '状态码' })
  code: string;

  @ApiProperty({ description: '消息' })
  msg: string;

  @ApiProperty()
  data: PagingResponse<T>;
}

// export class PagingDto {
//   @ApiProperty()
//   @IsInt()
//   pageSize: number;

//   @ApiProperty()
//   @IsInt()
//   pageNum: number;

//   @ApiProperty()
//   params: T;
// }
