function getCollectionMetadata (collection: Collection | null) {
  const description = collection?.description
  const { result: collTitles } = validateTitles(collection?.titles)
  const { result: collectors } = validateCollectorsName(collection?.collectors)

  const metadata: Metadata[] = [
    ...(collTitles.map((title) => ({
      key: 'title',
      textapiType: 'TextApiMetadata',
      value: title,
    }))),
  ]

  if (collectors) {
    metadata.push({ key: 'collectors', textapiType: 'TextApiMetadata', value: collectors })
  }

  if (description && typeof description === 'string') {
    metadata.push({ key: 'description', textapiType: 'TextApiMetadata', value: description })
  }

  return metadata
}

function getManifestMetadata(manifest: Manifest | null) {
  const { result: license } = validateLicense(manifest?.license)
  const { result: label } = validateManifestLabel(manifest?.titles.length > 0 && manifest?.titles[0])

  const metadata: Metadata[] = [
    { key: 'label', textapiType: 'TextApiMetadata', value: label },
  ]

  if (license) {
    metadata.push({ key: 'license', textapiType: 'TextApiMetadata', value: license })
  }

  if (manifest?.metadata) {
    metadata.push(...manifest.metadata)
  }

  return metadata
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
  const titles = item?.titles
  const firstTitle = titles && titles.length > 0 ? titles[0] : undefined
  const label = validateItemLabel(firstTitle)
  const lang = validateItemLanguage(item?.languages)
  const imageLicense = validateImageLicense(item?.images?.[0]?.license)
  const imageNotes = validateImageNotes(item?.images?.[0]?.copyright)

  return [
    { key: 'label', textapiType: 'TextApiMetadata', value: label },
    { key: 'language', textapiType: 'TextApiMetadata', value: lang },
    { key: 'image_license', textapiType: 'TextApiMetadata', value: imageLicense },
    { key: 'image_notes', textapiType: 'TextApiMetadata', value: imageNotes },
  ].filter(i => i.value)
}

export { getCollectionMetadata, getManifestMetadata, getItemMetadata, validateCollectorsName, validateTitles }
