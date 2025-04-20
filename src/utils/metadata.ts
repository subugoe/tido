

function getCollectorsName(collection: Collection | null): string | null {
  if (!collection) return null
  if (collection.collector.length === 0) return null
  if (collection.collector.length === 1) return collection.collector[0].name

  return collection.collector.map((collector) => collector.name).join(', ')
}

function getCollectionMetadata (collectionTitle: Title[], collectorsName: string | null, description: string | undefined) {
  const mappings = {
    main: 'title',
    sub: 'subtitle',
  }

  return [
    ...collectionTitle
      .map((title) => ({
        key: mappings[title.type] || 'title',
        value: title.title,
      })),
    ...(collectorsName ? [{ key: 'collector', value: collectorsName }] : []),
    ...(description ? [{ key: 'description', value: description }] : []),
  ]
}

export { getCollectorsName, getCollectionMetadata }
