import { InMemoryRepository } from './repository';
import { Todo, NewTodo } from './types';

export class TodoNotFoundError extends Error {
  constructor(id: number) {
    super(`Todo with id ${id} not found`);
  }
}

export class TodoApi {
  private repo = new InMemoryRepository<Todo>();

  async getAll(): Promise<Todo[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.repo.findAll();
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return this.repo.add({
      ...newTodo,
      id: Date.now(),
      createdAt: new Date(),
    });
  }

  async update(
    id: number,
    update: Partial<Omit<Todo, 'id' | 'createdAt'>>
  ): Promise<Todo> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!this.repo.findById(id)) {
      throw new TodoNotFoundError(id);
    }
    return this.repo.update(id, update);
  }

  async remove(id: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!this.repo.findById(id)) {
      throw new TodoNotFoundError(id);
    }
    this.repo.remove(id);
  }
}
