// Normalise the shapes the Annotation API spec allows (see types/annotation.d.ts) to the ones TIDO
// works with (see the extensions in types/index.d.ts). The spec lets body and target be a single
// value or an array, and an embedded resource or a plain IRI.

function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

// The first body that is an embedded object. A body given as plain IRI carries nothing to show.
function getAnnotationBody(annotation: Annotation): AnnotationBody | undefined {
  return toArray(annotation?.body).find((body) => typeof body === 'object') as AnnotationBody | undefined
}

function isTextualBody(body: AnnotationBody | undefined): body is AnnotationTextualBody {
  return !!body && 'value' in body && typeof body.value === 'string'
}

function getTextualBody(annotation: Annotation): AnnotationTextualBody | undefined {
  const body = getAnnotationBody(annotation)
  return isTextualBody(body) ? body : undefined
}

function getResourceBody(annotation: Annotation): AnnotationResourceBody | undefined {
  const body = getAnnotationBody(annotation)
  return body && !isTextualBody(body) ? body : undefined
}

function getAnnotationType(annotation: Annotation): string | undefined {
  return getAnnotationBody(annotation)?.annotationType ?? undefined
}

// Always an array of target objects. A target given as plain IRI becomes a target without selector.
function getAnnotationTargets(annotation: Annotation): AnnotationTarget[] {
  return toArray(annotation?.target).map((target) =>
    typeof target === 'string' ? { source: target } : target
  ) as AnnotationTarget[]
}

// The embedded annotations of a page. Annotations given as plain IRIs are not resolved.
function getPageAnnotations(page: AnnotationPage | null | undefined): Annotation[] {
  return (page?.items ?? []).filter((item): item is EmbeddedAnnotation => typeof item === 'object')
}

function getPageWitnesses(page: AnnotationPage | null | undefined): Witness[] {
  const partOf = page?.partOf
  return typeof partOf === 'object' ? (partOf as AnnotationPagePartOf).refs ?? [] : []
}

function getFirstPageUrl(collection: AnnotationCollection): string | undefined {
  const { first } = collection
  return typeof first === 'object' ? first?.id : first
}

export {
  getAnnotationBody,
  isTextualBody,
  getTextualBody,
  getResourceBody,
  getAnnotationType,
  getAnnotationTargets,
  getPageAnnotations,
  getPageWitnesses,
  getFirstPageUrl
}
