import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, DeleteResult, FindOneOptions, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', {timestamp: true});

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
 
  public async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      )
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user "${user.username}". Filter ${JSON.stringify(filterDto)}`, error.stack);
    }
  }

  public async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
 
    await this.save(task);
    return task;
  }

  public async deleteTask(id: string, user: User): Promise<DeleteResult> {
    const result = await this.delete({ id, user });

    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return result;
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const options: FindOneOptions = {
      where: {
          id,
          user,
      }
    }

    const result = await this.findOne(options);

    if (!result) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return result;
  }


  public async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.save(task);
    
    return task;
  }

}