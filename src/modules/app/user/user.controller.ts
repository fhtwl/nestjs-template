import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AppUserService } from './user.service';
import { AppUserListDto } from './dto/list.dto';
// import { EditDto } from './dto/edit.dto';
// import { EditInfoDto } from './dto/edit-info.dto';
// import { AddDto } from './dto/add.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppUserQueryDto } from './dto/query.dto';
import { User } from './user.entity';
import { ApiRes } from 'src/common/decorator/api-res.decorator';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserScope } from 'src/constants/common.constants';
import { EditAppUserInfoDto } from './dto/edit-info.dto';

@ApiTags('app用户管理模块')
@Controller('app/user')
export class AppUserController {
  constructor(private readonly userService: AppUserService) {}

  @Post('/list')
  @ApiRes(User, true)
  async findAll(@Body() params: AppUserListDto) {
    return {
      data: await this.userService.findAll(params),
    };
  }

  @Get('/query')
  @ApiRes(User)
  async query(@Query() params: AppUserQueryDto) {
    return {
      data: await this.userService.getUserDetail(params.id),
    };
  }

  @Post('/editInfo')
  @ApiOperation({
    summary: '修改用户信息: 昵称头像等',
  })
  editInfo(@Body() dto: EditAppUserInfoDto, @Req() request) {
    console.log(dto);
    const { uid } = request.auth;
    return this.userService.updateInfo(uid, dto);
  }
  // @Post('/edit')
  // async edit(@Body() user: EditDto) {
  //   return {
  //     data: await this.userService.update(user),
  //   };
  // }

  // @Post('/editInfo')
  // async editInfo(@Req() request, @Body() user: EditInfoDto) {
  //   const { uid } = request.auth;
  //   return {
  //     data: await this.userService.updateInfo(uid, user),
  //   };
  // }

  // @Post('/add')
  // async add(@Body() user: AddDto) {
  //   return {
  //     data: await this.userService.createUser(user),
  //   };
  // }

  @Get('/userInfo')
  @ApiRes(User)
  @Roles(UserScope.USER)
  async userInfo(@Req() request) {
    const { uid } = request.auth;
    return {
      data: await this.userService.getUserDetail(uid),
    };
  }
}
