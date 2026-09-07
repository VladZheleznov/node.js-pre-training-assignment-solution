const express = require('express');
const todoService = require('./todoService');

const app = express();

const PORT = 4000;

app.use(express.json());

const metrics = {
  totalRequests: 0,
  totalResponseTime: 0,
  statusCount: {},
};

app.use((req, res, next) => {
  if (req.url === '/metrics') {
    return next();
  }

  metrics.totalRequests++;

  const start = Date.now();

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.totalResponseTime += duration;

    const status = res.statusCode;
    metrics.statusCount[status] = (metrics.statusCount[status] || 0) + 1;
  });
  next();
});

const validateTodoTitle = (req, res, next) => {
  const title = req.body.title;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'title is required and must be a non-empty string',
    });
  }
  next();
};

const validateTodoDescription = (req, res, next) => {
  const description = req.body.description;

  if (description === undefined) return next();

  if (typeof description !== 'string') {
    return res.status(400).json({
      error: 'description must be a string',
    });
  }

  if (description.length > 500) {
    return res.status(400).json({
      error: 'description must be no more than 500 characters',
    });
  }

  next();
};

app.get('/todos', (req, res) => {
  res.json(todoService.getAll());
});

app.get('/todos/:id', (req, res) => {
  const todo = todoService.getById(req.params.id);

  if (!todo) {
    return res.status(404).json({
      error: 'Todo not found',
    });
  }

  res.json(todo);
});

app.post('/todos', validateTodoTitle, validateTodoDescription, (req, res) => {
  const { title, description } = req.body;

  const newTodo = todoService.create(title, description);

  res.status(201).json(newTodo);
});

app.put('/todos/:id', validateTodoTitle, validateTodoDescription, (req, res) => {
  const updatedTodo = todoService.update(req.params.id, req.body);
  if (!updatedTodo) {
    return res.status(404).json({
      error: 'Todo not found',
    });
  }
  res.json(updatedTodo);
});

app.delete('/todos/:id', (req, res) => {
  const success = todoService.delete(req.params.id);

  if (!success) {
    return res.status(404).json({
      error: 'Todo not found',
    });
  }

  res.status(204).send();
});

app.get('/metrics', (req, res) => {
  const averageResponseTime =
    metrics.totalRequests > 0
      ? (metrics.totalResponseTime / metrics.totalRequests).toFixed(2)
      : 0;

  res.json({
    totalRequests: metrics.totalRequests,
    averageResponseTime: Number(averageResponseTime),
    statusCodes: metrics.statusCount,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
