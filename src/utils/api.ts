import { request } from '@/utils/http.ts'
import { CustomError } from '@/utils/custom-error.ts'
import { hasItems, hasManifests, isItemUrl, isManifestUrl } from '@/utils/api-validate.ts'
import { useDataStore } from '@/store/DataStore.tsx'
import i18n from 'i18next'

const { t } = i18n

// Helper to extract ID string from collection/manifest/item array elements
function getIdFromElement(element: string | { id: string }): string {
  return typeof element === 'object' ? element.id : element
}

// Inflight map tracks ongoing annotation page fetches by collection URL. When multiple callers
// request the same annotation collection before the first fetch completes, they share the same
// promise instead of firing duplicate requests. Entries are cleaned up once the promise settles.
const inflightAnnotationPages = new Map<string, Promise<AnnotationPage>>()

async function apiRequest<T>(url: string): Promise<T> {
  const response = await request(url)

  if (!response.success) {
    const err = response as ErrorResponse
    throw new CustomError(
      t('error_loading_data'),
      `Failed to load ${url}: ${err.message} (${err.code})`
    )
  }

  return response.data as T
}


async function getAnnotationPage(annotationCollectionUrl: string): Promise<AnnotationPage> {
  if (inflightAnnotationPages.has(annotationCollectionUrl)) {
    return inflightAnnotationPages.get(annotationCollectionUrl)!
  }

  const promise = (async () => {
    const collection: AnnotationCollection = await apiRequest<AnnotationCollection>(annotationCollectionUrl)
    if (typeof collection !== 'object' || !Object.hasOwn(collection, 'first')) {
      throw new CustomError(t('annotations_init_error'), t('annotation_collection_response_error'))
    }
    return await apiRequest<AnnotationPage>(collection.first)
  })()

  inflightAnnotationPages.set(annotationCollectionUrl, promise)
  try {
    return await promise
  } finally {
    inflightAnnotationPages.delete(annotationCollectionUrl)
  }
}

async function getFirstManifest(collection: Collection) {
  if (!hasManifests(collection)) {
    throw new CustomError(t('panel_init_error'), t('error_contains_no_manifests', { url: collection.id }))
  }

  const first = getIdFromElement(collection.manifests[0])
  if (!isManifestUrl(first)) {
    throw new CustomError(t('panel_init_error'), t('error_invalid_manifest_url', { url: first }))
  }

  return await useDataStore.getState().initManifest(first)
}

async function getFirstItem(manifest: Manifest) {
  if (!hasItems(manifest)) {
    throw new CustomError(t('panel_init_error'), t('error_contains_no_items', { url: manifest.id }))
  }

  const first = manifest.items?.[0]
  const firstId = first ? getIdFromElement(first) : undefined
  if (!firstId || !isItemUrl(firstId)) {
    throw new CustomError(t('panel_init_error'), t('error_invalid_item_url', { url: firstId }))
  }

  return await useDataStore.getState().initItem(firstId)
}


export {
  apiRequest,
  getAnnotationPage,
  getFirstManifest,
  getFirstItem
}
