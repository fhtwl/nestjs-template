import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AppUserController } from './user.controller';
import { AppUserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
const { secret, expiresIn } = configuration().jwt;
@Module({
  imports: [
    JwtModule.register({
      secret,
      signOptions: {
        expiresIn,
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppUserController],
  providers: [AppUserService],
})
export default class RedemptionCodeServiceModule {}
