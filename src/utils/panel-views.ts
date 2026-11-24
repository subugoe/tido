import { PanelConfig, PanelView, PanelViewState, PanelViewType, TidoConfig } from '@/types'
import { SUPPORTED_MIME_TYPES } from './constants'

// Panel views: which views a panel shows on its current item, which content type each text view shows
// and which content that is. The only place these are decided - see "Panels and views" and "Content types"
// in CONTEXT.md. Pure: everything comes in as data, nothing is read from the stores.

export interface ResolveViewsInput {
  // the panel views of the panel as configured, by their view key
  configured: PanelView[]
  // the kinds of views left out on an item they have nothing to show for
  hideEmptyViews: PanelViewType[]
  item: Item
  // the view states of the panel on the item shown before - they only hand over what was changed on
  // them: the visibility, the preferred content type and the appended views
  previous?: PanelViewState[]
}

// The content a text view shows on the current item
export interface TextSource {
  viewKey: number
  contentUrl: string
  visible: boolean
}

// The viewsWidthRatio of a panel as positive numbers, one per view - null when it is not set or does not
// fit the views, in which case the views share the panel width equally. Values from the url are strings.
function getViewsWidthRatio(viewsWidthRatio: unknown, viewsCount: number): number[] | null {
  if (viewsWidthRatio === undefined) return null

  const ratios = Array.isArray(viewsWidthRatio) ? viewsWidthRatio.map(Number) : []
  if (ratios.length !== viewsCount || ratios.some(r => !Number.isFinite(r) || r <= 0)) {
    console.warn(`viewsWidthRatio must have one positive number for each of the ${viewsCount} views - the views get equal widths`)
    return null
  }

  return ratios
}

// The configured panel views of a panel, local first: its own views when it has any - the global panelViews
// are not looked at then - else the global ones, each with its width ratio. The same for hideEmptyViews.
export function configureViews(
  config: Pick<TidoConfig, 'panelViews' | 'hideEmptyViews'>,
  panel: Pick<PanelConfig, 'views' | 'viewsWidthRatio' | 'hideEmptyViews'> = {},
): Pick<ResolveViewsInput, 'configured' | 'hideEmptyViews'> {
  const views = panel.views?.length > 0 ? panel.views : config.panelViews
  const ratios = getViewsWidthRatio(panel.viewsWidthRatio, views.length)

  return {
    configured: views.map((view, i) => ({ ...view, widthRatio: ratios?.[i] })),
    hideEmptyViews: panel.hideEmptyViews ?? config.hideEmptyViews,
  }
}

// The view states of a panel as overrides of its panel views, by view key - for a bookmark or a new panel.
// Every view is part of it, omitted ones too, with its preferred content type - never a fallback shown on
// this item - as activeContentType.
export function viewOverrides(views: PanelViewState[]): Partial<PanelView>[] {
  return views.map(({ visible, preferredContentType }) => ({
    visible,
    ...(preferredContentType && { activeContentType: preferredContentType }),
  }))
}

// The panel views with overrides applied, by view key: what an override gives for a view overrides the
// configured view, as local config overrides global config. Overrides beyond the configured views are views
// appended to the panel while it was open - they become text views of it, offering every content type.
export function applyViewOverrides(configured: PanelView[], overrides: Partial<PanelView>[]): PanelView[] {
  const given = (view: Partial<PanelView> = {}) => Object.fromEntries(Object.entries(view).filter(([, value]) => value !== undefined))
  const views = configured.map((view, key) => ({ ...view, ...given(overrides[key]) }))
  const appended = overrides.slice(configured.length)
    .map((view): PanelView => ({ view: 'text', label: view.activeContentType, ...given(view) }))

  return [...views, ...appended]
}

// The panel views of a new panel on an item, showing the given content (see showContent) - for a panel
// opened from a cross-reference or a synopsis selection
export function viewsShowingContent(
  { configured, hideEmptyViews }: Pick<ResolveViewsInput, 'configured' | 'hideEmptyViews'>,
  item: Item,
  contentUrl: string | undefined,
): PanelView[] {
  const views = resolveViews({ configured, hideEmptyViews, item })
  return applyViewOverrides(configured, viewOverrides(contentUrl ? showContent(views, item, contentUrl) : views))
}

// an item has an image to display when its first image has a url. No images key, an empty array or an image without url count as no image
export function hasImage(item: Item | null): boolean {
  return !!item?.images?.[0]?.id
}

function splitMIMEType(value: string): string[] {
  return value.split(';type=')
}

// The content type of a single content: the ';type=' param, or the MIME type itself when there is none
export function getContentType(content: Content): string {
  const [type, param] = splitMIMEType(content.contentType)
  return param ?? type
}

// The supported content types of an item, in the order of its contents and without duplicates
export function getContentTypes(contents: Content[]): string[] {
  const types = contents
    .filter((content) => {
      const [type] = splitMIMEType(content.contentType)
      return type && SUPPORTED_MIME_TYPES.includes(type)
    })
    .map(getContentType)

  return [...new Set(types)]
}

// The content of the given content type - compared exactly, so 'translation' does not match 'translation_en'
export function findContentByType(contents: Content[] | undefined, type: string | null | undefined): Content | undefined {
  if (!type || !contents) return undefined
  return contents.find(c => getContentType(c) === type)
}

// The content types a text view offers on an item. A configured list is narrowed down to what the item
// offers, in the configured order - it can end up empty. Without a configured list the view offers all
// content types of the item, in the order of the item.
function resolveContentTypes(itemContentTypes: string[], configuredContentTypes?: string[] | null): string[] {
  if (!configuredContentTypes || configuredContentTypes.length === 0) return itemContentTypes
  return configuredContentTypes.filter(type => itemContentTypes.includes(type))
}

// The active content type: the preferred one when offered, else the configured one when offered, else
// the first one offered. Undefined when the view offers none.
function resolveActiveContentType(contentTypes: string[], preferred?: string, configured?: string): string | undefined {
  return [preferred, configured].find(type => type && contentTypes.includes(type)) ?? contentTypes[0]
}

// One view on an item. Only the visibility and the preferred content type come from what the view was
// before - everything else from its configuration, never from what it offered on another item.
function resolveView(
  key: number,
  configured: PanelView,
  itemContentTypes: string[],
  carried: { visible?: boolean, preferredContentType?: string } | undefined,
): PanelViewState {
  const view: PanelViewState = { ...configured, key, visible: carried?.visible ?? configured.visible ?? true }
  if (configured.view === 'image') return view

  const contentTypes = resolveContentTypes(itemContentTypes, configured.contentTypes)
  const preferredContentType = carried ? carried.preferredContentType : configured.activeContentType

  return {
    ...view,
    contentTypes,
    activeContentType: resolveActiveContentType(contentTypes, preferredContentType, configured.activeContentType),
    ...(preferredContentType && { preferredContentType }),
    ...(contentTypes.length === 0 && { missingContentTypes: configured.contentTypes }),
  }
}

// An appended view has no configuration: it offers every content type of the item
function appendedView(key: number, label: string | undefined, itemContentTypes: string[], carried: { visible?: boolean, preferredContentType?: string }): PanelViewState {
  return { ...resolveView(key, { view: 'text', label }, itemContentTypes, carried), appended: true }
}

// Whether a view has nothing to show on the item: an image view on an item without image, a text view
// offering none of its content types
function isEmpty(view: PanelViewState, item: Item): boolean {
  return view.view === 'image' ? !hasImage(item) : view.contentTypes?.length === 0
}

// The views of a panel on an item: its configured views followed by its appended views. The empty ones of
// the kinds in hideEmptyViews are omitted - kept in the state, so what was changed on them is handed over
// to the next item, but not shown: a panel can end up showing no view at all. What the user changed is
// handed over from the previous views by view key.
export function resolveViews({ configured, hideEmptyViews, item, previous = [] }: ResolveViewsInput): PanelViewState[] {
  const itemContentTypes = getContentTypes(item.contents ?? [])
  const views = configured.map((view, key) => resolveView(key, view, itemContentTypes, previous.find(p => !p.appended && p.key === key)))
  const appended = previous
    .filter(p => p.appended)
    .map((p, i) => ({ ...appendedView(configured.length + i, p.label, itemContentTypes, p), widthRatio: p.widthRatio }))

  return [...views, ...appended].map(view => hideEmptyViews.includes(view.view) && isEmpty(view, item) ? { ...view, omitted: true } : view)
}

// A choice of the user on the current item: the content type becomes the preferred one of the view
// and is shown, as far as the view offers it.
export function chooseContentType(views: PanelViewState[], viewKey: number, contentType: string): PanelViewState[] {
  return views.map(view => view.key !== viewKey ? view : {
    ...view,
    preferredContentType: contentType,
    activeContentType: resolveActiveContentType(view.contentTypes ?? [], contentType, view.activeContentType),
  })
}

// Brings a content of the item on screen, for a cross-reference or a synopsis selection: the view showing
// it becomes visible, else the first text view offering its content type switches to it as preferred one,
// else a text view showing it is appended.
export function showContent(views: PanelViewState[], item: Item, contentUrl: string): PanelViewState[] {
  const content = item.contents?.find(c => c.id === contentUrl)
  if (!content) return views
  const contentType = getContentType(content)

  const showing = textSources({ panelViews: views, item }).find(s => s.contentUrl === contentUrl)
  if (showing) return views.map(view => view.key === showing.viewKey ? { ...view, visible: true } : view)

  const offering = views.find(view => view.view === 'text' && view.contentTypes?.includes(contentType))
  if (offering) {
    return views.map(view => view !== offering ? view : {
      ...view,
      visible: true,
      preferredContentType: contentType,
      activeContentType: contentType,
    })
  }

  const key = Math.max(-1, ...views.map(view => view.key)) + 1
  return [...views, appendedView(key, contentType, getContentTypes(item.contents ?? []), { visible: true, preferredContentType: contentType })]
}

// The views a panel shows on its current item - all but the omitted ones, visible or not
export function shownViews(views: PanelViewState[]): PanelViewState[] {
  return views.filter(view => !view.omitted)
}

// The contents the text views of a panel show, in view order - one per text view, also when two show the same
export function textSources(panel: { panelViews: PanelViewState[], item: Item | null }): TextSource[] {
  if (!panel.item) return []

  return panel.panelViews.flatMap(view => {
    if (view.view !== 'text' || view.omitted) return []
    const content = findContentByType(panel.item.contents, view.activeContentType)
    if (!content) return []
    return [{ viewKey: view.key, contentUrl: content.id, visible: view.visible ?? true }]
  })
}

export function visibleTextSources(panel: { panelViews: PanelViewState[], item: Item | null }): TextSource[] {
  return textSources(panel).filter(source => source.visible)
}
