

function getCollectorsName(collection: Collection | null): string | null {
  if (!collection) return null
  if (collection.collector.length === 0) return null
  if (collection.collector.length === 1) return collection.collector[0].name

  return collection.collector.map((collector) => collector.name).join(', ')
}

export { getCollectorsName }
