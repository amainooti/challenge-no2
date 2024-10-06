import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDTO } from './DTO';
import { updateTask } from './types';

@Injectable()
export class TaskService {
  constructor(readonly prisma: PrismaService) {}
  async getAll(status?: boolean) {
    try {
      const tasks = await this.prisma.task.findMany({
        where: status !== undefined ? { status } : {},
      });
      if (!tasks || tasks.length === 0)
        throw new Error('No Tasks found, try creating a task');

      return tasks;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong, Please try again later.',
      );
    }
  }

  async create(createTaskDTO: CreateTaskDTO & { authorId: number }) {
    try {
      const task = await this.prisma.task.create({
        data: {
          title: createTaskDTO.title,
          content: createTaskDTO.content,
          status: createTaskDTO.status,
          author: {
            connect: { id: createTaskDTO.authorId },
          },
        },
      });
      return { message: 'Task created Succesfully', payload: task };
    } catch (error) {
      console.error('Error creating task:', error);

      throw new InternalServerErrorException(
        'Something happened try again later.',
      );
    }
  }

  async getTask(id: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });
    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  async updateTask(id: number, body: updateTask) {
    try {
      const existTask = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!existTask) throw new NotFoundException('Task does not exist');

      const updateExistingTask = await this.prisma.task.update({
        where: { id: existTask.id },
        data: {
          ...body,
        },
      });

      return {
        message: 'Task Updated Successfully',
        updateExistingTask,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong while updating the task.',
      );
    }
  }

  async deleteTask(id: number) {
    this.prisma.task.delete({
      where: { id },
    });

    return {
      message: `Task with ID:${id} deleted successfully.`,
    };
  }
}
