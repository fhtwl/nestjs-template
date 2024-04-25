import { BullOptionsFactory } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';

@Injectable()
export class BullConfigServcice implements BullOptionsFactory {
  createBullOptions() {
    return {
      redis: {
        host: configuration().redis.host,
        port: configuration().redis.port,
        password: configuration().redis.password,
        db: configuration().bull.redis.db,
      },
    };
  }
}
