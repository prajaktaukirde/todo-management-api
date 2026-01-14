import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(@InjectRepository(Todo) private todosRepo: Repository<Todo>) {}

  async create(userId: string, dto: CreateTodoDto) {
    const todo = this.todosRepo.create({
      userId,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      isCompleted: false,
    });

    const saved = await this.todosRepo.save(todo);
    return saved;
  }

  async findMyTodos(
    userId: string,
    page = 1,
    limit = 10,
  ) {
    // guardrails
    page = Math.max(1, page);
    limit = Math.min(Math.max(1, limit), 50);

    const skip = (page - 1) * limit;

    const [items, total] = await this.todosRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  private async getOwnedTodoOrThrow(userId: string, todoId: string) {
    const todo = await this.todosRepo.findOne({ where: { id: todoId } });

    if (!todo) throw new NotFoundException('Todo not found');
    if (todo.userId !== userId) throw new ForbiddenException('Not allowed');

    return todo;
  }

  async update(userId: string, todoId: string, dto: UpdateTodoDto) {
    const todo = await this.getOwnedTodoOrThrow(userId, todoId);

    if (dto.title !== undefined) todo.title = dto.title.trim();
    if (dto.description !== undefined) todo.description = dto.description?.trim();
    if (dto.isCompleted !== undefined) todo.isCompleted = dto.isCompleted;

    return this.todosRepo.save(todo);
  }

  async remove(userId: string, todoId: string) {
    const todo = await this.getOwnedTodoOrThrow(userId, todoId);
    await this.todosRepo.delete({ id: todo.id });
    return { message: 'Todo deleted' };
  }
}
