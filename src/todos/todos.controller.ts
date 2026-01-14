import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@ApiTags('Todos')
@ApiBearerAuth('bearer')
@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodosController {
  constructor(private todos: TodosService) {}

  @Post()
  create(@Req() req: any, @Body() body: CreateTodoDto) {
    return this.todos.create(req.user.id, body);
  }

  // Pagination: /todos?page=1&limit=10
  @Get()
  findMyTodos(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.todos.findMyTodos(
      req.user.id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: UpdateTodoDto) {
    return this.todos.update(req.user.id, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.todos.remove(req.user.id, id);
  }
}
