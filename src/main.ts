import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { logger } from './common/middleware/logger.middleware';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
// import * as compression from 'compression';
import session from 'express-session';
// import { redisStore } from 'cache-manager-redis-yet';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import configuration from './config/configuration';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { WsAdapter } from '@nestjs/platform-ws';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import {
  PagingDto,
  PagingResponse,
  PagingResponseDto,
  ResponseDto,
} from './common/dto/paging.dto';

// import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
    cors: true,
    snapshot: configuration().isDev,
  });

  // 通过use全局注册函数式中间件
  // app.use(logger);
  // const configService = app.get(ConfigService)
  // class-validator 的 DTO 类中注入 nest 容器的依赖 (用于自定义验证器)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(helmet());
  // 请求速率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 将每个IP限制为每个窗口100个请求
    }),
  );

  // 注册全局校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // disableErrorMessages: true, // 不会将错误消息返回给最终用户
    }),
  );

  // 启用header版本管理
  app.enableVersioning({
    type: VersioningType.MEDIA_TYPE,
    key: 'v=',
  });

  // 注册全局守卫
  // app.useGlobalGuards(new JwtAuthGuard());

  // 配置cookie全局中间件
  app.use(cookieParser());

  // // 压缩中间件 (使用nginx则不应该使用压缩中间件)
  // app.use(compression);

  // 配置session中间件
  const redisClient = createClient({
    socket: {
      host: configuration().redis.host,
      port: configuration().redis.port,
    },
    password: configuration().redis.password,
    database: configuration().redis.db,
  });
  redisClient.connect().catch(console.error);
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        ttl: configuration().redis.ttl,
      }),
      secret: 'asfs4471jmsd',
      resave: false,
      saveUninitialized: false,
      // cookie: {
      //   maxAge: 1000 * 60 * 60 * 24 * 7,
      // },
    }),
  );

  app.useWebSocketAdapter(new WsAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('衡水快涨分 server')
    .setDescription('nest server API description')
    .setVersion('1.1')
    .addTag('nest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      validatorUrl: null,
      deepScanRoutes: true,
      ignoreGlobalPrefix: false,
      extraModels: [PagingResponse, ResponseDto, PagingDto, PagingResponseDto],
    },
  });
  // 设置全局前缀
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST',
    allowedHeaders: 'Content-Type,Authorization,Referrer Policy',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true,
    maxAge: 3600,
  });
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(configuration().port);
}
bootstrap();
