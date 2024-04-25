import { Injectable } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Injectable()
export class AuthRedisCacheService extends RedisCacheService {}
