import { ToDoManager } from './todo-manager';

const args = process.argv.slice(2);
const command = args[0];
const firstParam = args[1];
const secondParam = args[2];

async function runCli() {
  const todoManager = new ToDoManager();

  switch (command) {
    case 'init':
      await todoManager.init();
      console.log('Init demo tasks');
      break;
    case 'add':
      if (!firstParam) {
        console.error('Title is required!');
        process.exit(1);
      }
      await todoManager.add(firstParam, secondParam);
      console.log('Successfully added');
      break;
    case 'complete':
      const id = Number(firstParam);
      if (isNaN(id)) {
        console.error('invalid id');
        process.exit(1);
      }
      try {
        await todoManager.complete(id);
        console.log(`Successfully toggled todo status with id ${id}`);
      } catch (error) {
        console.error((error as Error).message);
      }
      break;
    case 'list':
    default:
      const todos = await todoManager.list();
      if (todos.length === 0) {
        console.log('Tasks not found');
        break;
      }
      todos.forEach((t) => {
        console.log(
          `[${id}] (${t.status}) ${t.title} - ${t.description || 'No description'}`
        );
      });
      break;
  }
}

runCli().catch((err) => {
  console.error('UnexpectedError:', (err as Error).message);
  process.exit(1);
});
