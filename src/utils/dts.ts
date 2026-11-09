import { apiRequest } from '@/utils/api.ts'
import { SUPPORTED_MIME_TYPES } from '@/utils/constants.ts'

// Bridge between DTS (https://dtsapi.org) and the TextAPI-shaped objects the rest of the app
// consumes. DTS responses are detected by their `@type` marker and normalized into
// Collection/Manifest/Item shapes, so stores, tree and panels stay API-agnostic.

// DTS entry point responses only hand out endpoint URI templates.
interface DtsEntryPoint {
  collection: string
}

interface DtsMember {
  '@id': string
  '@type': 'Collection' | 'Resource'
  title?: string
  description?: string
  collection?: string
  navigation?: string
  document?: string
  mediaTypes?: string[]
  dublinCore?: Record<string, unknown>
}

interface DtsCollectionResponse extends DtsMember {
  member?: DtsMember[]
  view?: { next?: string }
}

// Maximum number of paginated member pages followed for one collection.
const MAX_PAGES = 50

// Minimal RFC 6570 expansion: handles {?a,b}, {&a,b}, {;a,b}, {/a,b} and {a,b} with single
// values only. Undefined variables are omitted, an expansion without any defined variable is
// dropped entirely.
// shortcut: no composite ({var*}) or reserved ({+var}) support, upgrade when a DTS server needs it
function expandTemplate(template: string, vars: Record<string, string> = {}): string {
  const pattern = /\{([?&/;]?)([a-zA-Z0-9_]+(?:,[a-zA-Z0-9_]+)*)\}/g
  let result = ''
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(template)) !== null) {
    result += template.slice(cursor, match.index)
    cursor = match.index + match[0].length

    const defined = match[2].split(',').filter(name => vars[name] !== undefined)
    if (defined.length === 0) continue

    const values = defined.map(name => encodeURIComponent(vars[name]))
    if (!match[1]) result += values.join(',')
    else if (match[1] === '/') result += '/' + values.join('/')
    else if (match[1] === ';') result += defined.map((name, i) => `;${name}=${values[i]}`).join('')
    else {
      // DoTS templates append {?...} after an existing query (?resource=x{?ref,...}),
      // so the ? operator must degrade to & once a query is present.
      const prefix = match[1] === '&' || result.includes('?') ? '&' : '?'
      result += prefix + defined.map((name, i) => `${name}=${values[i]}`).join('&')
    }
  }

  return result + template.slice(cursor)
}

function resolveUrl(url: string, base: string): string {
  try {
    return new URL(url, base).toString()
  } catch {
    return url
  }
}

type DtsResponseKind = 'collection' | 'resource' | 'entry'

function detectDtsResponse(raw: unknown): DtsResponseKind | null {
  if (!raw || typeof raw !== 'object') return null
  const type = (raw as Record<string, unknown>)['@type']
  if (type === 'Resource') return 'resource'
  if (type === 'EntryPoint') return 'entry'
  if (type === 'Collection') return 'collection'
  return null
}

// dublinCore values can be literals, URIs, arrays of either, or localized {lang, value}
// objects. They are flattened to plain strings for the TextAPI metadata shape.
function flattenMetadataValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(flattenMetadataValue).filter(Boolean).join(', ')
  if (value && typeof value === 'object') {
    const localized = (value as Record<string, unknown>).value
    return typeof localized === 'string' ? localized : ''
  }
  return value === undefined || value === null ? '' : String(value)
}

function dublinCoreToMetadata(dublinCore: Record<string, unknown> | undefined): Metadata[] {
  if (!dublinCore) return []
  return Object.entries(dublinCore).map(([key, value]) => ({
    key,
    textapiType: 'TextApiMetadata',
    value: flattenMetadataValue(value)
  }))
}

function getMemberTitle(member: DtsMember): string {
  return typeof member.title === 'string' ? member.title : ''
}

// Member urls: Resource members carry their `collection` endpoint, plain Collection members
// often do not (e.g. DoTS) - then the inherited collection template, or the request url
// pattern as a last resort, is used to build the endpoint from the member id.
function getMemberUrl(member: DtsMember, requestUrl: string, collectionTemplate?: string): string {
  const id = member['@id'] ?? ''

  if (member.collection) return resolveUrl(expandTemplate(member.collection), requestUrl)
  if (/^https?:\/\//i.test(id)) return id
  if (collectionTemplate) return resolveUrl(expandTemplate(collectionTemplate, { id }), requestUrl)

  try {
    const url = new URL(requestUrl)
    url.search = `id=${encodeURIComponent(id)}`
    return url.toString()
  } catch {
    return id
  }
}

// A DTS Resource (one readable document) becomes a TextAPI manifest with a single item that
// carries the full document url as its content. When the resource offers text/html, that
// media type is requested explicitly, since it renders cleaner than raw TEI/XML.
function normalizeDtsResource(raw: DtsMember, requestUrl: string): Manifest {
  const title = getMemberTitle(raw)
  const mediaTypes = raw.mediaTypes ?? []

  // The plain document url is used without an explicit mediaType request: servers like DoTS
  // reject the parameter (404) and serve TEI at the plain url, which the tei transform renders.
  const documentUrl = resolveUrl(expandTemplate(raw.document ?? ''), requestUrl)
  const contentType = mediaTypes.find(type => SUPPORTED_MIME_TYPES.includes(type)) ?? 'text/xml'

  const item = {
    id: documentUrl,
    textapiType: 'TextApiItem',
    textItemType: 'full',
    contents: [{ id: documentUrl, contentType }],
    division: title,
    titles: title ? [title] : null,
    languages: [],
    annotationCollection: null,
    images: null,
    created: '',
    modified: '',
    revision: '',
    textapiVersion: '2.0.0'
  } as unknown as Item

  const id = raw.collection
    ? resolveUrl(expandTemplate(raw.collection), requestUrl)
    : resolveUrl(raw['@id'], requestUrl)

  return {
    id,
    textapiType: 'TextApiManifest',
    titles: title ? [title] : [],
    description: raw.description ?? null,
    metadata: dublinCoreToMetadata(raw.dublinCore),
    agents: [],
    items: [item],
    total: 1,
    license: '',
    created: '',
    modified: '',
    revision: '',
    textapiVersion: '2.0.0',
    annotationCollection: null
  } as unknown as Manifest
}

async function normalizeDtsCollection(
  raw: DtsCollectionResponse,
  requestUrl: string,
  collectionTemplate?: string
): Promise<Collection> {
  const template = raw.collection ?? collectionTemplate

  // Follow pagination and merge members, so the tree shows the complete sequence.
  let page: DtsCollectionResponse = raw
  const members: DtsMember[] = []
  for (let i = 0; i < MAX_PAGES; i++) {
    members.push(...(page.member ?? []))
    if (!page.view?.next) break
    page = await apiRequest<DtsCollectionResponse>(resolveUrl(expandTemplate(page.view.next), requestUrl))
  }

  const collections = members
    .filter(member => member['@type'] === 'Collection')
    .map(member => ({
      id: getMemberUrl(member, requestUrl, template),
      shortTitle: getMemberTitle(member),
      textapiType: 'TextApiCollection'
    }))

  const manifests = members
    .filter(member => member['@type'] === 'Resource')
    .map(member => normalizeDtsResource(member, requestUrl))

  const title = getMemberTitle(raw)

  return {
    id: requestUrl,
    textapiType: 'TextApiCollection',
    titles: title ? [title] : [],
    description: raw.description ?? null,
    metadata: dublinCoreToMetadata(raw.dublinCore),
    collectors: [],
    created: '',
    modified: '',
    revision: '',
    total: members.length,
    textapiVersion: '2.0.0',
    collections,
    manifests
  } as unknown as Collection
}

export {
  detectDtsResponse,
  expandTemplate,
  normalizeDtsCollection,
  normalizeDtsResource,
  resolveUrl
}
export type { DtsCollectionResponse, DtsEntryPoint, DtsMember }
