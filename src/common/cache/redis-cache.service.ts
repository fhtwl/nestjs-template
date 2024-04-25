import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  set(key: string, value: unknown, ttl: number = 5) {
    try {
      this.cacheManager.set(key, value, ttl);
    } catch (error) {
      console.log(error);
    }
  }

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  async del(key: string) {
    return this.cacheManager.del(key);
  }
}
