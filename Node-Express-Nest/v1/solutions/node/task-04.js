const http = require('http');
const { parse } = require('path');
const { title, send } = require('process');
const url = require('url');

/**
 * Todo REST API Server
 * Built with Node.js built-in HTTP module
 * Supports full CRUD operations with in-memory storage
 */

/**
 * Parse JSON request body from HTTP request
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON data
 */
function parseBody(req) {
  // TODO: Implement async JSON body parsing
  // 1. Create promise to handle async data streaming
  // 2. Listen for 'data' events to collect chunks
  // 3. Listen for 'end' event to parse complete body
  // 4. Handle JSON parsing errors gracefully
  // 5. Return empty object if no body provided

  return new Promise((resolve, reject) => {
    let body = '';

    // Implementation goes here
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      if (!body || !body.trim()) {
        resolve({});
        return;
      }
      try {
        const parsedData = JSON.parse(body);
        resolve(parsedData);
      } catch (error) {
        reject(new Error(`Invalid JSON: ${error.message}`));
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Extract path parameters from URL pattern
 * @param {string} pattern - URL pattern like '/todos/:id'
 * @param {string} path - Actual path like '/todos/123'
 * @returns {Object} Extracted parameters like { id: "123" }
 */
function parsePathParams(pattern, path) {
  // TODO: Implement path parameter extraction
  // 1. Split pattern and path by '/'
  // 2. Find segments that start with ':'
  // 3. Extract corresponding values from path
  // 4. Return object with parameter names and values
  // 5. Handle edge cases (no params, mismatched segments)

  const params = {};

  // Implementation goes here
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = path.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return params;
  }

  patternSegments.forEach((segment, index) => {
    if (segment.startsWith(':')) {
      const paramName = segment.slice(1);
      params[paramName] = pathSegments[index];
    } else if (segment !== pathSegments[index]) {
      return {};
    }
  });

  return params;
}

/**
 * Send consistent JSON response
 * @param {ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
function sendResponse(res, statusCode, data) {
  // TODO: Implement consistent response sending
  // 1. Set proper HTTP status code
  // 2. Set Content-Type to application/json
  // 3. Add CORS headers for browser compatibility
  // 4. Convert data to JSON string
  // 5. Send response and end connection

  // Headers to set:
  // - Content-Type: application/json
  // - Access-Control-Allow-Origin: *
  // - Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  // - Access-Control-Allow-Headers: Content-Type

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

/**
 * Validate todo data according to business rules
 * @param {Object} todoData - Todo data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} Validation result with errors array
 */
function validateTodo(todoData, isUpdate = false) {
  // TODO: Implement todo data validation
  // 1. Check title requirements (required, string, 1-100 chars, not whitespace-only)
  // 2. Check description (optional, string, max 500 chars)
  // 3. Check completed (optional, boolean only)
  // 4. Return validation result with errors array
  // 5. Handle update vs create validation differences

  const errors = [];

  // Title validation
  // - Required for create, optional for update
  // - Must be string
  // - 1-100 characters
  // - Cannot be only whitespace

  // Description validation
  // - Optional field
  // - Must be string if provided
  // - Max 500 characters

  // Completed validation
  // - Optional field
  // - Must be boolean if provided

  if (!isUpdate && !('title' in todoData)) {
    errors.push('Title is required');
  } else if ('title' in todoData) {
    if (typeof todoData.title !== 'string') {
      errors.push('Title must be a string');
    } else if (todoData.title.trim().length === 0) {
      errors.push('Title cannot be only whitespace');
    } else if (todoData.title.length > 100) {
      errors.push('Title must be between 1 and 100 characters');
    }
  }
  if ('description' in todoData) {
    if (typeof todoData.description !== 'string') {
      errors.push('Description must be a string');
    } else if (todoData.description.length > 500) {
      errors.push('Description must be no more than 500 characters');
    }
  }
  if ('completed' in todoData) {
    if (typeof todoData.completed !== 'boolean') {
      errors.push('Completed must be a boolean');
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * TodoServer Class - Main HTTP server for Todo API
 */
class TodoServer {
  constructor(port = 3000) {
    // TODO: Initialize server properties
    // 1. Set port number
    // 2. Initialize empty todos array
    // 3. Set nextId counter for new todos
    // 4. Initialize with sample data

    this.port = port;
    this.todos = [];
    this.nextId = 1;

    // Sample todos for testing
    this.initializeSampleData();
  }

  /**
   * Initialize server with sample todo data
   */
  initializeSampleData() {
    // TODO: Add sample todos for testing
    // 1. Create 2-3 sample todos with proper structure
    // 2. Include variety: completed/incomplete, different dates
    // 3. Set proper id sequence for new todos

    const sampleTodos = [
      // Add sample todos here
      {
        id: this.generateNextId(),
        title: 'Sample Todo 1',
        description: 'This is a sample todo item',
        completed: false,
        createdAt: new Date('2026-08-14T11:00:00').toISOString(),
      },
      {
        id: this.generateNextId(),
        title: 'Sample Todo 2',
        description: 'This is another sample todo item',
        completed: true,
        createdAt: new Date('2026-08-19T15:30:00').toISOString(),
      },
      {
        id: this.generateNextId(),
        title: 'Sample Todo 3',
        description: 'Yet another sample todo item',
        completed: false,
        createdAt: new Date('2026-07-22T16:37:00').toISOString(),
      },
    ];

    this.todos.push(...sampleTodos);

    console.log('Initialized sample todos:', this.todos);
  }

  /**
   * Start the HTTP server
   */
  start() {
    // TODO: Create and start HTTP server
    // 1. Create HTTP server with request handler
    // 2. Listen on specified port
    // 3. Log server startup message
    // 4. Handle server errors

    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `Port ${this.port} is already in use. Please choose a different port.`
        );
      } else {
        console.error('Server error:', err);
      }
    });

    server.listen(this.port, () => {
      console.log(`TodoServer is running on http://localhost:${this.port}`);
    });
  }

  /**
   * Main request handler - routes requests to appropriate methods
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async handleRequest(req, res) {
    // TODO: Implement main request routing
    // 1. Parse URL and extract pathname, query
    // 2. Route based on HTTP method and path pattern
    // 3. Handle CORS preflight requests (OPTIONS)
    // 4. Call appropriate handler method
    // 5. Handle unknown routes with 404

    try {
      const parsedUrl = url.parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const method = req.method;

      console.log(`${method} ${pathname}`);

      // Route to appropriate handler based on method and path
      // GET /todos -> getAllTodos
      // GET /todos/:id -> getTodoById
      // POST /todos -> createTodo
      // PUT /todos/:id -> updateTodo
      // DELETE /todos/:id -> deleteTodo
      // OPTIONS -> handleCORS

      if (method === 'OPTIONS') {
        this.handleCORS(req, res);
        return;
      }

      if (method === 'GET' && pathname === '/todos') {
        await this.getAllTodos(req, res, query);
        return;
      }

      if (method === 'POST' && pathname === '/todos') {
        await this.createTodo(req, res);
        return;
      }

      const todoIdMatch = parsePathParams('/todos/:id', pathname);
      if (todoIdMatch) {
        const id = parseInt(todoIdMatch.id, 10);
        if (method === 'GET') {
          await this.getTodoById(req, res, { id });
          return;
        }
        if (method === 'PUT') {
          await this.updateTodo(req, res, { id });
          return;
        }
        if (method === 'DELETE') {
          await this.deleteTodo(req, res, { id });
          return;
        }
      }

      sendResponse(res, 404, {
        success: false,
        error: 'Route not found',
      });
    } catch (error) {
      console.error('Request handling error:', error);
      sendResponse(res, 500, {
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Handle GET /todos - Get all todos with optional filtering
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} query - URL query parameters
   */
  async getAllTodos(req, res, query) {
    // TODO: Implement get all todos with filtering
    // 1. Get all todos from storage
    // 2. Apply completed filter if provided in query
    // 3. Return success response with data and count
    // 4. Handle query parameter validation
    let todos = this.todos;

    if ('completed' in query && query.completed !== undefined) {
      const completed = query.completed === 'true';
      todos = todos.filter((todo) => todo.completed === completed);
    }

    sendResponse(res, 200, {
      success: true,
      data: todos,
      count: todos.length,
    });
  }

  /**
   * Handle GET /todos/:id - Get specific todo by ID
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async getTodoById(req, res, params) {
    // TODO: Implement get todo by ID
    // 1. Extract ID from path parameters
    // 2. Find todo in storage
    // 3. Return 404 if not found
    // 4. Return success response with todo data
    // 5. Handle invalid ID format

    const todoId = parseInt(params.id, 10);

    if (isNaN(todoId) || todoId <= 0) {
      return sendResponse(res, 400, {
        success: false,
        error: 'Invalid ID format',
      });
    }

    const todo = this.findTodoById(todoId);

    if (!todo) {
      return sendResponse(res, 404, {
        success: false,
        error: 'Todo not found',
      });
    }

    return sendResponse(res, 200, {
      success: true,
      data: todo,
    });
  }

  /**
   * Handle POST /todos - Create new todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async createTodo(req, res) {
    // TODO: Implement create new todo
    // 1. Parse request body
    // 2. Validate todo data
    // 3. Create new todo with generated ID and timestamps
    // 4. Add to storage
    // 5. Return 201 with created todo
    // 6. Handle validation errors

    const parsedData = await parseBody(req);

    if (!parsedData) {
      return sendResponse(res, 400, {
        success: false,
        error: 'Invalid JSON',
      });
    }

    const validation = validateTodo(parsedData, false);

    if (!validation.isValid) {
      return sendResponse(res, 400, {
        success: false,
        error: validation.error,
      });
    }

    const newTodo = {
      id: this.generateNextId(),
      title: parsedData.title.trim(),
      description: 'description' in parsedData ? parsedData.description : null,
      completed: 'completed' in parsedData ? Boolean(parsedData.completed) : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.todos.push(newTodo);

    return sendResponse(res, 201, {
      success: true,
      data: newTodo,
    });
  }

  /**
   * Handle PUT /todos/:id - Update existing todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async updateTodo(req, res, params) {
    // TODO: Implement update existing todo
    // 1. Extract ID from path parameters
    // 2. Find existing todo
    // 3. Parse request body
    // 4. Validate update data
    // 5. Merge changes with existing todo
    // 6. Update timestamp
    // 7. Return updated todo
    // 8. Handle not found and validation errors

    const todoId = parseInt(params.id, 10);

    if (isNaN(todoId) || todoId <= 0) {
      return sendResponse(res, 400, {
        success: false,
        error: 'Invalid ID format',
      });
    }

    const todoIndex = this.findTodoIndexById(todoId);

    if (todoIndex === -1) {
      return sendResponse(res, 404, {
        success: false,
        error: 'Todo not found',
      });
    }

    const parsedData = await parseBody(req);

    if (!parsedData) {
      return sendResponse(res, 400, {
        success: false,
        error: 'Invalid JSON',
      });
    }

    const validation = validateTodo(parsedData, true);

    if (!validation.isValid) {
      return sendResponse(res, 400, {
        success: false,
        error: validation.error,
      });
    }

    const existingTodo = this.todos[todoIndex];

    const updatedTodo = {
      ...existingTodo,
      title: 'title' in parsedData ? parsedData.title.trim() : existingTodo.title,
      description:
        'description' in parsedData ? parsedData.description : existingTodo.description,
      completed:
        'completed' in parsedData
          ? Boolean(parsedData.completed)
          : existingTodo.completed,
      updatedAt: new Date().toISOString(),
    };

    this.todos[todoIndex] = updatedTodo;

    return sendResponse(res, 200, {
      success: true,
      data: updatedTodo,
    });
  }

  /**
   * Handle DELETE /todos/:id - Delete todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async deleteTodo(req, res, params) {
    // TODO: Implement delete todo
    // 1. Extract ID from path parameters
    // 2. Find todo index in storage
    // 3. Return 404 if not found
    // 4. Remove from storage
    // 5. Return success message
    // 6. Handle invalid ID format

    const todoId = parseInt(params.id, 10);

    if (isNaN(todoId) || todoId <= 0) {
      return sendResponse(res, 400, {
        success: false,
        error: 'Invalid ID format',
      });
    }

    const todoIndex = this.findTodoIndexById(todoId);

    if (todoIndex === -1) {
      return sendResponse(res, 404, {
        success: false,
        error: 'Todo not found',
      });
    }

    const deletedTodo = this.todos.splice(todoIndex, 1)[0];

    return sendResponse(res, 200, {
      success: true,
      data: deletedTodo,
      message: 'Todo deleted successfully',
    });
  }

  /**
   * Handle CORS preflight requests
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  handleCORS(req, res) {
    // TODO: Implement CORS preflight handling
    // 1. Set CORS headers
    // 2. Return 204 No Content
    // 3. Handle preflight request properly

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.writeHead(204);
    res.end();
  }

  /**
   * Find todo by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {Object|null} Found todo or null
   */
  findTodoById(id) {
    // TODO: Implement find todo by ID
    // 1. Convert ID to number
    // 2. Search in todos array
    // 3. Return found todo or null
    // 4. Handle invalid ID format

    const numId = parseInt(id, 10);

    if (isNaN(numId) || numId <= 0) {
      return null;
    }

    const todo = this.todos.find((t) => t.id === numId);

    return todo || null;
  }

  /**
   * Find todo index by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {number} Todo index or -1 if not found
   */
  findTodoIndexById(id) {
    // TODO: Implement find todo index by ID
    // 1. Convert ID to number
    // 2. Find index in todos array
    // 3. Return index or -1 if not found

    const numId = parseInt(id, 10);

    if (isNaN(numId) || numId <= 0) {
      return -1;
    }

    const todoIndex = this.todos.findIndex((t) => t.id === numId);

    return todoIndex;
  }

  /**
   * Generate next available ID
   * @returns {number} Next ID
   */
  generateNextId() {
    // TODO: Implement ID generation
    // 1. Return current nextId
    // 2. Increment nextId for next use
    // 3. Handle edge cases
    if (this.nextId === undefined || this.nextId < 1) {
      this.nextId = 1;
    }

    return this.nextId++;
  }
}

// Export the TodoServer class
module.exports = TodoServer;

// Example usage (for testing):
const isReadyToTest = false;

if (isReadyToTest) {
  // Start server for testing
  const server = new TodoServer(3000);
  server.start();

  console.log('🚀 Todo Server starting...');
  console.log('📝 Replace TODO comments with implementation');
  console.log('🧪 Run task-04-test.js to verify functionality');
}

// If this file is run directly, start the server
if (require.main === module) {
  const server = new TodoServer(3000);
  server.start();
}
