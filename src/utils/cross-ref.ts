import { validateCollection, validateItem, validateManifest } from '@/utils/api-validate.ts'
import { CustomError } from '@/utils/custom-error.ts'
import { getContentTypes } from '@/utils/panel.ts'
import { validateSelector } from '@/utils/dom.ts'

async function validateCrossRefNode(sourceEl: HTMLElement)  {
  let collection, manifest, item
  const collectionId = sourceEl.getAttribute('data-ref-collection')
  const manifestId = sourceEl.getAttribute('data-ref-manifest')
  const itemId = sourceEl.getAttribute('data-ref-item')
  const targetSelector = sourceEl.getAttribute('data-ref-target')
  const contentType = sourceEl.getAttribute('data-ref-content-type')

  const collectionResponse = await validateCollection(collectionId)
  if (collectionResponse.success) collection = collectionResponse.data
  else throw collectionResponse.error

  const manifestResponse = await validateManifest(manifestId)
  if (manifestResponse.success) manifest = manifestResponse.data
  else throw manifestResponse.error

  const itemResponse = await validateItem(itemId)
  if (itemResponse.success) item = itemResponse.data
  else throw itemResponse.error

  if (!validateSelector(targetSelector)) throw new CustomError('cross_ref_error_title', 'referenced_element_not_found')
  const contentTypes = getContentTypes(item.content)
  if (!contentTypes.includes(contentType)) throw new CustomError('cross_ref_error_title', 'referenced_content_type_error')

  return {
    collection,
    manifestData: manifest,
    itemData: item
  }
}

export { validateCrossRefNode }
