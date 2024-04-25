import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EditPasswordDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  code: string;
}
