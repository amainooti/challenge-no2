import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDTO } from './DTO';

@Injectable()
export class TaskService {
  constructor(readonly prisma: PrismaService) {}
  async getAll() {
    try {
      const tasks = await this.prisma.task.findMany({});
      if (!tasks) throw new Error('No Tasks found, try creating a task');
    } catch (error) {
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
      console.error('Error creating task:', error); // Log the error

      throw new InternalServerErrorException(
        'Something happened try again later.',
      );
    }
  }
}
