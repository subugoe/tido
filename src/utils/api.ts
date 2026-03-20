import { request } from '@/utils/http.ts'
import { CustomError } from '@/utils/custom-error.ts'
import { } from 'react-i18next'
import { hasItems, hasManifests, isItemUrl, isManifestUrl } from '@/utils/api-validate.ts'
import i18n from 'i18next'

const { t } = i18n

async function apiRequest<T>(url: string): Promise<T> {
  const response = await request(url)

  if (!response.success) {
    throw response
  }

  return response.data as T
}


async function getAnnotationPage(annotationCollectionUrl: string): Promise<AnnotationPage> {
  const collection: AnnotationCollection = await apiRequest<AnnotationCollection>(annotationCollectionUrl)
  if (typeof collection !== 'object' || !Object.hasOwn(collection, 'first')) {
    throw new CustomError(t('annotations_init_error'), t('annotation_collection_response_error'))
  }
  return await apiRequest<AnnotationPage>(collection.first)
}

async function getFirstManifest(collection: Collection) {
  if (!hasManifests(collection)) {
    throw new CustomError(t('panel_init_error'), t('error_contains_no_manifests', { url: collection.id }))
  }

  const first = collection.sequence[0].id
  if (!isManifestUrl(first)) {
    throw new CustomError(t('panel_init_error'), t('error_invalid_manifest_url', { url: first }))
  }

  return await apiRequest<Manifest>(first)
}

async function getFirstItem(manifest: Manifest) {
  if (!hasItems(manifest)) {
    throw new CustomError(t('panel_init_error'), t('error_contains_no_items', { url: manifest.id }))
  }

  const first = manifest.sequence[0].id
  if (!isItemUrl(first)) {
    throw new CustomError(t('panel_init_error'), t('error_invalid_item_url', { url: first }))
  }

  return await apiRequest<Item>(manifest.sequence[0].id)
}


export {
  apiRequest,
  getAnnotationPage,
  getFirstManifest,
  getFirstItem
}
