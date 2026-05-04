import { CustomError } from '@/utils/custom-error.ts'
import { apiRequest } from '@/utils/api.ts'

function isCollectionUrl(url: string) {
  return url.includes('/collections/')
}

function isManifestUrl(url: string) {
  return url.includes('/manifests/')
}

function isItemUrl(url: string) {
  return url.includes('/items/')
}

function hasManifests(collection: Collection): boolean {
  return Array.isArray(collection.manifests) && collection.manifests.length > 0
}

function hasItems(manifest: Manifest): boolean {
  return Array.isArray(manifest.items) && (manifest.items?.length ?? 0) > 0
}

async function validateResponse(data : Collection | Manifest) {
  const hasContent = 'manifests' in data
    ? (data.manifests?.length ?? 0) > 0
    : (data.items?.length ?? 0) > 0
  if (typeof data !== 'object' || !hasContent) {
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
  if (typeof data !== 'object' || !Array.isArray(data.contents)) {
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
