import React, { useState } from 'react';
import { Todo } from '../../types';

/**
 * Task 4: CompleteToDoList Component
 *
 * Theory: State Updates and Immutability
 *
 * React state updates must be immutable. This means you cannot directly modify the existing state
 * object or array. Instead, you must create a new object/array with the updated values.
 *
 * Why Immutability Matters:
 * 1. React uses reference equality to determine if state has changed
 * 2. Direct mutations don't trigger re-renders
 * 3. It enables time-travel debugging and undo/redo features
 * 4. It makes state changes predictable and traceable
 *
 * Common State Update Patterns:
 *
 * For Arrays:
 * - Adding: [...array, newItem]
 * - Removing: array.filter(item => item.id !== id)
 * - Updating: array.map(item => item.id === id ? {...item, updated: true} : item)
 *
 * For Objects:
 * - Updating: {...object, newProperty: value}
 * - Nested updates: {...object, nested: {...object.nested, updated: true}}
 *
 * Event Handling with Parameters:
 * - Use arrow functions to pass parameters to event handlers
 * - Example: onClick={() => handleClick(id)}
 * - Or use bind: onClick={handleClick.bind(null, id)}
 *
 * Key Concepts:
 * - Always create new objects/arrays when updating state
 * - Use spread operator (...) for shallow copies
 * - Consider using libraries like Immer for complex updates
 * - Think about state structure before implementing
 */
export const CompleteToDoList: React.FC = () => {
  // TODO: Implement the CompleteToDoList component
  //
  // Requirements:
  // 1. Display a list of todos with add functionality
  // 2. Add a "Complete" button for each todo
  // 3. When clicked, mark the todo as completed
  // 4. Use immutable state updates
  // 5. Show completion status for each todo
  //
  // Example state structure:
  // const [todos, setTodos] = useState<Todo[]>([]);
  //
  // Example update function:
  // const markCompleted = (id: number) => {
  //   setTodos(todos.map(todo =>
  //     todo.id === id ? {...todo, completed: true} : todo
  //   ));
  // };

  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      title: inputValue.trim(),
      completed: false,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setInputValue('');
  };

  const markCompleted = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo)));
  };

  return (
    <div>
      <h4>Complete ToDo List Component</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888888' : '#000000',
              padding: '8px',
            }}
          >
            {todo.title}
            <button
              type="submit"
              onClick={() => markCompleted(todo.id)}
              style={{
                marginLeft: '10px',
                background: todo.completed ? '#d4edda' : '#f4f4f4',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {todo.completed ? 'Completed' : 'Complete'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
