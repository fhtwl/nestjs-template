## 目录结构

```
├── package.json
├── README.md
├── src
│   │   └── constants（全局常量定义）
│   │       ├──common.constants.ts
│   │   └── utils（常用工具类）
│   │       ├──http.util.ts
│   │       └──file.util.ts
│   ├── app.module.ts（模块配置文件）
│   ├── common （通用模块，包含自定义装饰器、过滤器、守卫、拦截器、中间件）
│   │   ├── decorators （项目通用装饰器）
│   │   ├── filters （过滤器）
│   │   ├── guards （守卫）
│   │   ├── interceptors （拦截器）
│
│   │   ├── middleware （中间件）
│   │   └── pipes （管道，主要用于数据验证和类型转换）
│   ├── config （配置文件信息）
│   │   ├── database.ts
│   │   ├── redis.ts
│   ├── jobs （高并发场景下队列处理）
│   ├── main.ts （入口文件）
│   ├── modules （业务代码，按目录区分模块）
│   ├── tasks （定时任务）
│   │   ├── tasks.module.ts
│   │   └── tasks.service.ts
│   └── external-services （外部服务）
├── test （单元测试）
│   ├── app.e2e-spec.ts
├── tsconfig.json

```

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
