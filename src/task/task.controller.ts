import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './DTO';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Request } from 'express';
import { updateTask } from './types';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll(@Query('status', ParseBoolPipe) status?: boolean) {
    return this.taskService.getAll(status);
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

  @Get(':id')
  getTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getTask(id);
  }

  @Put(':id')
  updateTask(@Param('id', ParseIntPipe) id: number, @Body() task: updateTask) {
    return this.taskService.updateTask(id, task);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.deleteTask(id);
  }
}
