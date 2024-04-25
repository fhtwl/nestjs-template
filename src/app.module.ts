import {
  Dependencies,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
// import { CatsController } from './modules/cats/cats.controller';
import { AppService } from './app.service';
import { AutoRegisterModule } from './utils/auto-register.util';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/any-exception.filter';
import { RequestValidationPipe } from './common/pipes/validation.pipe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UnderlineStyleNamingStrategy } from './common/strategy/underline-style-naming.strategy';
import configuration from './config/configuration';
import {
  // CacheInterceptor,
  CacheModule,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisClientOptions } from 'redis';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { BullConfigServcice } from './bull/bull-config.service';
// import { MulterModule } from '@nestjs/platform-express';
// import multer from 'multer';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

import { SessionGuard } from './common/guard/session.guard';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { TimestampInterceptor } from './common/interceptors/timestamp.interceptor';
// import { MulterModule } from '@nestjs/platform-express';
import { PostInterceptor } from './common/interceptors/post.interceptor';
import { WebsocketModule } from './modules/websocket/websocket.module';

@Dependencies(DataSource)
@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.development.env'],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configuration().database.host,
      port: configuration().database.port,
      username: configuration().database.username,
      password: configuration().database.password,
      database: configuration().database.name,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      retryAttempts: 10, // 重试连接数据库的次数
      retryDelay: 3000, // 两次重试连接的间隔
      autoLoadEntities: true, // 自动加载实体
      namingStrategy: new UnderlineStyleNamingStrategy(),
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = await configService.get('redis');
        console.log('redisConfig', redisConfig, process.env.NODE_ENV);
        return {
          store: await redisStore({
            socket: {
              host: redisConfig.host,
              port: redisConfig.port,
            },
            password: redisConfig.password,
            database: redisConfig.db,
            ttl: redisConfig.ttl,
          }),
          // host: redisConfig.host,
          // port: redisConfig.port,
          // password: redisConfig.password,
          // database: redisConfig.db,
          ttl: 5,
        };
      },
    }),

    AutoRegisterModule.registerModules({
      path: '../modules',
    }),
    WebsocketModule,
    // AutoRegisterModule.registerControllers({
    //   path: '../modules',
    // }),
    ScheduleModule.forRoot(),
    BullModule.registerQueueAsync({
      name: 'audio', // 队列名称
      imports: [ConfigModule],
      useClass: BullConfigServcice,
    }),
    EventEmitterModule.forRoot(),
    // MulterModule.register({
    //   dest: '/uploads',
    // }),
    // MulterModule.register({
    //   storage: multer.diskStorage({
    //     destination: '/uploads', // 上传文件目录
    //     filename: (req, file, cb) => {
    //       // 生成文件名
    //       const filename = `${Date.now()}-${Math.round(
    //         Math.random() * 1e9,
    //       )}.${file.originalname.split('.').pop()}`;

    //       cb(null, filename);
    //     },
    //   }),
    // }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   // 自动生成schema.graphql文件
    //   autoSchemaFile: 'schema.graph',
    //   // driver: ApolloDriver,
    //   // // playground: false,
    //   // typePaths: ['**/*.graphql'],
    // }),
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   useFactory: () => ({
    //     autoSchemaFile: true,
    //   }),
    // }),
  ],
  controllers: [AppController], // , CatsController
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter, // 对所有的error进行处理
    },

    {
      provide: APP_PIPE,
      useClass: RequestValidationPipe, // 对所有的http请求校验进行处理
    },
    {
      provide: APP_GUARD,
      useClass: SessionGuard, // 添加session
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 全局身份验证
    },

    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor, // get请求缓存
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimestampInterceptor, // http请求返回值拦截处理
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor, // http请求返回值拦截处理
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PostInterceptor,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
