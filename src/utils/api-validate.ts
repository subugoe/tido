function isCollectionUrl(url: string) {
  return url.includes('collection.json')
}

function isManifestUrl(url: string) {
  return url.includes('manifest.json')
}

export {
  isCollectionUrl,
  isManifestUrl
}
