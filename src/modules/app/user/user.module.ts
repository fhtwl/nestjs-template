import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AppUserController } from './user.controller';
import { AppUserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AppUserController],
  providers: [AppUserService],
})
export default class RedemptionCodeServiceModule {}
