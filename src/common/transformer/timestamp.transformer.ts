import { Expose, Transform, Type } from 'class-transformer';

export class TimestampTransformer {
  @Expose()
  @Transform(({ value }) =>
    value ? value.toISOString().replace('T', ' ').substring(0, 19) : null,
  )
  @Type(() => Date)
  updatedAt: Date;
}
