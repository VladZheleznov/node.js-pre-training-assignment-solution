import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) {}

  async create(title: string, description = ''): Promise<Todo> {
    if (!title || typeof title !== 'string') {
      throw new Error('Todo title must be a non-empty string');
    }
    const newTodo = await this.api.add({
      title,
      description,
      status: TodoStatus.PENDING,
    });
    return newTodo;
  }

  async toggleStatus(id: number): Promise<Todo> {
    if (typeof id !== 'number' || id <= 0) {
      throw new Error('Todo id must be a positive number');
    }
    const todos = await this.api.getAll();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      throw new Error('Todo not found');
    }
    const newStatusMap: Record<TodoStatus, TodoStatus> = {
      [TodoStatus.PENDING]: TodoStatus.IN_PROGRESS,
      [TodoStatus.IN_PROGRESS]: TodoStatus.COMPLETED,
      [TodoStatus.COMPLETED]: TodoStatus.PENDING,
    };
    const newStatus = newStatusMap[todo.status || TodoStatus.PENDING];
    const updatedTodo = await this.api.update(id, { ...todo, status: newStatus });
    return updatedTodo;
  }

  async search(keyword: string): Promise<Todo[]> {
    if (!keyword || typeof keyword !== 'string') {
      throw new Error('Search keyword must be a non-empty string');
    }
    keyword = keyword.toLowerCase();
    const todos = await this.api.getAll();
    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(keyword) ||
        todo.description?.toLowerCase().includes(keyword)
    );
  }
}
