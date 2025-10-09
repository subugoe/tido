const cache = new Map()

function promiseWithCache(key, asyncFn) {
  if (!cache.has(key)) {
    cache.set(key, asyncFn())
  }
  return cache.get(key)
}

export {
  promiseWithCache
}
