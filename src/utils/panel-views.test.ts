import { describe, expect, it } from 'vitest'
import { PanelView, PanelViewState, PanelViewType } from '@/types'
import {
  applyViewOverrides,
  viewOverrides,
  chooseContentType,
  configureViews,
  resolveViews,
  showContent,
  shownViews,
  textSources,
  visibleTextSources,
} from './panel-views.ts'

const url = (name: string, type: string) => `https://example.org/${name}/${type}.html`

function item(name: string, types: string[], withImage = false): Item {
  return {
    id: `https://example.org/${name}.json`,
    contents: types.map(type => ({ id: url(name, type), contentType: `text/html;type=${type}` })),
    ...(withImage && { images: [{ id: `https://example.org/${name}.jpg` }] }),
  } as unknown as Item
}

const text = (view: Partial<PanelView> = {}): PanelView => ({ view: 'text', ...view })
const image: PanelView = { view: 'image' }

const page1 = item('page1', ['transcription', 'edited'], true)
const page2 = item('page2', ['edited'])
const page3 = item('page3', ['transcription', 'edited'], true)

// resolves without omitting any view, unless hideEmptyViews is given
const resolve = (configured: PanelView[], on: Item, previous?: PanelViewState[], hideEmptyViews: PanelViewType[] = []) =>
  resolveViews({ configured, hideEmptyViews, item: on, previous })

const pick = (views: PanelViewState[]) => views.map(({ key, view, activeContentType, visible }) => ({ key, view, activeContentType, visible }))

describe('resolveViews on the first item', () => {
  it('shows the configured content type', () => {
    expect(resolve([text({ activeContentType: 'edited' })], page1)[0])
      .toMatchObject({ key: 0, activeContentType: 'edited', preferredContentType: 'edited', contentTypes: ['transcription', 'edited'] })
  })

  it('falls back to the first content type offered when none is configured or the configured one is not offered', () => {
    expect(resolve([text()], page1)[0].activeContentType).toBe('transcription')
    expect(resolve([text({ activeContentType: 'translation' })], page1)[0].activeContentType).toBe('transcription')
  })

  it('narrows configured content types to the item and reports them missing when none is offered', () => {
    expect(resolve([text({ contentTypes: ['edited', 'translation'] })], page1)[0].contentTypes).toEqual(['edited'])
    expect(resolve([text({ contentTypes: ['translation'] })], page1)[0])
      .toMatchObject({ contentTypes: [], activeContentType: undefined, missingContentTypes: ['translation'] })
  })

  it('keys the views by their configured position', () => {
    expect(resolve([image, text(), text({ activeContentType: 'edited' })], page1).map(v => v.key)).toEqual([0, 1, 2])
  })
})

describe('resolveViews on item navigation', () => {
  const configured = [text({ activeContentType: 'transcription' })]

  it('keeps a preference the next item does not offer, and applies it again on an item that does', () => {
    const first = chooseContentType(resolve(configured, page1), 0, 'edited')
    const second = resolve(configured, page2, first)
    expect(second[0]).toMatchObject({ activeContentType: 'edited', preferredContentType: 'edited' })

    const third = resolve(configured, item('page4', ['transcription']), second)
    expect(third[0]).toMatchObject({ activeContentType: 'transcription', preferredContentType: 'edited' })

    expect(resolve(configured, page3, third)[0].activeContentType).toBe('edited')
  })

  it('falls back to the configured content type when the preferred one is not offered', () => {
    const views = [text({ activeContentType: 'edited' })]
    const first = chooseContentType(resolve(views, page1), 0, 'transcription')
    expect(resolve(views, page2, first)[0].activeContentType).toBe('edited')
  })

  it('keeps a view the user hid', () => {
    const first = resolve([text(), image], page1).map(v => v.key === 1 ? { ...v, visible: false } : v)
    expect(resolve([text(), image], page3, first)[1].visible).toBe(false)
  })

  it('never takes the offered content types from the previous item', () => {
    expect(resolve([text()], page2, resolve([text()], page1))[0].contentTypes).toEqual(['edited'])
  })
})

describe('resolveViews and hideEmptyViews', () => {
  const configured = [text(), image, text({ contentTypes: ['transcription'] })]

  it('omits the empty views of the given kinds, keeping them in the state with their keys', () => {
    const views = resolve(configured, page2, undefined, ['image', 'text'])
    expect(views.map(v => [v.key, !!v.omitted])).toEqual([[0, false], [1, true], [2, true]])
    expect(shownViews(views).map(v => v.key)).toEqual([0])
  })

  it('only omits the kinds given - an empty image view stays to show its empty state', () => {
    const views = resolve(configured, page2, undefined, ['text'])
    expect(shownViews(views).map(v => v.key)).toEqual([0, 1])
  })

  it('omits nothing on an item every view has something to show for', () => {
    expect(shownViews(resolve(configured, page1, undefined, ['image', 'text']))).toHaveLength(3)
  })

  it('can leave a panel without any view shown', () => {
    const views = resolve([image, text({ contentTypes: ['translation'] })], page2, undefined, ['image', 'text'])
    expect(shownViews(views)).toEqual([])
  })

  it('hands over what was changed on an omitted view to the next item', () => {
    const first = chooseContentType(resolve(configured, page1, undefined, ['image', 'text']), 0, 'edited')
      .map(v => v.key === 1 ? { ...v, visible: false } : v)
    const second = resolve(configured, page2, first, ['image', 'text'])
    const third = resolve(configured, page3, second, ['image', 'text'])

    expect(pick(third)).toEqual([
      { key: 0, view: 'text', activeContentType: 'edited', visible: true },
      { key: 1, view: 'image', activeContentType: undefined, visible: false },
      { key: 2, view: 'text', activeContentType: 'transcription', visible: true },
    ])
    expect(third.some(v => v.omitted)).toBe(false)
  })
})

describe('chooseContentType', () => {
  it('shows the chosen content type and makes it the preferred one, leaving the other views alone', () => {
    const views = resolve([text(), text()], page1)
    const chosen = chooseContentType(views, 1, 'edited')
    expect(chosen[1]).toMatchObject({ activeContentType: 'edited', preferredContentType: 'edited' })
    expect(chosen[0]).toBe(views[0])
  })
})

describe('showContent', () => {
  const configured = [text({ contentTypes: ['transcription'] }), text({ contentTypes: ['edited'] })]

  it('makes the view that already shows the content visible', () => {
    const views = resolve(configured, page1).map(v => ({ ...v, visible: false }))
    expect(pick(showContent(views, page1, url('page1', 'edited')))).toEqual([
      { key: 0, view: 'text', activeContentType: 'transcription', visible: false },
      { key: 1, view: 'text', activeContentType: 'edited', visible: true },
    ])
  })

  it('switches the first view offering the content type to it, as preferred one, and makes it visible', () => {
    const views = resolve([text({ visible: false }), text()], page1)
    const shown = showContent(views, page1, url('page1', 'edited'))
    expect(shown[0]).toMatchObject({ activeContentType: 'edited', preferredContentType: 'edited', visible: true })
    expect(shown[1]).toBe(views[1])
  })

  it('appends a text view when no view offers the content type', () => {
    const shown = showContent(resolve([text({ contentTypes: ['transcription'] })], page1), page1, url('page1', 'edited'))
    expect(shown).toHaveLength(2)
    expect(shown[1]).toMatchObject({
      key: 1, view: 'text', appended: true, label: 'edited', visible: true,
      contentTypes: ['transcription', 'edited'], activeContentType: 'edited', preferredContentType: 'edited',
    })
  })

  it('leaves the views alone when the item has no such content', () => {
    const views = resolve(configured, page1)
    expect(showContent(views, page1, 'https://example.org/unknown.html')).toBe(views)
  })
})

describe('appended views', () => {
  const configured = [image, text({ contentTypes: ['transcription'] })]

  it('stay with the panel on the next items and come after the configured views', () => {
    const first = showContent(resolve(configured, page1, undefined, ['image']), page1, url('page1', 'edited'))
    const second = resolve(configured, page2, first, ['image'])
    const third = resolve(configured, page3, second, ['image'])

    expect(pick(shownViews(second))).toEqual([
      { key: 1, view: 'text', activeContentType: undefined, visible: true },
      { key: 2, view: 'text', activeContentType: 'edited', visible: true },
    ])
    expect(pick(third).map(v => v.key)).toEqual([0, 1, 2])
    expect(third[2]).toMatchObject({ appended: true, label: 'edited', contentTypes: ['transcription', 'edited'] })
  })

  it('get a key of their own while a view is omitted', () => {
    const views = showContent(resolve(configured, page2, undefined, ['image']), page2, url('page2', 'edited'))
    expect(views.map(v => v.key)).toEqual([0, 1, 2])
  })
})

describe('bookmarks', () => {
  const configured = [image, text({ activeContentType: 'transcription' })]

  it('apply visibility and content type to the configured views by view key', () => {
    expect(applyViewOverrides(configured, [{ visible: false }, { activeContentType: 'edited' }])).toEqual([
      { view: 'image', visible: false },
      { view: 'text', activeContentType: 'edited' },
    ])
  })

  it('keep the configured content type when the bookmark has none', () => {
    expect(applyViewOverrides(configured, [{}, { visible: true }])[1]).toMatchObject({ activeContentType: 'transcription', visible: true })
  })

  it('turn bookmarked views beyond the configured ones into text views offering every content type', () => {
    const views = applyViewOverrides(configured, [{}, {}, { activeContentType: 'edited', visible: true }])
    expect(views[2]).toEqual({ view: 'text', label: 'edited', activeContentType: 'edited', visible: true })
    expect(resolve(views, page1)[2]).toMatchObject({ contentTypes: ['transcription', 'edited'], activeContentType: 'edited' })
  })

  it('leave what the bookmark does not give to the configured view', () => {
    expect(applyViewOverrides(configured, [{ visible: undefined }, {}])).toEqual(configured)
  })

  it('hold every view by its key, omitted ones too', () => {
    const views = resolve(configured, page2, undefined, ['image', 'text'])
    expect(viewOverrides(views)).toEqual([{ visible: true }, { visible: true, activeContentType: 'transcription' }])
  })

  it('round-trip the preference and the appended views, not a fallback shown on the bookmarked item', () => {
    // prefers 'translation', which page1 does not offer - it shows 'transcription' as fallback there
    const textOnly = [text({ contentTypes: ['transcription', 'translation'], activeContentType: 'translation' })]
    const onPage1 = showContent(resolve(textOnly, page1), page1, url('page1', 'edited'))
    expect(pick(onPage1)).toEqual([
      { key: 0, view: 'text', activeContentType: 'transcription', visible: true },
      { key: 1, view: 'text', activeContentType: 'edited', visible: true },
    ])

    const reloaded = resolve(applyViewOverrides(textOnly, viewOverrides(onPage1)), item('page5', ['transcription', 'translation', 'edited']))
    expect(pick(reloaded)).toEqual([
      { key: 0, view: 'text', activeContentType: 'translation', visible: true },
      { key: 1, view: 'text', activeContentType: 'edited', visible: true },
    ])
  })
})

describe('textSources', () => {
  const configured = [image, text(), text({ activeContentType: 'edited' }), text({ activeContentType: 'edited' })]
  const views = resolve(configured, page1).map(v => v.key === 2 ? { ...v, visible: false } : v)
  const panel = { panelViews: views, item: page1 }

  it('lists one source per text view showing a content, in view order and with its visibility', () => {
    expect(textSources(panel)).toEqual([
      { viewKey: 1, contentUrl: url('page1', 'transcription'), visible: true },
      { viewKey: 2, contentUrl: url('page1', 'edited'), visible: false },
      { viewKey: 3, contentUrl: url('page1', 'edited'), visible: true },
    ])
  })

  it('lists only the visible ones in visibleTextSources, without removing duplicates', () => {
    expect(visibleTextSources(panel).map(s => s.viewKey)).toEqual([1, 3])
  })

  it('leaves out text views showing nothing and panels without item', () => {
    expect(textSources({ panelViews: resolve([text({ contentTypes: ['translation'] })], page1), item: page1 })).toEqual([])
    expect(textSources({ panelViews: views, item: null })).toEqual([])
  })
})

describe('configureViews', () => {
  const global = { panelViews: [image, text({ label: 'Text', activeContentType: 'transcription' })], hideEmptyViews: ['image', 'text'] as PanelViewType[] }

  it('takes the global panel views and hideEmptyViews when the panel has none', () => {
    expect(configureViews(global)).toEqual({
      configured: [{ ...image, widthRatio: undefined }, { ...global.panelViews[1], widthRatio: undefined }],
      hideEmptyViews: ['image', 'text'],
    })
  })

  it('takes the views and hideEmptyViews of the panel instead, without anything of the global ones', () => {
    const { configured, hideEmptyViews } = configureViews(global, { views: [image, text({ activeContentType: 'edited' })], hideEmptyViews: [] })
    expect(configured[1]).toEqual({ view: 'text', activeContentType: 'edited', widthRatio: undefined })
    expect(hideEmptyViews).toEqual([])
  })

  it('gives each view its width ratio, or none when the ratio does not fit the views', () => {
    expect(configureViews(global, { viewsWidthRatio: [1, '3'] as unknown as number[] }).configured.map(v => v.widthRatio)).toEqual([1, 3])
    expect(configureViews(global, { viewsWidthRatio: [1] }).configured.map(v => v.widthRatio)).toEqual([undefined, undefined])
  })
})
