
function getCollectionMetadata (collection: Collection | null) {
  const description = collection?.description
  const { result: collTitles } = validateTitles(collection?.titles)
  const { result: collectors } = validateCollectorsName(collection?.collectors)

  return [
    ...(collTitles.map((title) => ({
      key: 'title',
      value: title,
    }))),
    ...([{ key: 'collectors', value: collectors }]),
    ...(description && typeof description === 'string' ? [{ key: 'description', value: description }] : []),
  ]
}

function getManifestMetadata(manifest: Manifest | null) {
  const { result: license } = validateLicense(manifest?.license)
  const { result: label } = validateManifestLabel(manifest?.label)

  return [
    { key: 'label', value: label },
    ...(license && [{ key: 'license', value: license }] || []),
    ...(manifest?.metadata || [])
  ]
}

function validateCollectorsName(input: Agent[] | undefined) {
  const result =
    Array.isArray(input) && input.length > 0
      ? input.length === 1 ? input[0].name : input.map((collector) => collector.name).join(', ')
      : (() => {
        return 'value_must_be_an_array'
      })()
  return { result }
}

function validateTitles(input: string[] | undefined) {
  const result: string[] = Array.isArray(input) ? input : []
  return { result }
}

function validateLicense(input: string | undefined) {
  const result = input || ''
  return { result }
}

function validateManifestLabel(input: string | undefined ) {
  const result =
    input
      ? input
      : (() => {
        return 'value_must_be_a_string'
      })()
  return { result }
}

function validateItemLabel(input: string | undefined ) {
  return input
    ? input
    : (() => {
      return ''
    })()
}

function validateItemLanguage(input: string[] | undefined) {
  return Array.isArray(input)
    ? input.join(',')
    : (() => {
      return ''
    })()
}

function validateImageLicense(input: string | undefined ) {
  return input
    ? input
    : (() => {
      return ''
    })()
}

function validateImageNotes(input: string | undefined ) {
  return input
    ? input
    : (() => {
      return ''
    })()
}

function getItemMetadata(item: Item | null) {

  const label  = validateItemLabel(item?.titles?.[0])
  const lang = validateItemLanguage(item?.languages)
  const imageLicense = validateImageLicense(item?.images?.[0]?.license)
  const imageNotes = validateImageNotes(item?.images?.[0]?.copyright)

  return [
    { key: 'label', value: label },
    { key: 'language', value: lang },
    { key: 'image_license', value: imageLicense },
    { key: 'image_notes', value: imageNotes },
  ].filter(i => i.value)
}

export { getCollectionMetadata, getManifestMetadata, getItemMetadata, validateCollectorsName, validateTitles }
