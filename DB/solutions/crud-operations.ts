import { AppDataSource } from '../../data-source';
import { Todo } from './entities/todo.entity';

async function createTodo() {
  const todoRepository = AppDataSource.getRepository(Todo);

  const newTodo = todoRepository.create({
    title: 'newTodo example',
    description: 'something about new todo',
    status: 'active',
    user: { id: 1 },
  });

  await todoRepository.save(newTodo);
  console.log('NewTodo created successfully!');
}

async function getTodos() {
  const todoRepository = AppDataSource.getRepository(Todo);

  const allTodos = await todoRepository.find({
    relations: {
      user: true,
    },
  });
  console.log('Todos: ', allTodos);

  const filteredTodos = await todoRepository.find({
    where: {
      status: 'active',
    },
    relations: {
      user: true,
    },
  });
  console.log('Filtered todos: ', filteredTodos);
}

async function updateTodo(todoId: number) {
  const todoRepository = AppDataSource.getRepository(Todo);

  await todoRepository.update(todoId, {
    status: 'completed',
    description: 'The todo has been successfully completed!',
  });

  console.log(`Todo with id ${todoId} updated successfully`);
}

async function removeTodo(todoId: number) {
  const todoRepository = AppDataSource.getRepository(Todo);

  const todo = await todoRepository.findOneBy({ id: todoId });

  if (!todo) {
    throw new Error(`Todo with id ${todoId} not found`);
  }

  await todoRepository.remove(todo);
  console.log(`Todo with id ${todoId} deleted successfully!`);
}

async function startDb() {
  await AppDataSource.initialize();

  await createTodo();
  await getTodos();
  await updateTodo(1);
  await removeTodo(2);

  await AppDataSource.destroy();
}

startDb();
