import { validateCollection, validateItem, validateManifest } from '@/utils/api-validate.ts'
import { CustomError } from '@/utils/custom-error.ts'
import { getContentTypes } from '@/utils/panel.ts'
import { validateSelector } from '@/utils/dom.ts'

async function validateCrossRefNode(crossRefInfo: CrossRefInfo)  {
  let collection: Collection | undefined
  let manifest: Manifest | undefined
  let item: Item | undefined

  const collectionResponse = await validateCollection(crossRefInfo.collection)
  if (collectionResponse.success === true) collection = collectionResponse.data
  else throw collectionResponse.error

  const manifestResponse = await validateManifest(crossRefInfo.manifest)
  if (manifestResponse.success === true) manifest = manifestResponse.data
  else throw manifestResponse.error

  const itemResponse = await validateItem(crossRefInfo.item)
  if (itemResponse.success === true) item = itemResponse.data
  else throw itemResponse.error

  if (crossRefInfo?.selector) {
    if (!validateSelector(crossRefInfo.selector)) throw new CustomError('cross_ref_error_title', 'referenced_element_not_found')
  }
  const contentTypes = getContentTypes(item.contents)
  if (!contentTypes.includes(crossRefInfo.contentType)) throw new CustomError('cross_ref_error_title', 'referenced_content_type_error')

  return {
    collection,
    manifestData: manifest,
    itemData: item
  }
}

export { validateCrossRefNode }
