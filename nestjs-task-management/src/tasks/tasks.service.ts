import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
//        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
    ) {}

    public getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto, user);
    }

    public async getTaskById(id: string, user: User): Promise<Task> {
        return this.tasksRepository.getTaskById(id, user);
    }        

    public createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto, user);
    }

    public async deleteTask(id: string, user: User): Promise<DeleteResult> {
        return this.tasksRepository.deleteTask(id, user);
    }

    public async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.tasksRepository.getTaskById(id, user);

        task.status = status;
        await this.tasksRepository.save(task);

        return task;
    }

}
