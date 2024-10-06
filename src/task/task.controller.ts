import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './DTO';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll() {
    return this.taskService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createTaskDTO: CreateTaskDTO, @Req() req: Request) {
    const userId = req.user;
    console.log(userId);
    console.log('Create Task DTO:', createTaskDTO);
    return this.taskService.create({
      ...createTaskDTO,
      authorId: userId['userId'],
    });
  }
}
