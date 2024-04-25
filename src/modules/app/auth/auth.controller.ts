import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorator/public.decorator';
import { CheckSession } from 'src/common/decorator/check-session.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiStringRes } from 'src/common/decorator/api-res.decorator';
import { EmailLoginDto, PhoneCodeLoginDto } from './dto/login.dto';
import { EmailRegisterDto } from './dto/register.dto';
import { EditPasswordDto } from './dto/edit.dto';

@ApiTags('app登录模块')
@Controller('/app/auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/phoneLogin')
  @ApiOperation({
    summary: '手机号验证码登录',
  })
  @Public()
  @CheckSession('code')
  phoneLogin(@Body() loginDto: PhoneCodeLoginDto) {
    console.log(loginDto);
    return this.authService.phoneLogin(loginDto);
  }

  @Post('/emailLogin')
  @ApiOperation({
    summary: '邮箱登录',
  })
  @ApiStringRes()
  @Public()
  emailLogin(@Body() loginDto: EmailLoginDto) {
    console.log(loginDto);
    return this.authService.emailLogin(loginDto);
  }

  @Post('/emailRegister')
  @ApiOperation({
    summary: '邮箱注册',
  })
  @Public()
  @CheckSession('code')
  emailRegister(@Body() dto: EmailRegisterDto) {
    console.log(dto);
    return this.authService.emailRegister(dto);
  }

  @Post('/editPassword')
  @ApiOperation({
    summary: '修改密码(邮箱账号)',
  })
  @Public()
  @CheckSession('code')
  editPassword(@Body() dto: EditPasswordDto) {
    console.log(dto);
    return this.authService.editPassword(dto);
  }
}
