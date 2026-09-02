const express = require('express');
const app = express();

const PORT = 3000;

const logger = (req, res, next) => {
  console.log(`[Logger] [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);

const timeLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Timer] ${req.method} ${req.url} completed in ${duration}ms`);
  });
  next();
};

app.use(timeLogger);

const customHeaderInjector = (req, res, next) => {
  res.setHeader('X-Custom-Header', 'Hello World!');
  next();
};

app.use(customHeaderInjector);

app.get('/user/:id', (req, res, next) => {
  const id = req.params.id;
  const active = req.query.active;

  const numericId = Number(id);

  if (!id || isNaN(numericId)) {
    const error = new Error('id must be a number');
    error.status = 400;
    return next(error);
  }

  if (active !== 'true' && active !== 'false') {
    const error = new Error('active must be "true" or "false"');
    error.status = 400;
    return next(error);
  }

  return res.json({
    message: `User ${id} is ${active === 'true' ? 'active' : 'not active'}`,
  });
});

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  const timestamp = new Date().toISOString();

  res.status(status).json({
    status,
    message,
    timestamp,
  });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
