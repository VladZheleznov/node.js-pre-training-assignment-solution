import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from '../dto/create-todo.dto.js';
import { UpdateTodoDto } from '../dto/update-todo.dto.js';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private nextId: number = 1;

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  create(createTodoDto: CreateTodoDto): Todo {
    const newTodo = {
      id: this.nextId++,
      ...createTodoDto,
      completed: false,
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const todo = this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return todo;
  }

  remove(id: number): Todo {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    const deletedTodo = this.todos.splice(index, 1)[0];
    return deletedTodo;
  }
}
