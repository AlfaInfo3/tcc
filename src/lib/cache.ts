const cache = new Map<string, unknown>();

export function getCache<T = unknown>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function setCache(key: string, value: unknown) {
  cache.set(key, value);
}
