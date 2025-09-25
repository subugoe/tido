function isCollectionUrl(url: string) {
  return url.includes('collection.json')
}

function isManifestUrl(url: string) {
  return url.includes('manifest.json')
}

function isItemUrl(url: string) {
  return url.includes('item.json')
}

export {
  isCollectionUrl,
  isManifestUrl,
  isItemUrl
}
