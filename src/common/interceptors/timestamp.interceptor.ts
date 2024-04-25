// timestamp.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
// import dayjs from 'dayjs';
// import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { dateFormat } from 'src/utils/date.util';

function convertDateToString(obj: any): any {
  if (obj instanceof Date) {
    // 如果是 Date 类型，将其转换为字符串
    return dateFormat(obj);
    // return dayjs(obj).format('YYYY-MM-DD HH:mm:ss');
  } else if (Array.isArray(obj)) {
    // 如果是数组，遍历数组的每个元素
    return obj.map((element) => convertDateToString(element));
  } else if (typeof obj === 'object' && obj !== null) {
    // 如果是对象，遍历对象的每个属性
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[key] = convertDateToString(obj[key]);
      }
    }
    return newObj;
  } else {
    // 其他类型直接返回
    return obj;
  }
}

/**
 * 时间戳拦截, 将响应中的时间戳转换为字符串
 */
@Injectable()
export class TimestampInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data.data && typeof data.data === 'object') {
          // Transform timestamp fields in the response
          // const transformedData = Object.fromEntries(
          //   Object.entries(data.data).map(([key, value]) => [
          //     key,
          //     typeof value === 'object' && value instanceof Date
          //       ? dayjs(value).format('YYYY-MM-DD HH:mm:ss')
          //       : value,
          //   ]),
          // );
          // results instanceof Array ? results.map(lineToHumpObject) : results
          // Deserialize the transformed data back to the original class
          const responseClass = context.getClass();
          return plainToClass(responseClass, {
            ...data,
            data: convertDateToString(data.data),
          });
        }
        return data;
      }),
    );
  }
}
