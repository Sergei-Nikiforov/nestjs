import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
//        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
    ) {}

    // public getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // public getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    //     const { status, search} = filterDto;
    //     let tasks = this.getAllTasks();
        
    //     if (status) {
    //         tasks = tasks.filter(tasks => tasks.status === status);
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task => {
    //             if (task.title.includes(search) || task.description.includes(search)) {
    //                 return true;
    //             }

    //             return false;
    //         })
    //     }

    //     if (!tasks.length) {
    //         throw new NotFoundException(`Tasks not found!"`);
    //     }

    //     return tasks;
    // }

    public async getTaskById(id: string): Promise<Task> {
        const options: FindOneOptions = {
            where: {
                id,
            }
        }
        console.log('options!!', options);
        const found = await this.tasksRepository.findOne(options);

        if (!found) {
            throw new NotFoundException(`Task with ID "${id} not found!"`);
        }

        return found;
    }        

    public createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }


    // public deleteTask(id: string): void {
    //     this.getTaskById(id);
    //     this.tasks = this.tasks.filter(task => task.id !== id);
    // }

    // public updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }

    // public createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     }

    //     this.tasks.push(task);
    //     return task;
    // }
}
