import React, { useState } from 'react';
import { Todo } from '../../types';

/**
 * Task 5: FilteredToDoList Component
 *
 * Theory: Derived State and Computed Values
 *
 * In React, you often need to compute values based on your state. These are called "derived state"
 * or "computed values" and should be calculated during render rather than stored in state.
 *
 * Why Use Derived State:
 * 1. Avoids state synchronization issues
 * 2. Reduces complexity by having a single source of truth
 * 3. Automatically updates when source data changes
 * 4. Prevents stale state bugs
 *
 * Common Derived State Patterns:
 *
 * Filtering:
 * - const activeTodos = todos.filter(todo => !todo.completed)
 * - const completedTodos = todos.filter(todo => todo.completed)
 *
 * Searching:
 * - const filteredTodos = todos.filter(todo =>
 *     todo.title.toLowerCase().includes(searchTerm.toLowerCase())
 *   )
 *
 * Sorting:
 * - const sortedTodos = [...todos].sort((a, b) => a.title.localeCompare(b.title))
 *
 * Aggregations:
 * - const completedCount = todos.filter(todo => todo.completed).length
 * - const totalCount = todos.length
 *
 * Multiple Filters:
 * - Use multiple filter conditions or combine them
 * - Consider using useMemo for expensive computations
 *
 * Key Concepts:
 * - Calculate derived values during render
 * - Don't store computed values in state
 * - Use useMemo for expensive calculations
 * - Keep state minimal and derive the rest
 */

enum Filter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const FilteredToDoList: React.FC = () => {
  // TODO: Implement the FilteredToDoList component
  //
  // Requirements:
  // 1. Display a list of todos with add functionality
  // 2. Add filter buttons: "All", "Active", "Completed"
  // 3. Filter todos based on selected filter
  // 4. Use derived state for filtered results
  // 5. Add complete functionality for todos
  //
  // Example implementation:
  // const [todos, setTodos] = useState<Todo[]>([]);
  // const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  //
  // const filteredTodos = todos.filter(todo => {
  //   if (filter === 'active') return !todo.completed;
  //   if (filter === 'completed') return todo.completed;
  //   return true; // 'all' case
  // });

  const [inputValue, setInputValue] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);

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

  const filteredTodos = todos.filter((todo) => {
    if (filter === Filter.Active) return !todo.completed;
    if (filter === Filter.Completed) return todo.completed;
    return true;
  });

  return (
    <div>
      <h4>Filtered ToDo List Component</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add todo"
        />
        <button type="submit" style={{ cursor: 'pointer' }}>
          Add
        </button>
      </form>
      <div>
        {Object.values(Filter).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              marginRight: '5px',
              fontWeight: filter === status ? 'bold' : 'normal',
              cursor: 'pointer',
            }}
          >
            {status}
          </button>
        ))}
      </div>
      <ul>
        {filteredTodos.map((todo) => (
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
