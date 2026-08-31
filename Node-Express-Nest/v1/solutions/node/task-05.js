/**
 * task-05.js
 * Extend your Task 04 server by adding EventEmitter functionality,
 * logging, analytics, and new endpoints.
 *
 * Implement all TODOs below.
 */

const http = require('http');
const url = require('url');
const { EventEmitter } = require('events');
const { timeStamp, error } = require('console');

// ---------- Utilities ----------

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(data);
}

function parseIdFromPath(pathname) {
  const m = pathname.match(/^\/todos\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function nowISO() {
  return new Date().toISOString();
}

// ---------- Analytics ----------

class AnalyticsTracker {
  constructor() {
    this.stats = {
      totalCreated: 0,
      totalUpdated: 0,
      totalDeleted: 0,
      totalViews: 0,
      errors: 0,
      dailyStats: {},
    };
  }
  _bumpDaily(field) {
    // TODO: implement daily stats tracking
    // - use YYYY-MM-DD date keys
    // - track created, updated, deleted, views per day
    const day = nowISO().split('T')[0];

    if (!this.stats.dailyStats[day]) {
      this.stats.dailyStats[day] = {
        created: 0,
        updated: 0,
        deleted: 0,
        views: 0,
        errors: 0,
      };
    }

    this.stats.dailyStats[day][field]++;
  }

  trackCreated() {
    // TODO: implement tracking logic
    this.stats.totalCreated++;
    this._bumpDaily('created');
  }
  trackUpdated() {
    // TODO: implement tracking logic
    this.stats.totalUpdated++;
    this._bumpDaily('updated');
  }
  trackDeleted() {
    // TODO: implement tracking logic
    this.stats.totalDeleted++;
    this._bumpDaily('deleted');
  }
  trackViewed() {
    // TODO: implement tracking logic
    this.stats.totalViews++;
    this._bumpDaily('views');
  }
  trackError() {
    // TODO: implement tracking logic
    this.stats.errors++;
    this._bumpDaily('errors');
  }
  getStats() {
    // TODO: implement stats retrieval
    return this.stats;
  }
}

// ---------- Console Logger ----------
class ConsoleLogger {
  todoCreated(data) {
    console.log(
      `📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoUpdated(data) {
    console.log(
      `✏️  [${data.timestamp}] Updated ID ${
        data.newTodo.id
      }; changed: ${data.changes.join(', ')}`
    );
  }
  todoDeleted(data) {
    console.log(
      `🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoViewed(data) {
    console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
  }
  todosListed(data) {
    console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
  }
  todoNotFound(data) {
    console.warn(
      `⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`
    );
  }
  validationError(data) {
    console.error(`❌ [${data.timestamp}] Validation error: ${data.errors.join(', ')}`);
  }
  serverError(data) {
    console.error(
      `💥 [${data.timestamp}] Server error in ${data.operation}: ${
        data.error && data.error.message
      }`
    );
  }
}

// ---------- Validation ----------
function validateTodoPayload(payload, isCreate = false) {
  const errors = [];
  const out = {};

  // TODO: implement full validation logic
  // - title: required, non-empty string
  // - description: optional, string
  // - completed: optional, boolean (default false)

  if ('title' in payload) {
    if (typeof payload.title !== 'string' || payload.title.trim() === '') {
      errors.push('Title must be a non-empty string');
    } else {
      out.title = payload.title.trim();
    }
  } else if (isCreate) {
    errors.push('Title is required');
  }

  if ('description' in payload) {
    if (typeof payload.description !== 'string') {
      errors.push('Description must be a string');
    } else {
      out.description = payload.description;
    }
  }

  if ('completed' in payload) {
    if (typeof payload.completed !== 'boolean') {
      errors.push('Completed must be a boolean');
    } else {
      out.completed = payload.completed;
    }
  } else if (isCreate) {
    out.completed = false;
  }

  return { errors, values: out };
}

class TodoServer extends EventEmitter {
  constructor(port = 3000) {
    super();
    this.port = port;
    this.todos = [];
    this.nextId = 1;

    // TODO: initialize analytics tracker
    // TODO: initialize logger
    // TODO: initialize recent events list keeping last 100 events

    this.analytics = new AnalyticsTracker();
    this.logger = new ConsoleLogger();
    this.recentEvents = [];

    this.server = null;

    this._wireDefaultListeners();
  }

  _wireDefaultListeners() {
    const remember = (eventType) => (data) => {
      this.recentEvents.push({ eventType, timestamp: nowISO(), data });
      if (this.recentEvents.length > 100) this.recentEvents.shift();
    };
    // Remember all key events for /events
    [
      'todoCreated',
      'todoUpdated',
      'todoDeleted',
      'todoViewed',
      'todosListed',
      'todoNotFound',
      'validationError',
      'serverError',
    ].forEach((evt) => this.on(evt, remember(evt)));

    // Logging
    this.on('todoCreated', (d) => this.logger.todoCreated(d));
    this.on('todoUpdated', (d) => this.logger.todoUpdated(d));
    this.on('todoDeleted', (d) => this.logger.todoDeleted(d));
    this.on('todoViewed', (d) => this.logger.todoViewed(d));
    this.on('todosListed', (d) => this.logger.todosListed(d));
    this.on('todoNotFound', (d) => this.logger.todoNotFound(d));
    this.on('validationError', (d) => this.logger.validationError(d));
    this.on('serverError', (d) => this.logger.serverError(d));

    // Analytics
    this.on('todoCreated', () => this.analytics.trackCreated());
    this.on('todoUpdated', () => this.analytics.trackUpdated());
    this.on('todoDeleted', () => this.analytics.trackDeleted());
    this.on('todoViewed', () => this.analytics.trackViewed());
    this.on('validationError', () => this.analytics.trackError());
    this.on('serverError', () => this.analytics.trackError());
  }

  _getRequestInfo(req) {
    return {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'] || 'unknown',
      ip: req.socket.remoteAddress || 'unknown',
    };
  }

  /**
   * Start the server
   */
  async start() {
    // TODO: create HTTP server and bind request handler
    // TODO: listen on this.port

    if (this.server) return;

    this.server = http.createServer(this._handleRequest.bind(this));

    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        this.port = this.server.address().port;

        console.log(`Server is running on http://localhost:${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Stop the server
   */
  async stop() {
    // TODO: stop the HTTP server if running
    if (!this.server) return;

    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) return reject(err);
        this.server = null;
        console.log('Server stopped successfully');
        resolve();
      });
    });
  }

  /**
   * Handle incoming requests
   */
  async _handleRequest(req, res) {
    // TODO: implement CORS preflight handling
    // TODO: implement routes:
    // - /todos (GET, POST)
    // - /todos/:id (GET, PUT, DELETE)
    // - /analytics (GET)
    // - /events (GET)
    // TODO: emit events for CRUD, errors, validation, etc.
    // TODO: send JSON responses with proper status codes

    const baseURL = `http://${req.headers.host || 'localhost'}`;
    const parsedUrl = new URL(req.url, baseURL);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const requestInfo = this._getRequestInfo(req);

    try {
      if (pathname === '/analytics' && method === 'GET') {
        return sendJson(res, 200, { success: true, data: this.analytics.getStats() });
      }

      if (pathname === '/events' && method === 'GET') {
        const lastParam = parsedUrl.searchParams.get('last');
        const n = lastParam ? parseInt(lastParam, 10) : 10;
        const events = this.recentEvents.slice(-n);
        return sendJson(res, 200, { success: true, data: events });
      }

      if (pathname === '/todos' && method === 'GET') {
        this.emit('todoListed', {
          timestamp: nowISO(),
          todos: this.todos,
          count: this.todos.length,
          filters: Object.fromEntries(parsedUrl.searchParams),
          requestInfo,
        });
        return sendJson(res, 200, { count: this.todos.length, todos: this.todos });
      }

      if (pathname === '/todos' && method === 'POST') {
        let payload;
        try {
          payload = await parseBody(req);
        } catch (err) {
          this.emit('validationError', {
            timestamp: nowISO(),
            errors: ['Invalid JSON'],
            data: null,
            requestInfo,
          });
          return sendJson(res, 400, { error: 'Invalid JSON' });
        }
        const { errors, values } = validateTodoPayload(payload, true);

        if (errors.length > 0) {
          this.emit('validationError', {
            timeStamp: nowISO(),
            errors,
            data: payload,
            requestInfo,
          });
          return sendJson(res, 400, { errors });
        }

        const newTodo = {
          id: this.nextId++,
          title: values.title,
          description: values.description || '',
          completed: values.completed || false,
          createdAt: nowISO(),
        };

        this.todos.push(newTodo);
        this.emit('todoCreated', {
          timestamp: nowISO(),
          todo: newTodo,
          requestInfo,
        });
        return sendJson(res, 201, { success: true, data: newTodo });
      }

      const todoId = parseIdFromPath(pathname);
      if (todoId !== null) {
        const index = this.todos.findIndex((t) => t.id === todoId);

        if (index === -1) {
          this.emit('todoNotFound', {
            timestamp: nowISO(),
            todoId,
            operation: method,
            requestInfo,
          });
          return sendJson(res, 404, { error: 'Todo not found' });
        }

        const todo = this.todos[index];

        if (method === 'GET') {
          this.emit('todoViewed', {
            timestamp: nowISO(),
            todo,
            requestInfo,
          });
          return sendJson(res, 200, todo);
        }

        if (method === 'PUT') {
          let payload;
          try {
            payload = await parseBody(req);
          } catch (err) {
            this.emit('validationError', {
              timestamp: nowISO(),
              errors: ['Invalid JSON'],
              data: null,
              requestInfo,
            });
            return sendJson(res, 400, { error: 'Invalid JSON' });
          }

          const { errors, values } = validateTodoPayload(payload, false);
          if (errors.length > 0) {
            this.emit('validationError', {
              timestamp: nowISO(),
              errors,
              data: payload,
              requestInfo,
            });
            return sendJson(res, 400, { errors });
          }

          const oldTodo = { ...todo };
          const changes = [];

          for (const key in values) {
            if (todo[key] !== values[key]) {
              changes.push(key);
            }
          }

          Object.assign(todo, values);

          this.emit('todoUpdated', {
            timestamp: nowISO(),
            oldTodo,
            newTodo: todo,
            changes,
            requestInfo,
          });
          return sendJson(res, 200, { success: true, data: todo });
        }

        if (method === 'DELETE') {
          const deletedTodo = this.todos.splice(index, 1)[0];
          this.emit('todoDeleted', {
            timestamp: nowISO(),
            todo: deletedTodo,
            requestInfo,
          });
          return sendJson(res, 200, deletedTodo);
        }
      }
      return sendJson(res, 404, { error: 'Not found' });
    } catch (err) {
      this.emit('serverError', {
        timestamp: nowISO(),
        error: err,
        operation: method,
        requestInfo,
      });
      return sendJson(res, 500, { error: 'Internal Server Error' });
    }
  }
}

module.exports = { TodoServer };
