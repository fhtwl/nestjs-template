import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly name = 'TasksService';

  // 计时任务
  // @Cron(CronExpression.EVERY_5_SECONDS) // 每5秒执行一次
  @Cron('5 * * * * *') // 当当前秒为5时调用
  handleCron() {
    this.logger.log('Called every 5 seconds');
  }

  // 定时任务
  @Interval(10000) // 每十秒执行一次
  handleInterval() {
    this.logger.debug('每十秒执行1次');
  }

  // 延时任务
  @Timeout('notification', 10000) // 十秒后执行一次
  handleTimeout() {
    this.logger.debug('十秒后执行1次');
  }
}
