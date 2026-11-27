import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TFunction } from 'i18next'
import { TidoConfig } from '@/types'
import { mergeAndValidateConfig } from './config.ts'
import { defaultConfig } from './default-config.ts'

const t = ((key: string) => key) as unknown as TFunction

// the user config is unknown input, so the values do not have to match the config types
function validate(userConfig: Record<string, unknown>) {
  return mergeAndValidateConfig(userConfig as Partial<TidoConfig>, defaultConfig, { lang: 'en', translations: {} }, t)
}

describe('config: showShareButton', () => {
  beforeEach(() => {
    // the config looks for a bookmarked state at the current location
    vi.stubGlobal('window', { location: { href: 'https://host.example/viewer' } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the share button by default', async () => {
    const { config, errors } = await validate({})

    expect(config.showShareButton).toBe(true)
    expect(errors).not.toHaveProperty('showShareButton')
  })

  it('hides the share button when set to false', async () => {
    const { config, errors } = await validate({ showShareButton: false })

    expect(config.showShareButton).toBe(false)
    expect(errors).not.toHaveProperty('showShareButton')
  })

  it('falls back to the default and reports an error for a non-boolean', async () => {
    const { config, errors } = await validate({ showShareButton: 'false' })

    expect(config.showShareButton).toBe(true)
    expect(errors).toHaveProperty('showShareButton', 'must be a boolean')
  })
})

describe('config: showContentTypesToggle of the panel views', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { location: { href: 'https://host.example/viewer' } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is set on the text view of the default panel views', async () => {
    const { config } = await validate({})

    expect(config.panelViews.find(view => view.view === 'text')?.showContentTypesToggle).toBe(true)
  })

  it('defaults to true on text views that do not set it, globally and per panel', async () => {
    const views = [{ view: 'image' }, { view: 'text' }]
    const { config, errors } = await validate({ panelViews: views, panels: [{ views }] })

    expect(config.panelViews.map(view => view.showContentTypesToggle)).toEqual([undefined, true])
    expect(config.panels[0].views?.map(view => view.showContentTypesToggle)).toEqual([undefined, true])
    expect(Object.keys(errors).filter(key => key.includes('showContentTypesToggle'))).toEqual([])
  })

  it('keeps a boolean', async () => {
    const views = [{ view: 'text', showContentTypesToggle: false }]
    const { config } = await validate({ panelViews: views, panels: [{ views }] })

    expect(config.panelViews[0].showContentTypesToggle).toBe(false)
    expect(config.panels[0].views?.[0].showContentTypesToggle).toBe(false)
  })

  it('falls back to the default and reports an error for a non-boolean', async () => {
    const views = [{ view: 'image' }, { view: 'text', showContentTypesToggle: 'false' }]
    const { config, errors } = await validate({ panelViews: views, panels: [{ views }] })

    expect(config.panelViews[1].showContentTypesToggle).toBe(true)
    expect(config.panels[0].views?.[1].showContentTypesToggle).toBe(true)
    expect(errors).toHaveProperty(['panelViews[1].showContentTypesToggle'], 'must be a boolean')
    expect(errors).toHaveProperty(['panels[0].views[1].showContentTypesToggle'], 'must be a boolean')
  })
})

describe('config: the annotations view', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { location: { href: 'https://host.example/viewer' } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reports a second annotations view - only the first one counts', async () => {
    const views = [{ view: 'annotations' }, { view: 'text' }, { view: 'annotations' }]
    const { config, errors } = await validate({ panelViews: views, panels: [{ views }] })

    // kept, so the view keys of a bookmark stay valid
    expect(config.panelViews).toHaveLength(3)
    expect(errors).toHaveProperty(['panelViews[2]'], 'only the first annotations view counts - this one is ignored')
    expect(errors).toHaveProperty(['panels[0].views[2]'], 'only the first annotations view counts - this one is ignored')
    expect(errors).not.toHaveProperty(['panelViews[0]'])
  })

  describe('migrates the former panels[i].showSidebar', () => {
    it('to the visibility of the annotations view of the panel', async () => {
      const views = [{ view: 'text' }, { view: 'annotations' }]
      const { config, errors } = await validate({ panels: [{ views, showSidebar: true }] })

      expect(config.panels[0].views?.[1]).toEqual({ view: 'annotations', visible: true })
      expect(config.panels[0]).not.toHaveProperty('showSidebar')
      expect(errors).toHaveProperty(['panels[0].showSidebar'])
    })

    it('to the global panel views when the panel has none', async () => {
      const panelViews = [{ view: 'text' }, { view: 'annotations' }]
      const { config } = await validate({ panelViews, panels: [{ showSidebar: true }] })

      expect(config.panels[0].views?.map(view => [view.view, view.visible])).toEqual([['text', undefined], ['annotations', true]])
      expect(config.panelViews[1].visible).toBeUndefined()
    })

    it('by adding an annotations view when the panel views have none, as the panel had annotations before', async () => {
      const { config } = await validate({ panelViews: [{ view: 'text' }], panels: [{ showSidebar: false }] })

      expect(config.panels[0].views?.map(view => [view.view, view.visible])).toEqual([['text', undefined], ['annotations', false]])
    })
  })
})
