/* eslint-disable @typescript-eslint/ban-types */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ObjectSchema } from 'joi';

// type Fun = (...args: unknown[]) => unknown;

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('JoiValidationPipe', value, metadata);
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}

@Injectable()
export class RequestValidationPipe implements PipeTransform {
  async transform(value: any, { metatype, data }: ArgumentMetadata) {
    console.log(data);
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const error = await validate(object);
    if (error.length > 0) {
      throw new BadRequestException(
        error.map((item) => item.toString()).join(';'),
      );
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
