import { CustomError } from '@/utils/custom-error.ts'
import { apiRequest } from '@/utils/api.ts'

function isCollectionUrl(url: string) {
  return url.includes('collection.json')
}

function isManifestUrl(url: string) {
  return url.includes('manifest.json')
}

function isItemUrl(url: string) {
  return url.includes('item.json') || url.includes('full.json')
}

function hasManifests(collection: Collection): boolean {
  if (!collection.sequence || !Array.isArray(collection.sequence)) return false
  return collection.sequence.length > 0
}

function hasItems(manifest: Manifest): boolean {
  if (!manifest.sequence || !Array.isArray(manifest.sequence)) return false
  return manifest.sequence.length > 0
}

async function validateResponse(data : Collection | Manifest) {
  if (typeof data !== 'object' || !Object.hasOwn(data, 'sequence')) {
    return {
      success: false,
      error: new CustomError('cross_ref_error_title', 'collection_or_manifest_data_error'),
    }
  }
  return { success: true, data }
}

async function validateCollection(collectionId: string) {
  if (!isCollectionUrl(collectionId)) {
    return {
      success: false,
      error: new CustomError('cross_ref_error_title', 'collection_url_error')
    }
  }
  const data = await apiRequest<Collection>(collectionId)
  return await validateResponse(data)
}

async function validateManifest(manifestId: string) {
  if (!isManifestUrl(manifestId)) {
    return {
      success: false,
      error: new CustomError('cross_ref_error_title', 'manifest_url_error')
    }
  }
  const data = await apiRequest<Manifest>(manifestId)
  return await validateResponse(data)
}

async function validateItem(id: string){
  if (!isItemUrl(id)) {
    return {
      success: false,
      error: new CustomError('cross_ref_error_title', 'item_url_error')
    }
  }
  const data = await apiRequest<Item>(id)
  if (typeof data !== 'object' || !Object.hasOwn(data, 'content')) {
    return {
      success: false,
      error: new CustomError('cross_ref_error_title', 'item_data_error')
    }
  }
  return { success: true, data }
}

export {
  isCollectionUrl,
  isManifestUrl,
  isItemUrl,
  hasManifests,
  hasItems,
  validateItem,
  validateManifest,
  validateCollection
}
