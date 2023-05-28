import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/task.entity';
import { ScheduleModule } from '@nestjs/schedule';
// import { TaskScheduleModule } from './tasks/task-schedule/task-schedule.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'task-management',
      entities: [Task],
      autoLoadEntities: true,
      synchronize: true,
    }),
//    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
