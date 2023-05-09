import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    public getAllTasks(): Task[] {
        return this.tasks;
    }

    public getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
        const { status, search} = filterDto;
        let tasks = this.getAllTasks();
        
        if (status) {
            tasks = tasks.filter(tasks => tasks.status === status);
        }

        if (search) {
            tasks = tasks.filter(task => {
                if (task.title.includes(search) || task.description.includes(search)) {
                    return true;
                }

                return false;
            })
        }

        if (!tasks.length) {
            throw new NotFoundException(`Tasks not found!"`);
        }

        return tasks;
    }

    public getTaskById(id: string): Task {
        const found = this.tasks.find((task) => task.id === id);

        if (!found) {
            throw new NotFoundException(`Task with ID "${id} not found!"`);
        }

        return found;
    }

    public deleteTask(id: string): void {
        this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    public updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    public createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);
        return task;
    }
}
