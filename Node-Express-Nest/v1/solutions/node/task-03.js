const fs = require('fs');
const fsPromises = require('fs').promises;
const util = require('util');
const net = require('net');

/**
 * Event Loop Analysis and Async Debugging
 * Learn Node.js event loop phases and fix broken async code
 */

/**
 * Analyze execution order of event loop phases
 * @returns {object} Analysis of execution order
 */
function analyzeEventLoop() {
  // TODO: Implement event loop analysis
  // 1. Create examples showing each event loop phase
  // 2. Demonstrate microtask vs macrotask priority
  // 3. Show execution order with detailed logging
  // 4. Return analysis object with explanations

  const analysis = {
    phases: [
      'Timers phase (setTimeout, setInterval)',
      'Pending callbacks phase',
      'Idle, prepare phase',
      'Poll phase (I/O operations)',
      'Check phase (setImmediate)',
      'Close callbacks phase',
    ],
    executionOrder: [
      'Synchronous code',
      'Process.nextTick() callbacks',
      'Promise microtasks',
      'Timers phase (setTimeout, setInterval)',
      'I/O callbacks (Pending callbacks)',
      'Poll phase (I/O operations)',
      'Check phase (setImmediate)',
      'Close callbacks phase',
    ],
    explanations: [
      'Synchronous code always executes first, completely emptying the call stack.',
      'process.nextTick() has the highest priority and runs before any microtasks or event loop phases.',
      'Promise callbacks runs after nextTick and after every callback execution.',
      'Macrotasks (timers, setImmediate, I/O) are processed within their respective event loop phases, with microtasks draining between them.',
    ],
  };

  return analysis;
}

/**
 * Predict execution order for code snippets
 * @param {string} snippet - Code snippet identifier
 * @returns {array} Predicted execution order
 */
function predictExecutionOrder(snippet) {
  // TODO: Implement execution order prediction
  // 1. Analyze the provided code snippets
  // 2. Apply event loop phase rules
  // 3. Consider microtask priority
  // 4. Return predicted order with explanations

  const predictions = {
    snippet1: [
      // Basic event loop snippet predictions
      'Start',
      'End',
      'Next Tick 1',
      'Next Tick 2',
      'Promise 1',
      'Promise 2',
      'Timer 1',
      'Timer 2',
      'Immediate 1',
      'Immediate 2',
    ],
    snippet2: [
      // File system operations snippet predictions
      '=== Start ===',
      '=== End ===',
      'NextTick',
      'Nested NextTick',
      'Timer',
      'NextTick in Timer',
      'Immediate',
      'NextTick in Immediate',
      'fs.readFile',
      'NextTick in readFile',
      'Immediate in readFile',
      'Timer in readFile',
    ],
  };

  return predictions[snippet] || [];
}

/**
 * Fix race condition in file processing
 * @returns {Promise} Promise that resolves when files are processed
 */
async function fixRaceCondition() {
  // TODO: Fix the race condition in file processing
  // Issues to fix:
  // 1. Race condition in file processing
  // 2. Incorrect error handling
  // 3. Missing await keywords
  // 4. Array index might be wrong due to closure

  const files = ['file1.txt', 'file2.txt', 'file3.txt'];

  try {
    // Implementation goes here

    const results = await Promise.all(
      files.map(async (file) => {
        let content;
        try {
          content = await fsPromises.readFile(file, 'utf8');
        } catch (err) {
          if (err.code === 'ENOENT') {
            console.log(`File not found: ${file}, creating it...`);
            await fsPromises.writeFile(file, `Content of ${file}`);
            console.log(`Created ${file}`);
          } else {
            throw err;
          }
        }
        return content.toUpperCase();
      })
    );

    console.log('All files processed:', results);

    return results;
  } catch (error) {
    throw new Error(`Failed to process files: ${error.message}`);
  }
}

/**
 * Convert callback hell to async/await
 * @param {number} userId - User ID to process
 * @returns {Promise} Promise that resolves with processed user data
 */
async function fixCallbackHell(userId) {
  // TODO: Convert callback hell to async/await
  // Issues to fix:
  // 1. Callback hell structure
  // 2. No error handling for JSON.parse
  // 3. Repetitive error handling code
  // 4. No file existence checking
  // 5. Blocking operations

  try {
    // Step 1: Read user file
    // Step 2: Read user preferences
    // Step 3: Read user activity
    // Step 4: Combine data and write result

    const userData = await fsPromises.readFile(`user-${userId}.json`, 'utf8');
    const user = JSON.parse(userData);

    if (!user || typeof user !== 'object') {
      throw new Error('Invalid user data');
    }

    const [prefData, activityData] = await Promise.all([
      fsPromises.readFile(`preferences-${user.id}.json`, 'utf8'),
      fsPromises.readFile(`activity-${user.id}.json`, 'utf8'),
    ]);

    const preferences = JSON.parse(prefData);

    if (!preferences || typeof preferences !== 'object') {
      throw new Error('Invalid preferences data');
    }

    const activity = JSON.parse(activityData);

    if (!activity || typeof activity !== 'object') {
      throw new Error('Invalid activity data');
    }

    const combinedData = {
      user,
      preferences,
      activity,
      processedAt: new Date(),
    };

    await fsPromises.writeFile(
      `processed-${userId}.json`,
      JSON.stringify(combinedData, null, 2)
    );

    console.log('User data processed successfully:', combinedData);

    return combinedData;
  } catch (error) {
    throw new Error(`Failed to process user data: ${error.message}`);
  }
}

/**
 * Fix mixed promises and callbacks
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function fixMixedAsync() {
  // TODO: Fix mixed promises and callbacks
  // Issues to fix:
  // 1. Mixing promises and callbacks inconsistently
  // 2. Nested async operations without proper chaining
  // 3. Error handling inconsistencies
  // 4. No proper async/await usage

  console.log('Starting data processing...');

  try {
    // Implementation goes here
    let data;
    try {
      data = await fsPromises.readFile('input.txt', 'utf8');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('Input file not found. Creating default file...');
        await fsPromises.writeFile('input.txt', 'Hello World!');
        console.log('Created input file, please run again');
        return;
      }
      throw err;
    }
    console.log('File read successfully');

    const processedData = data.toUpperCase();

    await fsPromises.writeFile('output.txt', processedData);
    console.log('File written successfully');

    const verifyData = await fsPromises.readFile('output.txt', 'utf8');
    console.log('Verification successful');
    console.log('Data length:', verifyData.length);
  } catch (error) {
    throw new Error(`Failed to process data: ${error.message}`);
  }
}

/**
 * Demonstrate all event loop phases
 * @returns {Promise} Promise that resolves when demonstration is complete
 */
async function demonstrateEventLoop() {
  // TODO: Create comprehensive event loop demonstration
  // 1. Show timers phase (setTimeout, setInterval)
  // 2. Show pending callbacks phase
  // 3. Show poll phase (I/O operations)
  // 4. Show check phase (setImmediate)
  // 5. Show close callbacks phase
  // 6. Demonstrate microtask priority (nextTick, Promises)
  console.log('Demonstrating event loop phases...');
  console.log('Synchronous code execution');

  process.nextTick(() => {
    console.log('process.nextTick callback executed');
  });

  Promise.resolve().then(() => {
    console.log('Promise microtask executed');
  });

  setTimeout(() => {
    console.log('setTimeout callback executed');
  }, 0);

  await new Promise((resolve) => {
    const socket = net.connect(1, '127.0.0.1');
    socket.on('error', () => {
      console.log('Pending callback executed (socket error)');
      resolve();
    });
  });

  await fsPromises
    .writeFile('temp.txt', 'Temporary file for event loop demonstration')
    .then(() => {
      console.log('File write operation completed');

      setTimeout(() => {
        console.log('setTimeout after file write executed');
      }, 0);

      setImmediate(() => {
        console.log('setImmediate after file write executed');
      });
    });

  await new Promise((resolve) => {
    const socket = new net.Socket();
    socket.on('close', () => {
      console.log('Close callback executed (socket closed)');
      resolve();
    });
    socket.destroy();
  });
}

/**
 * Create test files for debugging exercises
 */
async function createTestFiles() {
  // TODO: Create test files for the exercises
  // 1. Create sample user data files
  // 2. Create input files for processing
  // 3. Handle file creation errors gracefully

  const testData = {
    'user-123.json': {
      id: 123,
      name: 'John Doe',
      email: 'john@example.com',
    },
    'preferences-123.json': {
      theme: 'dark',
      language: 'en',
      notifications: true,
    },
    'activity-123.json': {
      lastLogin: '2025-01-01',
      sessionsCount: 42,
      totalTime: 3600,
    },
    'input.txt': 'Hello World! This is test data for processing.',
    'file1.txt': 'Content of file 1',
    'file2.txt': 'Content of file 2',
    'file3.txt': 'Content of file 3',
  };

  try {
    // Implementation goes here
    await Promise.all(
      Object.entries(testData).map(async ([filename, content]) => {
        const fileContent =
          typeof content === 'string' ? content : JSON.stringify(content, null, 2);
        await fsPromises.writeFile(filename, fileContent, 'utf8');
        console.log(`Successfully created test file: ${filename}`);
      })
    );
    console.log('Test files created successfully');
  } catch (error) {
    throw new Error(`Failed to create test files: ${error.message}`);
  }
}

/**
 * Helper function to log with timestamps
 * @param {string} message - Message to log
 * @param {string} phase - Event loop phase
 */
function logWithPhase(message, phase = 'unknown') {
  // TODO: Implement detailed logging
  // 1. Add timestamp
  // 2. Add event loop phase information
  // 3. Add color coding for different phases
  // 4. Format output for better readability

  const timestamp = new Date().toISOString().split('T')[1].replace('Z', '');

  const colors = {
    NEXT_TICK: '\x1b[36m', // Cyan
    PROMISE: '\x1b[35m', // Magenta
    TIMER: '\x1b[33m', // Yellow
    PENDING: '\x1b[34m', // Blue
    POLL: '\x1b[38m', // Gray
    CHECK: '\x1b[32m', // Green
    CLOSE: '\x1b[31m', // Red
    DEFAULT: '\x1b[37m', // White
    RESET: '\x1b[0m', // Reset
  };

  const color = colors[phase.toUpperCase()] || colors.DEFAULT;

  console.log(`${color}[${timestamp}] [${phase}] ${message}${colors.RESET}`);
}

// Export functions and data
module.exports = {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
};

// Example usage (for testing):
const isReadyToTest = false;

if (isReadyToTest) {
  async function runExamples() {
    console.log('🔄 Starting Event Loop Analysis Examples...\n');

    // Create test files
    await createTestFiles();

    // Demonstrate event loop
    console.log('=== Event Loop Demonstration ===');
    await demonstrateEventLoop();

    // Analyze execution order
    console.log('\n=== Execution Order Analysis ===');
    const analysis = analyzeEventLoop();
    console.log('Analysis:', analysis);

    // Fix broken code
    console.log('\n=== Fixing Broken Code ===');
    try {
      await fixRaceCondition();
      console.log('✅ Race condition fixed');

      await fixCallbackHell(123);
      console.log('✅ Callback hell converted');

      await fixMixedAsync();
      console.log('✅ Mixed async resolved');
    } catch (error) {
      console.error('❌ Error fixing code:', error.message);
    }
  }

  runExamples();
}
