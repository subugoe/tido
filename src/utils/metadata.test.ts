import { describe, expect, it } from 'vitest'
import { getItemMetadata, splitMetadataHeading } from './metadata.ts'

const meta = (key: string, value: Metadata['value']): Metadata => ({ key, textapiType: 'TextApiMetadata', value })

describe('splitMetadataHeading', () => {
  it('uses the first title as heading and keeps further titles as fields', () => {
    const { heading, fields } = splitMetadataHeading([
      meta('title', 'First'),
      meta('title', 'Second'),
      meta('collectors', 'Jane Doe'),
    ])
    expect(heading).toBe('First')
    expect(fields).toEqual([meta('title', 'Second'), meta('collectors', 'Jane Doe')])
  })

  it('uses a label when there is no title', () => {
    const { heading, fields } = splitMetadataHeading([meta('language', 'deu'), meta('label', 'fol. 1r')])
    expect(heading).toBe('fol. 1r')
    expect(fields).toEqual([meta('language', 'deu')])
  })

  it('skips empty and nested values', () => {
    const nested = meta('label', [meta('x', 'y')])
    const { heading, fields } = splitMetadataHeading([meta('label', ''), nested])
    expect(heading).toBeNull()
    expect(fields).toHaveLength(2)
  })
})

describe('getItemMetadata', () => {
  it('reads the label from the division', () => {
    const item = { division: 'fol. 1r', titles: ['Other title'], revision: 'r1' } as unknown as Item
    expect(getItemMetadata(item)).toContainEqual(meta('label', 'fol. 1r'))
  })

  it('leaves the label out when there is no division', () => {
    const item = { titles: ['Other title'] } as unknown as Item
    expect(getItemMetadata(item).find((m) => m.key === 'label')).toBeUndefined()
  })
})
