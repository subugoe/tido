import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePanelStore } from '@/store/PanelStore.tsx'
import { decodeState } from './bookmarking.ts'
import { getShareUrl } from './share.ts'

const COLLECTION = 'https://example.org/collection.json'
const MANIFEST = 'https://example.org/manifest.json'
const ITEM = 'https://example.org/item-1.json'
const OTHER_ITEM = 'https://example.org/item-2.json'

function panel(overrides: object = {}): PanelState {
  return {
    id: 'panel-1',
    collectionId: COLLECTION,
    manifest: { id: MANIFEST },
    item: { id: ITEM },
    panelViews: [
      { key: 0, view: 'image', visible: false },
      { key: 1, view: 'text', visible: true, activeContentType: 'edited', preferredContentType: 'transcription' }
    ],
    ...overrides
  } as unknown as PanelState
}

function setPanels(panels: PanelState[]) {
  usePanelStore.setState({ panels })
}

async function stateOf(url: string) {
  return decodeState(new URL(url).searchParams.get('tido') ?? '')
}

describe('getShareUrl', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { location: { href: 'https://host.example/viewer?lang=de#top' } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    setPanels([])
  })

  it('adds the state as "tido" param to the current location', async () => {
    setPanels([panel()])

    const url = new URL(await getShareUrl())

    expect(url.origin + url.pathname).toBe('https://host.example/viewer')
    expect(url.searchParams.get('lang')).toBe('de')
    expect(url.hash).toBe('#top')
    expect(url.searchParams.get('tido')).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('describes each panel with its item, manifest and collection', async () => {
    setPanels([panel(), panel({ id: 'panel-2', item: { id: OTHER_ITEM } })])

    const state = await stateOf(await getShareUrl())

    expect(state.type).toBe('Annotation')
    expect(state.motivation).toEqual(['contentState'])
    expect(state.target).toHaveLength(2)
    expect(state.target[0]).toMatchObject({
      id: ITEM,
      type: 'Item',
      partOf: { id: MANIFEST, type: 'Manifest', partOf: { id: COLLECTION, type: 'Collection' } }
    })
    expect(state.target[1].id).toBe(OTHER_ITEM)
  })

  it('keeps the views and the selected annotation of a panel', async () => {
    setPanels([panel({ selectedAnnotation: { annotation: { id: 'https://example.org/annotation-7' }, origin: 'text' } })])

    const state = await stateOf(await getShareUrl())

    expect(state.target[0].state?.annotation).toBe('https://example.org/annotation-7')
    // a view carries its preferred content type, not the one shown as a fallback on this item
    expect(state.target[0].state?.views).toEqual([
      { visible: false },
      { visible: true, activeContentType: 'transcription' }
    ])
  })

  it('uses the base url instead of the current location when given', async () => {
    setPanels([panel()])

    const url = new URL(await getShareUrl({ baseUrl: 'https://other.example/edition/42?page=3' }))

    expect(url.origin + url.pathname).toBe('https://other.example/edition/42')
    expect(url.searchParams.get('page')).toBe('3')
    expect((await stateOf(url.toString())).target[0].id).toBe(ITEM)
  })

  it('replaces a state the url already has', async () => {
    setPanels([panel()])

    const url = new URL(await getShareUrl({ baseUrl: 'https://host.example/viewer?tido=outdated' }))

    expect(url.searchParams.getAll('tido')).toHaveLength(1)
    expect(url.searchParams.get('tido')).not.toBe('outdated')
  })

  it('reflects the panels at the time of the call', async () => {
    setPanels([panel()])
    const first = await getShareUrl()

    setPanels([panel({ item: { id: OTHER_ITEM } })])
    const second = await getShareUrl()

    expect(second).not.toBe(first)
    expect((await stateOf(second)).target[0].id).toBe(OTHER_ITEM)
  })

  it('returns a state without targets when no panel is open', async () => {
    setPanels([])

    expect((await stateOf(await getShareUrl())).target).toEqual([])
  })

  it('rejects while a panel is still loading', async () => {
    setPanels([panel(), panel({ id: 'panel-2', item: null, manifest: null })])

    await expect(getShareUrl()).rejects.toThrow('the panels are not loaded yet')
  })
})
