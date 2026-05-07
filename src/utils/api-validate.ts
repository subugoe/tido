import { CustomError } from '@/utils/custom-error.ts'
import { apiRequest } from '@/utils/api.ts'

export type SuccessResult<T> = { success: true; data: T }
export type ErrorResult = { success: false; error: CustomError }

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

function success<T>(data: T): SuccessResult<T> {
  return { success: true as const, data }
}

function error(err: CustomError): ErrorResult {
  return { success: false as const, error: err }
}

async function validateCollection(collectionId: string): Promise<SuccessResult<Collection> | ErrorResult> {
  if (!isCollectionUrl(collectionId)) {
    return error(new CustomError('cross_ref_error_title', 'collection_url_error'))
  }
  const data = await apiRequest<Collection>(collectionId)
  const hasContent = Array.isArray(data.manifests) && data.manifests.length > 0
  if (typeof data !== 'object' || !hasContent) {
    return error(new CustomError('cross_ref_error_title', 'collection_or_manifest_data_error'))
  }
  return success(data)
}

async function validateManifest(manifestId: string): Promise<SuccessResult<Manifest> | ErrorResult> {
  if (!isManifestUrl(manifestId)) {
    return error(new CustomError('cross_ref_error_title', 'manifest_url_error'))
  }
  const data = await apiRequest<Manifest>(manifestId)
  const hasContent = Array.isArray(data.items) && data.items.length > 0
  if (typeof data !== 'object' || !hasContent) {
    return error(new CustomError('cross_ref_error_title', 'collection_or_manifest_data_error'))
  }
  return success(data)
}

async function validateItem(id: string): Promise<SuccessResult<Item> | ErrorResult> {
  if (!isItemUrl(id)) {
    return error(new CustomError('cross_ref_error_title', 'item_url_error'))
  }
  const data = await apiRequest<Item>(id)
  if (typeof data !== 'object' || !Array.isArray(data.contents)) {
    return error(new CustomError('cross_ref_error_title', 'item_data_error'))
  }
  return success(data)
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
