import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EmailRegisterDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({
    description: '分享用户id',
  })
  shareUserId: string;
}
