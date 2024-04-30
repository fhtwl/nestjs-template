// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export default () => ({
  isDev: process.env.NODE_ENV !== 'development',
  port: process.env.HTTP_PORT || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10),
    ttl:
      process.env.REDIS_TTL.split('*')
        .map((str) => Number(str))
        .reduce((prev: number, curr: number) => {
          return prev * curr;
        }) || 6,
  },
  bull: {
    redis: {
      db: parseInt(process.env.BULL_REDIS_DB, 10),
    },
  },
  jwt: {
    secret: 'wet5ykmu45643)2@#k;a+tm46m.02l,a!',
    expiresIn: 60 * 60 * 24 * 30,
  },
  /**
   * 短信验证码配置
   */
  sms: {
    key: process.env.SMS_KEY,
    secret: process.env.SMS_SECRET,
  },
  qiniu: {
    accessKey: process.env.QINIU_ACCESS_KEY,
    secretKey: process.env.QINIU_SECRET_KEY,
    bucket: process.env.QINIU_BUCKET,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  aiKey: process.env.AI_KEY,
  minio: {
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    bucket: process.env.MINIO_BUCKET,
    endPoint: process.env.MINIO_END_POINT,
    port: Number(process.env.MINIO_PORT) || 9000,
    bucketName: process.env.MINIO_BUCKET_NAME,
  },
});
