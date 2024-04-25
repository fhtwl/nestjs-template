import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class EmailDto {
  @ApiProperty({
    description: '邮箱',
  })
  @IsString()
  @IsEmail()
  // @Matches(/^[1-9]\d{4,10}@qq\.com$/, {
  //   message: 'Invalid email format for QQ',
  // })
  // @Matches(/^(\w)+(\.\w+)*@163\.com$/, {
  //   message: 'Invalid email format for 163',
  // })
  // @Matches(/^[\w-]+(\.[\w-]+)*@gmail\.com$/, {
  //   message: 'Invalid email format for Gmail',
  // })
  @Matches(/@(qq|163|gmail|139)\.com$/, { message: 'Invalid email domain' })
  email: string;
}
