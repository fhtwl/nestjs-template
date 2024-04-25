import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { AppUserListDto } from './dto/list.dto';
import { PagingResponse } from 'src/constants/common.constants';
import { EditAppUserDto } from './dto/edit.dto';
import { EditAppUserInfoDto } from './dto/edit-info.dto';
import { AddAppUserDto } from './dto/add.dto';

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll(params: AppUserListDto): Promise<PagingResponse<User>> {
    // this.cacheManager.set('key', 1);
    // console.log(
    //   this.configService.get('DATABASE_HOST'),
    //   this.configService.get('database.host'),
    //   await this.cacheManager.get('key'),
    //   await this.userRepository.findAndCount({
    //     where: {
    //       ...params.params,
    //     },
    //   }),
    // );
    const [items, total] = await this.userRepository.findAndCount({
      where: {
        ...params.params,
      },
    });
    const { pageSize, pageNum } = params;
    return {
      records: items,
      total,
      pageSize,
      current: pageNum,
      pages: Math.ceil(total / pageSize),
    };
    // return await this.userRepository
    //   // .createQueryBuilder()
    //   // .where({ deleted: 0 })
    //   // .select(['user_name', 'email'])
    //   // .getMany();
    //   .find();
  }
  getUserDetail(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async updateInfo(id: number, info: EditAppUserInfoDto) {
    const { name, avatar } = info;
    return this.userRepository
      .createQueryBuilder()
      .update('user')
      .set({
        name,
        avatar,
      })
      .where('id = :id', { id })
      .execute();
  }

  async update(user: EditAppUserDto): Promise<User> {
    return this.userRepository.save({
      ...user,
    });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async createMany(users: User[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(users[0]);
      await queryRunner.manager.save(users[1]);
      await queryRunner.commitTransaction();
    } catch (error) {
      // 如果遇到错误可以回滚事务
      await queryRunner.rollbackTransaction();
    } finally {
      //  手动实例化并部署一个queryRunner
      await queryRunner.release();
    }
  }

  async createUser(user: AddAppUserDto) {
    return this.userRepository.create({
      ...user,
    });
  }
}
