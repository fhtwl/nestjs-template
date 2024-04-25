import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, ValidateNested } from 'class-validator';

export class AppUserListDtoParams {
  @ApiProperty({ required: false })
  name: string;
}

export class AppUserListDto {
  @ApiProperty()
  @IsInt()
  pageSize: number;

  @ApiProperty()
  @IsInt()
  pageNum: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AppUserListDtoParams)
  params: AppUserListDtoParams;
}
