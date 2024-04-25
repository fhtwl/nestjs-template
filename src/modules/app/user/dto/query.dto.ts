import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AppUserQueryDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
