import { AppDataSource } from '../../data-source';
import { Todo } from './entities/todo.entity';

async function createTodo(
  title: string,
  description: string,
  userId: number,
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
}

async function getTodos(status: string = 'active') {
  const todoRepository = AppDataSource.getRepository(Todo);

  const allTodos = await todoRepository.find({
    relations: {
      user: true,
    },
  });
  console.log('Todos: ', allTodos);

  const filteredTodos = await todoRepository.find({
    where: {
      status,
    },
    relations: {
      user: true,
    },
  });
  console.log('Filtered todos: ', filteredTodos);
}

async function updateTodo(todoId: number, updateData: Partial<Todo>) {
  const todoRepository = AppDataSource.getRepository(Todo);

  const todo = await todoRepository.findOneBy({ id: todoId });

  if (!todo) {
    throw new Error(`Todo with id ${todoId} not found`);
  }

  Object.assign(todo, updateData);

  await todoRepository.save(todo);

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

  await createTodo('newTodo example', 'something about new todo', 1);
  await getTodos();
  await updateTodo(9, {
    status: 'completed',
    description: 'The todo has been successfully completed!',
  });
  await removeTodo(2);

  await AppDataSource.destroy();
}

startDb();
