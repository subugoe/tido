// Generates src/types/annotation.d.ts from the Annotation API OpenAPI schema.
// Usage: node .build/generate-annotation-types.js [schema-url] [output-path]

import { writeFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SCHEMA_URL = process.argv[2] || 'https://editions.sub.uni-goettingen.de/annotationapi-specs/0.1.0/schema.json'
const OUTPUT_PATH = resolve(__dirname, '..', process.argv[3] || 'src/types/annotation.d.ts')
const TEXTAPI_TYPES_PATH = resolve(__dirname, '../src/types/textapi.d.ts')
const INDEX_TYPES_PATH = resolve(__dirname, '../src/types/index.d.ts')

// Generic API response types that are already declared globally in textapi.d.ts
const SKIP = new Set(['ErrorMessage', 'HTTPValidationError', 'ValidationError'])

// Schema names that are too generic or collide with TextAPI globals (e.g. Collection)
const RENAME = {
  Collection: 'AnnotationCollection',
  Page: 'AnnotationPage',
  EmbeddedCollection: 'EmbeddedAnnotationCollection',
  EmbeddedPage: 'EmbeddedAnnotationPage',
  Source: 'AnnotationTargetSource',
}

const INDENT = '  '

const refName = (ref) => ref.split('/').pop()

// TIDO only reads from the API, so we only generate the response models: FastAPI's "-Output" variants
// (exposed without suffix) and plain models. "-Input" variants and request bodies ("Input…") are skipped.
const isInputSchema = (name) => name.endsWith('-Input') || name.startsWith('Input')

const buildNameMap = (schemas) => Object.fromEntries(
  Object.keys(schemas)
    .filter((name) => !isInputSchema(name))
    .map((name) => {
      const base = name.replace(/-Output$/, '')
      return [name, RENAME[base] ?? base]
    }),
)

const isValidIdentifier = (key) => /^[A-Za-z_$][\w$]*$/.test(key)

const literal = (value) => (typeof value === 'string' ? `'${value.replace(/'/g, '\\\'')}'` : JSON.stringify(value))

const wrapUnion = (type) => (type.includes(' | ') && !type.startsWith('{') ? `(${type})` : type)

const unique = (items) => [...new Set(items)]

const toType = (schema, names, depth) => {
  if (!schema || Object.keys(schema).filter((k) => !['title', 'description', 'default'].includes(k)).length === 0) {
    return 'unknown'
  }
  if (schema.$ref) return names[refName(schema.$ref)]
  if (schema.const !== undefined) return literal(schema.const)
  if (schema.enum) return schema.enum.map(literal).join(' | ')

  const variants = schema.anyOf ?? schema.oneOf ?? schema.allOf
  if (variants) {
    const joiner = schema.allOf ? ' & ' : ' | '
    const types = unique(variants.map((v) => toType(v, names, depth)))
    return types.includes('unknown') ? 'unknown' : types.join(joiner)
  }

  if (Array.isArray(schema.type)) {
    return unique(schema.type.map((t) => toType({ ...schema, type: t }, names, depth))).join(' | ')
  }

  switch (schema.type) {
    case 'string': return 'string'
    case 'integer':
    case 'number': return 'number'
    case 'boolean': return 'boolean'
    case 'null': return 'null'
    case 'array': return `${wrapUnion(toType(schema.items, names, depth))}[]`
    case 'object':
      if (!schema.properties) return 'Record<string, unknown>'
      return `{\n${renderProperties(schema, names, depth + 1)}\n${INDENT.repeat(depth)}}`
    default: return 'unknown'
  }
}

const renderDoc = (schema, indent, { withTitle = true } = {}) => {
  const lines = []
  if (withTitle && schema.title) lines.push(schema.title)
  if (schema.format) lines.push(`Format: ${schema.format}`)
  if (schema.description) {
    const [first, ...rest] = schema.description.trim().split('\n')
    lines.push(`@description ${first}`, ...rest)
  }
  if (schema.default !== undefined) {
    const value = typeof schema.default === 'string' ? schema.default : JSON.stringify(schema.default)
    lines.push(`@default ${value}`)
  }
  if (schema.const !== undefined) lines.push('@constant')
  if (lines.length === 0) return ''
  if (lines.length === 1) return `${indent}/** ${lines[0]} */\n`
  return `${indent}/**\n${lines.map((l) => `${indent} * ${l}`.trimEnd()).join('\n')}\n${indent} */\n`
}

// Lift the format of nested strings (e.g. `anyOf: [{ type: 'string', format: 'uri' }, { type: 'null' }]`)
// to the property doc, as long as every non-null variant shares it
const findFormat = (schema) => {
  if (!schema) return undefined
  if (schema.format) return schema.format
  if (schema.type === 'array') return findFormat(schema.items)
  const variants = (schema.anyOf ?? schema.oneOf)?.filter((v) => v.type !== 'null')
  if (!variants?.length) return undefined
  const formats = unique(variants.map(findFormat))
  return formats.length === 1 ? formats[0] : undefined
}

const renderProperties = (schema, names, depth) => {
  const indent = INDENT.repeat(depth)
  const required = new Set(schema.required ?? [])
  return Object.entries(schema.properties).map(([key, prop]) => {
    const name = isValidIdentifier(key) ? key : literal(key)
    const optional = required.has(key) ? '' : '?'
    const doc = renderDoc({ ...prop, format: findFormat(prop) }, indent)
    return `${doc}${indent}${name}${optional}: ${toType(prop, names, depth)}`
  }).join('\n')
}

const renderSchema = (schemaName, schema, names) => {
  const name = names[schemaName]
  const doc = renderDoc({ ...schema, title: schema.title ?? name }, INDENT)
  if (schema.type === 'object' && schema.properties) {
    return `${doc}${INDENT}interface ${name} {\n${renderProperties(schema, names, 2)}\n${INDENT}}`
  }
  return `${doc}${INDENT}type ${name} = ${toType(schema, names, 1)}`
}

const declaredGlobals = (path) => {
  const content = readFileSync(path, 'utf-8')
  return new Set([...content.matchAll(/^\s*(?:interface|type)\s+(\w+)/gm)].map((m) => m[1]))
}

const main = async () => {
  const response = await fetch(SCHEMA_URL)
  if (!response.ok) throw new Error(`Failed to fetch ${SCHEMA_URL}: ${response.status} ${response.statusText}`)
  const spec = await response.json()
  const schemas = spec.components?.schemas
  if (!schemas) throw new Error('No components.schemas found in the schema.')

  const names = buildNameMap(schemas)
  const emitted = new Set()
  const declarations = []

  Object.keys(schemas)
    .filter((schemaName) => names[schemaName] && !SKIP.has(schemaName))
    .sort((a, b) => names[a].localeCompare(names[b]))
    .forEach((schemaName) => {
      emitted.add(names[schemaName])
      declarations.push(renderSchema(schemaName, schemas[schemaName], names))
    })

  const header = [
    '// This file is generated by .build/generate-annotation-types.js — do not edit by hand.',
    `// Source: ${SCHEMA_URL} (version ${spec.info?.version ?? 'unknown'})`,
  ].join('\n')

  writeFileSync(OUTPUT_PATH, `${header}\n\ndeclare global {\n${declarations.join('\n')}\n}\n\nexport {}\n`)
  console.log(`Wrote ${emitted.size} types to ${OUTPUT_PATH}`)

  const textApiClashes = [...emitted].filter((n) => declaredGlobals(TEXTAPI_TYPES_PATH).has(n))
  if (textApiClashes.length) console.warn(`Warning: also declared in textapi.d.ts: ${textApiClashes.join(', ')}`)

  const indexClashes = [...emitted].filter((n) => declaredGlobals(INDEX_TYPES_PATH).has(n))
  if (indexClashes.length) console.warn(`Warning: also declared in index.d.ts, remove them there: ${indexClashes.join(', ')}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
