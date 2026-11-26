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

// The viewsWidthRatio of a panel as positive numbers, one per text or image view - the annotations view has
// no ratio, it takes the width it had last. Null when it is not set or does not fit the views, in which case
// the views share the panel width equally. Values from the url are strings.
function getViewsWidthRatio(viewsWidthRatio: unknown, viewsCount: number): number[] | null {
  if (viewsWidthRatio === undefined) return null

  const ratios = Array.isArray(viewsWidthRatio) ? viewsWidthRatio.map(Number) : []
  if (ratios.length !== viewsCount || ratios.some(r => !Number.isFinite(r) || r <= 0)) {
    console.warn(`viewsWidthRatio must have one positive number for each of the ${viewsCount} text and image views - the views get equal widths`)
    return null
  }

  return ratios
}

// The configured panel views of a panel, local first: its own views when it has any - the global panelViews
// are not looked at then - else the global ones, each with its width ratio. The same for hideEmptyViews.
// A panel shows annotations only when its panel views configure an annotations view (see hasAnnotations).
export function configureViews(
  config: Pick<TidoConfig, 'panelViews' | 'hideEmptyViews'>,
  panel: Pick<PanelConfig, 'views' | 'viewsWidthRatio' | 'hideEmptyViews'> = {},
): Pick<ResolveViewsInput, 'configured' | 'hideEmptyViews'> {
  const views = panel.views?.length > 0 ? panel.views : config.panelViews
  const ratios = getViewsWidthRatio(panel.viewsWidthRatio, views.filter(isContentView).length)
  let next = 0

  return {
    configured: views.map(view => isContentView(view) ? { ...view, widthRatio: ratios?.[next++] } : view),
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
// before - everything else from its configuration, never from what it offered on another item. Content
// views are visible unless configured otherwise, the annotations view is hidden unless configured otherwise.
function resolveView(
  key: number,
  configured: PanelView,
  itemContentTypes: string[],
  carried: { visible?: boolean, preferredContentType?: string } | undefined,
): PanelViewState {
  const view: PanelViewState = { ...configured, key, visible: carried?.visible ?? configured.visible ?? isContentView(configured) }
  if (configured.view !== 'text') return view

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
// offering none of its content types. The annotations view is never empty - it says so itself.
function isEmpty(view: PanelViewState, item: Item): boolean {
  if (view.view === 'annotations') return false
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

  return keepContentViewOpen([...views, ...appended].map(view => hideEmptyViews.includes(view.view) && isEmpty(view, item) ? { ...view, omitted: true } : view))
}

// A panel always keeps one text or image view open - the annotations view never counts as one. When the
// configuration or a bookmark hide all those it shows on the item, the first one is opened.
function keepContentViewOpen(views: PanelViewState[]): PanelViewState[] {
  const contentViews = shownViews(views).filter(isContentView)
  if (contentViews.length === 0 || contentViews.some(view => view.visible)) return views
  return views.map(view => view === contentViews[0] ? { ...view, visible: true } : view)
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

// Whether a view shows content of the item (text or image) - every view but the annotations view
export function isContentView(view: PanelView): boolean {
  return view.view !== 'annotations'
}

// Whether a view is the annotations view - the one view that is no content view
export function isAnnotationsView(view: PanelView): boolean {
  return !isContentView(view)
}

// Whether a view is visible: as set on it, else content views are and the annotations view is not
export function isVisible(view: PanelView): boolean {
  return view.visible ?? isContentView(view)
}

// The annotations view of a panel - only the first one counts
export function annotationsView<T extends PanelView>(views: T[]): T | undefined {
  return views.find(isAnnotationsView)
}

// Whether the panel has annotations at all: only a panel with an annotations view loads, highlights and
// shows the annotations of its items - without one the item's annotations are left alone
export function hasAnnotations(views: PanelView[]): boolean {
  return annotationsView(views) !== undefined
}

// Whether the panel shows its annotations: its annotations view is visible
export function annotationsShown(views: PanelView[]): boolean {
  return annotationsView(views)?.visible === true
}

// The views with the annotations view shown or hidden - by the user, a selected annotation or a cross-reference
export function showAnnotations<T extends PanelView>(views: T[], shown: boolean): T[] {
  const annotations = annotationsView(views)
  return views.map(view => view === annotations ? { ...view, visible: shown } : view)
}

// The panes of a panel side by side, in order: the views it shows on its current item, its annotations
// view among them where the panel views place it - only the first one counts.
export function panelPanes(views: PanelViewState[]): PanelViewState[] {
  const shown = shownViews(views)
  const annotations = annotationsView(shown)
  return shown.filter(view => isContentView(view) || view === annotations)
}

// The contents the text views of a panel show, in view order - one per text view, also when two show the same
export function textSources(panel: { panelViews: PanelViewState[], item: Item | null }): TextSource[] {
  if (!panel.item) return []

  return panel.panelViews.flatMap(view => {
    if (view.view !== 'text' || view.omitted) return []
    const content = findContentByType(panel.item.contents, view.activeContentType)
    if (!content) return []
    return [{ viewKey: view.key, contentUrl: content.id, visible: isVisible(view) }]
  })
}

export function visibleTextSources(panel: { panelViews: PanelViewState[], item: Item | null }): TextSource[] {
  return textSources(panel).filter(source => source.visible)
}

// The DOM id of a pane of a panel - the view toggles point to it with aria-controls
export function paneDomId(panelId: string, viewKey: number): string {
  return `tido-pane-${panelId}-${viewKey}`
}

// The names of the panes, for the view toggles: a pane is named by its label, else by its kind of view.
// Panes sharing a name are told apart by the content type they show - two text views labelled "Text"
// become "transcription" and "diplomatic" - and when even that is the same, by a number.
export function paneNames(panes: PanelViewState[], translate: (key: string) => string): string[] {
  const nameOf = (pane: PanelViewState) => pane.label ? translate(pane.label) : translate(pane.view)
  const count = (names: string[], name: string) => names.filter(n => n === name).length

  const names = panes.map(nameOf)
  const distinct = names.map((name, i) => {
    const contentType = panes[i].activeContentType
    return count(names, name) > 1 && contentType ? translate(contentType) : name
  })

  return distinct.map((name, i) => count(distinct, name) > 1
    ? `${name} ${count(distinct.slice(0, i), name) + 1}`
    : name)
}

// Whether the panel header offers view toggles: when there is a choice - two panes or more, or an
// annotations pane, which never counts as the last open view and so can always be switched
export function hasViewToggles(panes: PanelViewState[]): boolean {
  return panes.length > 1 || panes.some(isAnnotationsView)
}

// The views with the panes switched on whose view keys are given and the others switched off - views that
// are no pane (omitted ones) stay as they are. Null when that would switch off the last text or image
// view the panel shows: one of them always stays on. The annotations view never counts as one, so a panel
// showing no text or image view on its item switches its annotations freely.
export function switchPanes(views: PanelViewState[], keys: string[]): PanelViewState[] | null {
  const panes = panelPanes(views)
  const isOn = (pane: PanelViewState) => keys.includes(String(pane.key))
  const contentPanes = panes.filter(isContentView)
  if (contentPanes.length > 0 && !contentPanes.some(isOn)) return null

  return views.map(view => panes.includes(view) ? { ...view, visible: isOn(view) } : view)
}
