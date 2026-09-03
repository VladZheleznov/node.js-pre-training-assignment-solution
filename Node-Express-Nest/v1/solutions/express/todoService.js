class TodoService {
  constructor() {
    this.todos = [];
    this.nextId = 1;
    this.initializeSampleData();
  }

  initializeSampleData() {
    const sampleTodos = [
      {
        id: this.nextId++,
        title: 'Wire Up ToDo REST API',
        description: 'Use Express to serve the ToDo endpoints',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: this.nextId++,
        title: 'ToDo-Specific Tasks',
        description: 'Import shared todoService logic from Node phase.',
        completed: true,
        createdAt: new Date('2026-08-19T15:30:00').toISOString(),
      },
    ];

    this.todos.push(...sampleTodos);
  }

  getAll() {
    return this.todos;
  }

  getById(id) {
    const numericId = Number(id);

    if (isNaN(numericId)) return null;

    return this.todos.find((t) => t.id === numericId);
  }

  create(title, description = '') {
    const newTodo = {
      id: this.nextId++,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.todos.push(newTodo);
    return newTodo;
  }

  update(id, updates) {
    const todo = this.getById(id);

    if (!todo) return null;

    if (updates.title !== undefined) {
      todo.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      todo.description = updates.description.trim();
    }

    if (updates.completed !== undefined) {
      todo.completed = Boolean(updates.completed);
    }

    return todo;
  }

  delete(id) {
    const index = this.todos.findIndex((t) => t.id === Number(id));
    if (index === -1) return false;

    this.todos.splice(index, 1);
    return true;
  }
}

module.exports = new TodoService();
