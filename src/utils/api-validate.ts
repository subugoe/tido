function isCollectionUrl(url: string) {
  return url.includes('collection.json')
}

function isManifestUrl(url: string) {
  return url.includes('manifest.json')
}

function isItemUrl(url: string) {
  return url.includes('item.json')
}

function hasManifests(collection: Collection): boolean {
  if (!collection.sequence || !Array.isArray(collection.sequence)) return false
  const first = collection.sequence[0].id
  return isManifestUrl(first)
}

function hasItems(manifest: Manifest): boolean {
  if (!manifest.sequence || !Array.isArray(manifest.sequence)) return false
  const first = manifest.sequence[0].id
  return isItemUrl(first)
}

export {
  isCollectionUrl,
  isManifestUrl,
  isItemUrl,
  hasManifests,
  hasItems
}
