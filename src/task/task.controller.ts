import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './DTO';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll() {
    return this.taskService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTaskDTO: CreateTaskDTO, @Req() req) {
    const userId = req.user?.userId;
    this.taskService.create({ ...createTaskDTO, authorId: userId });
  }
}
