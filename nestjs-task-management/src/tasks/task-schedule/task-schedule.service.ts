import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskScheduleService {
    private readonly logger = new Logger(TaskScheduleService.name);

    @Cron('30 * * * * *')
    handlCron() {
        console.log('Каждые 30 сек');
        this.logger.debug('Called when the second is 30');
    }
}
