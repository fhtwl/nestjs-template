import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PhoneCodeLoginDto {
  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class EmailLoginDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}
