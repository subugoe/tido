import { validateCollection, validateItem, validateManifest } from '@/utils/api-validate.ts'
import { CustomError } from '@/utils/custom-error.ts'
import { getContentTypes } from '@/utils/panel.ts'
import { validateSelector } from '@/utils/dom.ts'

async function validateCrossRefNode(crossRefInfo: CrossRefInfo)  {
  let collection, manifest, item

  const collectionResponse = await validateCollection(crossRefInfo.collection)
  if (collectionResponse.success) collection = (collectionResponse.data) as Collection
  else throw collectionResponse.error

  const manifestResponse = await validateManifest(crossRefInfo.manifest)
  if (manifestResponse.success) manifest = (manifestResponse.data) as Manifest
  else throw manifestResponse.error

  const itemResponse = await validateItem(crossRefInfo.item)
  if (itemResponse.success) item = itemResponse.data
  else throw itemResponse.error

  if (crossRefInfo?.selector) {
    if (!validateSelector(crossRefInfo.selector)) throw new CustomError('cross_ref_error_title', 'referenced_element_not_found')
  }
  const contentTypes = getContentTypes(item.content)
  if (!contentTypes.includes(crossRefInfo.contentType)) throw new CustomError('cross_ref_error_title', 'referenced_content_type_error')

  return {
    collection,
    manifestData: manifest,
    itemData: item
  }
}

export { validateCrossRefNode }
