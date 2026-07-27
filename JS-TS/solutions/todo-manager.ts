import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { Todo } from './types';
import { InMemoryRepository } from './repository';

export class ToDoManager {
  private repository = new InMemoryRepository<Todo>();
  private api = new TodoApi(this.repository);
  private service = new TodoService(this.api);

  async init(): Promise<void> {
    await this.service.create('Taks 10 todo-manager', 'Build the TodoNanager facade');
    await this.service.create('Demo test number 2', 'some kind of description');
    await this.service.create('One more demo', 'Hello World!');
  }

  async add(title: string, description = ''): Promise<void> {
    await this.service.create(title, description);
  }

  async complete(id: number): Promise<void> {
    await this.service.toggleStatus(id);
  }

  async list(): Promise<Todo[]> {
    return await this.api.getAll();
  }
}
