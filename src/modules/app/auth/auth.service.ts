import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserScope } from 'src/constants/common.constants';
import { EmailLoginDto, PhoneCodeLoginDto } from './dto/login.dto';
import { EmailRegisterDto } from './dto/register.dto';
import { ResCodeType } from 'src/common/interceptors/transform-response.interceptor';
import { EditPasswordDto } from './dto/edit.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}
  async phoneLogin(data: PhoneCodeLoginDto) {
    const { phone } = data;
    const user = await this.userRepository.findOne({
      where: {
        phone,
      },
    });
    if (!user) {
      const entity = this.userRepository.create({
        phone,
        name: '用户' + phone,
      });
      try {
        const res = await this.userRepository.save(entity);
        user.id = res.id;
      } catch (error) {
        console.log(error);
      }
      return {
        data: this.getToken(user),
      };
    } else {
      return {
        data: this.getToken(user),
      };
    }
  }

  async emailLogin(data: EmailLoginDto) {
    const { email } = data;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return {
      data: this.getToken(user),
    };
  }
  async emailRegister(data: EmailRegisterDto) {
    const { email, name, password } = data;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      const entity = this.userRepository.create({
        email,
        name,
        password,
      });

      return {
        data: await this.userRepository.save(entity),
      };
    } else {
      return {
        code: '1',
        message: '用户已存在',
      };
    }
  }
  getToken(user: User, scope = UserScope.USER) {
    const payload = {
      uid: user.id,
      scope,
    };
    return this.jwtService.sign(payload);
  }

  async editPassword(data: EditPasswordDto) {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        code: ResCodeType.ERROR,
        message: '用户不存在',
      };
    } else {
      user.password = password;
      return {
        data: await this.userRepository.save(user),
      };
    }
  }
}
