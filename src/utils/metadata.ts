
function getCollectionMetadata (collectionTitle: Title[] | undefined, collectorsName: Actor[] | undefined, description: string | undefined) {
  const mappings = {
    main: 'title',
    sub: 'subtitle',
  }

  const { result: collTitle, errors: titleErrors } = validateTitle(collectionTitle)
  const { result: collectors } = validateCollectorsName(collectorsName)


  return [
    ...(Object.keys(titleErrors).length === 0 && collTitle.map((title) => ({
      key: mappings[title.type] || 'title',
      value: title.title,
    })) || [{ key: 'title', value: titleErrors[Object.keys(titleErrors)[0]] }]),
    ...([{ key: 'collector', value: collectors }]),
    ...(description && typeof description === 'string' ? [{ key: 'description', value: description }] : []),
  ]
}

function getManifestMetadata(manifest: Manifest | null) {
  const { result: license } = validateLicense(manifest?.license)
  const { result: label } = validateManifestLabel(manifest?.label)

  return [
    { key: 'label', value: label },
    ...(license.length > 0 && license.map((item) => ({
      key: 'license',
      value: item.id,
    })) || [{ key: 'license', value: 'value_must_be_an_array' }]),
    ...(manifest?.metadata || [])
  ]
}

function validateCollectorsName(input: Actor[] | undefined) {
  const result =
    Array.isArray(input) && input.length > 0
      ? input.length === 1 ? input[0].name : input.map((collector) => collector.name).join(', ')
      : (() => {
        return 'value_must_be_an_array'
      })()
  return { result }
}

function validateTitle(input: Title[] | undefined) {
  const errors: Record<string, string>  = { }
  const result =
    Array.isArray(input)
      ? input
      : (() => {
        if (input !== undefined)
          errors['title'] = 'value_must_be_an_array'
        return []
      })()
  return { result, errors }
}

function validateLicense(input: License[] | undefined) {
  const result =
    Array.isArray(input)
      ? input
      : (() => {
        return []
      })()
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

  const label  = validateItemLabel(item?.n)
  const lang = validateItemLanguage(item?.lang)
  const imageLicense = validateImageLicense(item?.image?.license?.id)
  const imageNotes = validateImageNotes(item?.image?.license?.notes)

  return [
    { key: 'label', value: label },
    { key: 'language', value: lang },
    { key: 'image_license', value: imageLicense },
    { key: 'image_notes', value: imageNotes },
  ].filter(i => i.value)
}

export { getCollectionMetadata, getManifestMetadata, getItemMetadata, validateCollectorsName }
