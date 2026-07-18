/* eslint-disable @typescript-eslint/no-unused-vars */
// Task 02: Mini functional–utility library
// All helpers are declared but not implemented.

const validateArray = <T>(source: readonly T[]): void => {
  if (!Array.isArray(source) || source === null || source === undefined) {
    throw new TypeError('Expected a valid array');
  }
};

export function mapArray<T, R>(
  source: readonly T[],
  mapper: (item: T, index: number) => R
): R[] {
  validateArray(source);
  const result: R[] = [];
  for (let i = 0; i < source.length; i++) {
    result.push(mapper(source[i], i));
  }

  return result;
}

export function filterArray<T>(
  source: readonly T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  validateArray(source);
  const result: T[] = [];

  for (let i = 0; i < source.length; i++) {
    if (predicate(source[i], i)) {
      result.push(source[i]);
    }
  }
  return result;
}

export function reduceArray<T, R>(
  source: readonly T[],
  reducer: (acc: R, item: T, index: number) => R,
  initial: R
): R {
  validateArray(source);
  let result = initial;

  for (let i = 0; i < source.length; i++) {
    result = reducer(result, source[i], i);
  }
  return result;
}

export function partition<T>(
  source: readonly T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  validateArray(source);
  const truthy: T[] = [];
  const falsy: T[] = [];

  for (const item of source) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  return [truthy, falsy];
}

export function groupBy<T, K extends PropertyKey>(
  source: readonly T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  validateArray(source);
  const result: Record<K, T[]> = {} as Record<K, T[]>;

  for (const item of source) {
    const key = keySelector(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}
