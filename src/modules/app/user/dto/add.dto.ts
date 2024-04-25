import { OmitType } from '@nestjs/swagger';

import { User } from '../user.entity';

export class AddAppUserDto extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'id',
]) {
  // @ApiProperty()
  // @IsString()
  // @IsPhoneNumber()
  // // @Matches(/^[a-zA-Z0-9]+$/, { message: '用户名只能包含字母和数字' })
  // phone: string;
  // @ApiProperty()
  // @IsString()
  // @Length(4, 255)
  // name: string;
  // @ApiProperty()
  // @IsString()
  // avatar: string;
  // @ApiProperty()
  // @ValidateNested()
  // @Type(() => EditInfoDto)
  // info: EditInfoDto;
}
