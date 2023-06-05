import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, DeleteResult, FindOneOptions, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
 
  public async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      )
    }

    const tasks = await query.getMany();
    return tasks;
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

  public async deleteTask(id: string): Promise<DeleteResult> {
    const result = await this.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return result;
  }

  public async getTaskById(id: string): Promise<Task> {
    const options: FindOneOptions = {
      where: {
          id,
      }
    }

    const result = await this.findOne(options);

    if (!result) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return result;
  }


  public async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.save(task);
    
    return task;
  }

}