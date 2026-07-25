import { InMemoryRepository } from '../JS-TS/solutions/repository';
import { TodoApi } from '../JS-TS/solutions/todo-api';
import { TodoService } from '../JS-TS/solutions/todo-service';
import { Todo, TodoStatus } from '../JS-TS/solutions/types';

describe('TodoService', () => {
  let todoService: TodoService;
  let mockApi: jest.Mocked<TodoApi>;

  beforeEach(() => {
    jest.useFakeTimers();

    mockApi = {
      add: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<TodoApi>;

    todoService = new TodoService(mockApi);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a todo', async () => {
      const mockTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
      };
      mockApi.add.mockResolvedValue(mockTodo);

      const promise = todoService.create('Test Todo', 'Test Description');
      jest.runAllTimers();

      const result = await promise;

      expect(mockApi.add).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
        status: TodoStatus.PENDING,
      });
      expect(result).toEqual(mockTodo);
    });
    it('should throw an error if title is empty or not a string', async () => {
      await expect(todoService.create('')).rejects.toThrow(
        'Todo title must be a non-empty string'
      );
      await expect(todoService.create(123 as unknown as string)).rejects.toThrow(
        'Todo title must be a non-empty string'
      );
    });
  });

  describe('toggleStatus', () => {
    it('should successfully toggle the status of a todo', async () => {
      const baseTodo: Todo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
      };
      // 1. PENDING -> IN_PROGRESS
      mockApi.getAll.mockResolvedValueOnce([{ ...baseTodo, status: TodoStatus.PENDING }]);
      mockApi.update.mockResolvedValueOnce({
        ...baseTodo,
        status: TodoStatus.IN_PROGRESS,
      });

      let promise = todoService.toggleStatus(1);
      jest.runAllTimers();
      let result = await promise;
      expect(result.status).toEqual(TodoStatus.IN_PROGRESS);

      // 2. IN_PROGRESS -> COMPLETED
      mockApi.getAll.mockResolvedValueOnce([
        { ...baseTodo, status: TodoStatus.IN_PROGRESS },
      ]);
      mockApi.update.mockResolvedValueOnce({ ...baseTodo, status: TodoStatus.COMPLETED });

      promise = todoService.toggleStatus(1);
      jest.runAllTimers();
      result = await promise;
      expect(result.status).toEqual(TodoStatus.COMPLETED);

      // 3. COMPLETED -> PENDING
      mockApi.getAll.mockResolvedValueOnce([
        { ...baseTodo, status: TodoStatus.COMPLETED },
      ]);
      mockApi.update.mockResolvedValueOnce({ ...baseTodo, status: TodoStatus.PENDING });

      promise = todoService.toggleStatus(1);
      jest.runAllTimers();
      result = await promise;
      expect(result.status).toEqual(TodoStatus.PENDING);
    });
    it('should throw an error for invalid id types or values', async () => {
      await expect(todoService.toggleStatus(0)).rejects.toThrow(
        'Todo id must be a positive number'
      );
      await expect(todoService.toggleStatus(-5)).rejects.toThrow(
        'Todo id must be a positive number'
      );
      await expect(todoService.toggleStatus('1' as unknown as number)).rejects.toThrow(
        'Todo id must be a positive number'
      );
    });

    it('should throw an error if todo is not found', async () => {
      mockApi.getAll.mockResolvedValueOnce([]);

      const promise = todoService.toggleStatus(123);
      jest.runAllTimers();

      await expect(promise).rejects.toThrow('Todo not found');
    });
  });

  describe('search', () => {
    const mockTodos: Todo[] = [
      {
        id: 1,
        title: 'The first test with id 1',
        description: 'Test description',
        status: TodoStatus.PENDING,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: 'The second test with id 2',
        description: 'Unknown description',
        status: TodoStatus.IN_PROGRESS,
        createdAt: new Date(),
      },
    ];

    it('should return matching items based on keyword (title or description, case-insensitive)', async () => {
      mockApi.getAll.mockResolvedValueOnce(mockTodos);

      const promise1 = todoService.search('first');
      jest.runAllTimers();
      const result1 = await promise1;
      expect(result1).toHaveLength(1);
      expect(result1[0].id).toBe(1);

      mockApi.getAll.mockResolvedValueOnce(mockTodos);
      const promise2 = todoService.search('unknown');
      jest.runAllTimers();
      const result2 = await promise2;
      expect(result2).toHaveLength(1);
      expect(result2[0].id).toBe(2);
    });

    it('should throw an error if keyword is empty or not a string', async () => {
      await expect(todoService.search('')).rejects.toThrow(
        'Search keyword must be a non-empty string'
      );
      await expect(todoService.search(undefined as unknown as string)).rejects.toThrow(
        'Search keyword must be a non-empty string'
      );
    });
  });
});

// for repository

interface TestItems {
  id: number;
  name: string;
  value?: number;
}

describe('InMemoryRepository', () => {
  let repository: InMemoryRepository<TestItems>;

  beforeEach(() => {
    repository = new InMemoryRepository<TestItems>();
  });

  describe('add', () => {
    it('should add an item and return it', () => {
      const item: TestItems = { id: 1, name: 'Item 1' };

      const result = repository.add(item);

      expect(result).toEqual(item);
      expect(repository.findAll()).toHaveLength(1);
      expect(repository.findAll()[0]).toEqual(item);
    });
  });

  describe('findAll', () => {
    it('should return all items', () => {
      const item1: TestItems = { id: 1, name: 'Item 1' };
      const item2: TestItems = { id: 2, name: 'Item 2' };

      repository.add(item1);
      repository.add(item2);

      expect(repository.findAll()).toHaveLength(2);
      expect(repository.findAll()[0]).toEqual(item1);
    });
  });

  describe('findById', () => {
    it('should find an item by its id', () => {
      const item1: TestItems = { id: 1, name: 'Item 1' };
      const item2: TestItems = { id: 2, name: 'Item 2' };
      repository.add(item1);
      repository.add(item2);

      const found = repository.findById(2);

      expect(found).toEqual(item2);
    });

    it('should return undefined if item with id does not exist', () => {
      const found = repository.findById(123);

      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update an existing item with patch and return it', () => {
      const item: TestItems = { id: 1, name: 'Item 1', value: 10 };
      repository.add(item);

      const updated = repository.update(1, { name: 'Updated Name', value: 20 });

      expect(updated).toEqual({ id: 1, name: 'Updated Name', value: 20 });
      expect(repository.findById(1)).toEqual({ id: 1, name: 'Updated Name', value: 20 });
    });

    it('should support partial updates (patching only some fields)', () => {
      const item: TestItems = { id: 1, name: 'Item 1', value: 10 };
      repository.add(item);

      const updated = repository.update(1, { name: 'Partial Update' });

      expect(updated).toEqual({ id: 1, name: 'Partial Update', value: 10 });
    });
  });

  describe('remove', () => {
    it('should remove an item by id', () => {
      const item1: TestItems = { id: 1, name: 'Item 1' };
      const item2: TestItems = { id: 2, name: 'Item 2' };
      repository.add(item1);
      repository.add(item2);

      repository.remove(1);

      expect(repository.findAll()).toHaveLength(1);
      expect(repository.findById(1)).toBeUndefined();
      expect(repository.findById(2)).toEqual(item2);
    });

    it('should do nothing if removing non-existing id', () => {
      const item: TestItems = { id: 1, name: 'Item 1' };
      repository.add(item);

      repository.remove(123);

      expect(repository.findAll()).toHaveLength(1);
    });
  });
});
