import { DefaultNamingStrategy } from 'typeorm';

/**
 * 将小驼峰转换为下划线
 */
export class UnderlineStyleNamingStrategy extends DefaultNamingStrategy {
  columnName(propertyName: string): string {
    // 将属性转换为 snake_case 进行数据库查询
    const snakeCaseName = this.underscore(propertyName);
    return snakeCaseName;
  }

  private underscore(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  }
}
