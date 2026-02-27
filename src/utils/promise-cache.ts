const cache = new Map<string, Promise<unknown>>()

function promiseWithCache(key: string, asyncFn: () => Promise<unknown>) {
  if (!cache.has(key)) {
    cache.set(key, asyncFn())
  }
  return cache.get(key)
}

export {
  promiseWithCache
}
