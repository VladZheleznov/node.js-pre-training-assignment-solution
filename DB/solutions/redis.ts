import Redis from 'ioredis';
import { AppDataSource } from '../../data-source';
import { Todo } from './entities/todo.entity';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

async function getTodosFromCache(userId: number) {
  const cacheKey = `todos:user:${userId}`;

  const cachedTodos = await redis.get(cacheKey);
  if (cachedTodos) {
    console.log('Todos get from Redis');
    return JSON.parse(cachedTodos);
  }

  console.log('Todos get from postgres');

  const todoRepository = AppDataSource.getRepository(Todo);
  const todos = await todoRepository.find({
    where: { user: { id: userId } },
    relations: { user: true },
  });

  await redis.set(cacheKey, JSON.stringify(todos), 'EX', 300);

  return todos;
}

async function invalidateCache(userId: number) {
  const cacheKey = `todos:user:${userId}`;
  await redis.del(cacheKey);

  console.log(`Cache for user ${userId} successfully cleared.`);
}

async function createTodo(
  userId: number,
  title: string,
  description: string,
  status: string = 'active'
) {
  const todoRepository = AppDataSource.getRepository(Todo);

  const newTodo = todoRepository.create({
    title,
    description,
    status,
    user: { id: userId },
  });

  await todoRepository.save(newTodo);
  console.log('NewTodo created successfully!');

  await invalidateCache(userId);
}

async function updateTodo(todoId: number, userId: number, updateData: Partial<Todo>) {
  const todoRepository = AppDataSource.getRepository(Todo);

  const todo = await todoRepository.findOne({
    where: {
      id: todoId,
      user: { id: userId },
    },
  });

  if (!todo) {
    throw new Error(`Todo with id ${todoId} not found`);
  }

  Object.assign(todo, updateData);

  await todoRepository.save(todo);

  console.log(`Todo with id ${todoId} updated successfully`);
  await invalidateCache(userId);
}

async function removeTodo(todoId: number, userId: number) {
  const todoRepository = AppDataSource.getRepository(Todo);

  const todo = await todoRepository.findOne({
    where: {
      id: todoId,
      user: { id: userId },
    },
  });

  if (!todo) {
    throw new Error(`Todo with id ${todoId} not found`);
  }

  await todoRepository.remove(todo);
  console.log(`Todo with id ${todoId} deleted successfully!`);

  await invalidateCache(userId);
}

async function demonstrateTTL(userId: number) {
  console.log('==Demonstration==');
  const cacheKey = `todos:user:${userId}`;

  const todoRepository = AppDataSource.getRepository(Todo);
  const todos = await todoRepository.find({
    where: { user: { id: userId } },
    relations: { user: true },
  });

  await redis.set(cacheKey, JSON.stringify(todos), 'EX', 10);
  console.log('Set todos to the Redis with TTL = 10s');

  const checkImmediate = await redis.get(cacheKey);
  console.log(checkImmediate ? 'Taken from the cache' : 'empty');

  console.log('waiting 10s...');
  await new Promise((res) => setTimeout(res, 10000));

  const checkLater = await redis.get(cacheKey);
  console.log(checkLater ? 'Taken from the cache' : 'cache miss');
}

async function startRedis() {
  await AppDataSource.initialize();

  await getTodosFromCache(1);
  await createTodo(
    2,
    'newTodo example with cache',
    'something about new todo with cache'
  );
  await updateTodo(7, 1, {
    status: 'completed',
    description: 'The todo has been successfully completed!',
  });
  await removeTodo(1, 1);

  await demonstrateTTL(1);

  await AppDataSource.destroy();
}

startRedis();
