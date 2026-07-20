import { Todo } from './types';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
  return [...state, todo];
}

export function updateTodo(
  state: Todo[],
  id: number,
  update: Partial<Omit<Todo, 'id' | 'createdAt'>>
): Todo[] {
  if (!state.some((todo) => todo.id === id)) {
    throw new Error(`Todo with id ${id} not found`);
  }
  return state.map((todo) => (todo.id === id ? { ...todo, ...update } : todo));
}

export function removeTodo(state: Todo[], id: number): Todo[] {
  if (!state.some((todo) => todo.id === id)) {
    throw new Error(`Todo with id ${id} not found`);
  }
  return state.filter((todo) => todo.id !== id);
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
  if (!state.some((todo) => todo.id === id)) {
    throw new Error(`Todo with id ${id} not found`);
  }
  return state.find((todo) => todo.id === id);
}
