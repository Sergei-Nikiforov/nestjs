import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
//        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
    ) {}

    public getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto);
    }

    public async getTaskById(id: string): Promise<Task> {
        return this.tasksRepository.getTaskById(id);
    }        

    public createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    public async deleteTask(id: string): Promise<DeleteResult> {
        return this.tasksRepository.deleteTask(id);
    }

    public async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.tasksRepository.getTaskById(id);

        task.status = status;
        await this.tasksRepository.save(task);

        return task;
    }

}
