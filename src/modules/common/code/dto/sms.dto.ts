import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PhoneSmsDto {
  @ApiProperty({
    description: '手机号',
  })
  @IsString()
  phone: string;
}
