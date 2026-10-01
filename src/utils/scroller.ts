import { getSource, getSyncedTargets } from '@/utils/annotations.ts'
import { alignContainer, isProgrammaticScroll } from '@/utils/dom.ts'
import { SyncedTargetRef, SynopsisConnection, useSynopsisStore } from '@/store/SynopsisStore.tsx'

const SYNC_SCROLL_THRESHOLD_TOP = 0.35
const SYNC_SCROLL_THRESHOLD_BOTTOM = 0.45

// A scroll gesture sends a burst of events for as long as it goes - one per frame, hundreds over a
// fling - and each of them would resolve the whole app and write a scroll position. The first event
// of a window is handled right away, so the texts follow along while the user scrolls; the rest of
// the window is collapsed into one trailing call, so a long gesture costs a call per window instead
// of a call per frame. The trailing call is what lands the texts on the position the scroll ended at.
const SYNC_SCROLL_WINDOW = 50

// Scrolls each target's own container so the target lands at yPos - the distance from the top of the
// container that the target it is synced with has in its one, which is what keeps the texts aligned.
// The targets handed in are already one per text - see focusedTargetsPerText - so this writes one
// scroll position per text and nothing more. Writing more than one moved the scrollbar as often as
// there were counterparts and left it wherever the last write pointed, which read as a scrollbar
// that jumps.
function alignTargets(targetEls: HTMLElement[], yPos: number) {
  targetEls.forEach((targetEl) => {
    const container = targetEl.closest('[data-text-container]') as HTMLElement | null
    if (!container) return

    const currentY = targetEl.getBoundingClientRect().top - container.getBoundingClientRect().top
    const top = container.scrollTop + currentY - yPos
    console.log('scroll', targetEl, container.scrollTop + currentY - yPos)

    if (top > 6000) return
    alignContainer(container, top)
  })
}

// Find the topmost target sitting in the scroll container's "focused" band - the strip of the
// visible area between SYNC_SCROLL_THRESHOLD_TOP and _BOTTOM, extended down to the container bottom
// when scrolled near the end. The band is part of the visible area, so a target overlapping it is on
// screen by definition. Shared by the sidebar scroll handler and the synopsis scroll listener in
// GenericTextRenderer.
function findFocusedTarget(scrollContainer: HTMLElement, targets: Element[]): HTMLElement | undefined {
  const { top, bottom, height } = scrollContainer.getBoundingClientRect()

  const remainingScrollAmount = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight
  const isNearBottom = remainingScrollAmount <= height * (1 - SYNC_SCROLL_THRESHOLD_BOTTOM)

  const bandTop = top + height * SYNC_SCROLL_THRESHOLD_TOP
  const bandBottom = isNearBottom ? bottom : top + height * SYNC_SCROLL_THRESHOLD_BOTTOM

  let focusedTarget: HTMLElement | undefined
  let smallestTop = Infinity

  targets.forEach((target) => {
    const { top: targetTop, bottom: targetBottom } = target.getBoundingClientRect()
    if (targetTop >= bandBottom || targetBottom <= bandTop) return

    // the one closest to the top of the band, whatever order the targets come in
    if (targetTop < smallestTop) {
      smallestTop = targetTop
      focusedTarget = target as HTMLElement
    }
  })

  return focusedTarget
}

// What the debounce of one scroll listener remembers: when it last ran, and the timer of the
// trailing call waiting for the window to be over.
interface ScrollDebounce {
  lastHandled: number
  timer: number
}

// One text view's place in the synoptic graph: the text element the renderer handed over, the
// container that scrolls, and the elements of that text the sync annotations of its source target.
// Kept per panel and per source, because the same source can be open in several panels at once and
// each of those is its own scroller with its own scroll position.
interface SynopticView {
  text: Element
  container: HTMLElement
  targetEls: HTMLElement[]
  listener: EventListener
  // what the band detection last acted on, so a scroll event that changes neither of them is a no-op
  focusedTarget: HTMLElement | null
  yPos: number | null
  // the debounce of this view's scroll listener
  debounce: ScrollDebounce
}

// One panel's slice of the engine: the elements it has registered and the state that belongs to it
// alone. Everything is kept per panel rather than global, because a panel is the unit that can be
// opened, closed and scrolled on its own - two panels showing the same text must not overwrite each
// other's containers, and one panel's scroll origin must not be read by another.
interface ScrollerPanelState {
  sidebar: HTMLElement | null
  texts: {[contentUrl: string]: HTMLElement}
  synoptics: {[source: string]: SynopticView}
  matchedMap: {[contentUrl: string]: MatchedAnnotationsMap}
  syncEnabled: boolean
  originSelection: 'text' | 'annotation' | 'config'
  focusedAnnotationId: string | null
}

function createPanelState(): ScrollerPanelState {
  return {
    sidebar: null,
    texts: {},
    synoptics: {},
    matchedMap: {},
    syncEnabled: false,
    originSelection: 'text',
    focusedAnnotationId: null
  }
}

// The elements a synced target ref points at, in every text of the app showing that source. Global
// on purpose: this is what makes a synoptic connection reach across panels.
function resolveSyncedTargetElements(syncedTargets: SyncedTargetRef[]): HTMLElement[] {
  const texts = Array.from(document.querySelectorAll('[data-text-source]'))

  const targetEls = syncedTargets.flatMap((syncedTarget) => texts
    .filter((text) => text.getAttribute('data-text-source') === syncedTarget.source.id)
    .map((text) => text.querySelector(syncedTarget.selector) as HTMLElement)
    .filter(Boolean)
  )

  return [...new Set(targetEls)]
}

// The one target per text a connection is carried by. A single connection can point at several
// counterparts in the same text: two sync annotations that share the target the connection started
// from each have their own counterpart elsewhere in it, and the texts of one source can even be open
// more than once. Handing all of them on made a text move once per counterpart - the scrollbar was
// written as often as there were targets and ended up wherever the last write pointed, which read as
// the scrollbar jumping - so they are grouped by their text and only one of them is kept: the one in
// that text's focus band, the same rule a scrolled text is read with, falling back to the first when
// the text is scrolled somewhere none of its targets is on screen.
function focusedTargetsPerText(elements: HTMLElement[]): HTMLElement[] {
  const elementsByContainer = new Map<HTMLElement, HTMLElement[]>()

  elements.forEach((targetEl) => {
    const container = targetEl.closest('[data-text-container]') as HTMLElement | null
    if (!container) return

    const containerTargets = elementsByContainer.get(container)
    if (containerTargets) containerTargets.push(targetEl)
    else elementsByContainer.set(container, [targetEl])
  })

  return [...elementsByContainer].map(([container, containerTargets]) => {
    // Two counterparts of one connection often share a row in the same text - they are the same
    // words, only split differently - and one of them has to be the one that counts, or the write
    // would still happen twice. The band is what says which: it is where the text is being read.
    const rows = new Map<number, HTMLElement>()
    containerTargets.forEach((targetEl) => {
      const top = Math.round(targetEl.getBoundingClientRect().top)
      if (!rows.has(top)) rows.set(top, targetEl)
    })
    const rowTargets = [...rows.values()]

    return findFocusedTarget(container, rowTargets) ?? rowTargets[0]
  }).filter(Boolean)
}

// Whether aligning the two connections would move the same targets to the same height. The store
// hands out a new object whenever anything of a connection changes, and several paths publish the
// same one - so what has to be compared is what an alignment would do with it, not the object.
function isSameConnection(a: SynopsisConnection | null, b: SynopsisConnection) {
  if (!a) return false
  if (a.navigatedTarget !== b.navigatedTarget || a.yPos !== b.yPos || a.source !== b.source) return false
  if (a.otherSyncedTargets.length !== b.otherSyncedTargets.length) return false

  return a.otherSyncedTargets.every((syncedTarget, index) => {
    const other = b.otherSyncedTargets[index]
    return other.source.id === syncedTarget.source.id && other.selector === syncedTarget.selector
  })
}

class Scroller {
  private panels: {[panelId: string]: ScrollerPanelState} = {}

  // The last connection this engine moved for. The store notifies on every change of any of its
  // fields, and aligning the same connection twice would write a scrollTop it has already reached.
  private alignedConnection: SynopsisConnection | null = null

  // The elements the last resolution came back with, and the refs they were resolved for. Scrolling
  // runs the same connection past the engine again and again - once per event, with the same refs -
  // and resolving is a query over every text of the app, too much to redo for each of them. Dropped
  // as soon as a text registers or a panel is closed, because that is when the elements a ref can
  // point at change.
  private resolvedTargets: { refs: string; elements: HTMLElement[] } | null = null

  constructor() {
    // A connection the user navigated to - a cross ref, a bookmark, the target list - scrolls the
    // texts that hold its counterparts. A connection that came from a scroll has already moved them
    // at that moment, so following it here would scroll them a second time.
    useSynopsisStore.subscribe((state) => {
      if (state.activeSynopsisConnection.source === 'scroll') return
      this.alignConnection(state.activeSynopsisConnection)
    })
  }

  // The elements the given refs point at right now, reusing the last resolution while it is the
  // answer to the same question.
  private resolve(syncedTargets: SyncedTargetRef[]) {
    const refs = syncedTargets.map((syncedTarget) => `${syncedTarget.source.id}|${syncedTarget.selector}`).join('\n')
    if (this.resolvedTargets?.refs === refs) return this.resolvedTargets.elements

    const elements = focusedTargetsPerText(resolveSyncedTargetElements(syncedTargets))
    this.resolvedTargets = { refs, elements }
    return elements
  }

  // Moves the counterparts of the connection to yPos, leaving the text the user navigated in place.
  private alignConnection(connection: SynopsisConnection) {
    if (!connection.navigatedTarget) return
    if (isSameConnection(this.alignedConnection, connection)) return

    this.alignedConnection = connection
    console.log('alignConnection')
    this.alignSyncedTargets(connection.otherSyncedTargets, connection.yPos, connection.navigatedTarget)
  }

  // The scroll engine moves one text for several reasons - the user scrolls the sidebar, a card is
  // selected, a cross reference is followed - and every one of them means the same thing to the rest
  // of the app: the target standing for this annotation in the other texts has to come along. So the
  // texts are never moved in isolation: a scroll of the engine always carries the connection with it.
  // Without this the synoptic counterparts stayed behind whenever the scroll did not come from the
  // band detection of a text, which is every path but a user scroll of a text.
  private propagateToSyncedTargets(text: HTMLElement, targetEl: HTMLElement) {
    const source = text.getAttribute('data-content-url')
    if (!source) return

    const { syncAnnotationsBySource } = useSynopsisStore.getState()
    const syncedTargets = getSyncedTargets(targetEl, source, syncAnnotationsBySource.get(source) ?? [])
    if (syncedTargets.length === 0) return

    const yPos = targetEl.getBoundingClientRect().top - text.getBoundingClientRect().top

    console.log('propagateToSyncedTargets')
    // the text that was moved keeps its own position - the others are the ones that follow
    this.alignSyncedTargets(syncedTargets, yPos, text)
  }

  // The slice for this panel, created on first use. Every accessor goes through it, so callers never
  // have to deal with an unregistered panel.
  private panel(panelId: string): ScrollerPanelState {
    if (!this.panels[panelId]) this.panels[panelId] = createPanelState()
    return this.panels[panelId]
  }

  // Forgets a panel entirely. The engine outlives every panel, so a panel that is closed has to hand
  // back the elements it registered - they are DOM nodes of a panel that no longer exists, and the
  // listeners attached to them would keep the whole panel alive otherwise.
  removePanel(panelId: string) {
    const panel = this.panels[panelId]
    if (!panel) return

    this.stopSync(panelId)
    Object.keys(panel.synoptics).forEach((source) => this.clearSynoptic(panelId, source))
    delete this.panels[panelId]
    delete this.sidebarScrollListeners[panelId]
    delete this.textScrollListeners[panelId]
    this.resolvedTargets = null
  }

  setSidebar(panelId: string, element: HTMLElement) {
    this.panel(panelId).sidebar = element
  }

  getSidebar(panelId: string) {
    return this.panel(panelId).sidebar
  }

  setText(panelId: string, url: string, element: HTMLElement) {
    this.panel(panelId).texts[url] = element
    element.setAttribute('data-content-url', url)
  }

  // The text container of this panel showing the given content url - the element the engine tagged
  // when that text view registered. Null when no view of that panel shows it.
  getText(panelId: string, contentUrl: string) {
    return this.panel(panelId).texts[contentUrl] ?? null
  }

  setMatchedMap(panelId: string, map: {[contentUrl: string]: MatchedAnnotationsMap}) {
    this.panel(panelId).matchedMap = map
  }

  setOriginSelection(panelId: string, value: 'text' | 'annotation' | 'config') {
    this.panel(panelId).originSelection = value
  }

  getOriginSelection(panelId: string) {
    return this.panel(panelId).originSelection
  }

  // Moves the sidebar to where the text is. The write marks itself, so the sidebar's own scroll
  // listener treats it as ours rather than as the user scrolling - which is what keeps the two in
  // lockstep without either reacting to the other.
  syncScroll(source: HTMLElement, target: HTMLElement) {
    if (!source || !target) return
    alignContainer(target, source.scrollTop)
  }

  syncSidebarToText(panelId: string, targetSource: string | AnnotationTargetSource) {
    const url = typeof targetSource === 'string' ? targetSource : targetSource.id
    this.syncScroll(this.getText(panelId, url), this.getSidebar(panelId))
  }


  handleSidebarScroll(panelId: string) {
    const panel = this.panel(panelId)
    if (!panel.sidebar || isProgrammaticScroll(panel.sidebar)) return
    const refY = panel.sidebar.scrollTop + panel.sidebar.clientHeight * SYNC_SCROLL_THRESHOLD_TOP

    const mapEntries = Object
      .values(panel.matchedMap)
      .flatMap(map => Object.values(map))
      .filter(item => item.filtered)
    // TODO: Ther problem here is that tooltip annotations appear also as filtered=true, we need to handle them better

    const bandEntry = mapEntries.find(entry => {
      const card = panel.sidebar.querySelector(`[data-annotation="${entry.annotation.id}"]`) as HTMLElement
      if (!card) return false
      const top = parseInt(card.style.top)
      const bottom = top + card.offsetHeight
      return refY >= top && refY < bottom
    })

    if (!bandEntry || bandEntry.annotation.id === panel.focusedAnnotationId) return

    panel.focusedAnnotationId = bandEntry.annotation.id

    const entry = bandEntry
    const targetElement = entry.target[0]

    if (targetElement) {
      const contentUrl = getSource(entry.annotation.target[0]).id
      const text = this.getText(panelId, contentUrl)
      if (text) {
        const textRect = text.getBoundingClientRect()
        const targetRect = targetElement.getBoundingClientRect()
        const targetTop = targetRect.top - textRect.top + text.scrollTop
        const targetOffset = text.clientHeight * SYNC_SCROLL_THRESHOLD_TOP
        alignContainer(text, targetTop - targetOffset)
        this.propagateToSyncedTargets(text, targetElement as HTMLElement)
      }
    }
  }

  handleTextScroll(panelId: string, e: Event) {
    const text = e.target as HTMLElement
    if (isProgrammaticScroll(text)) return
    const contentUrl = text.getAttribute('data-content-url')

    // The user took a text out of the position the last alignment put it in, so that alignment no
    // longer holds - selecting the same connection again has to move the texts after all.
    this.alignedConnection = null

    if (this.panel(panelId).originSelection === 'text')  {
      this.syncScroll(this.getText(panelId, contentUrl), this.getSidebar(panelId))
    }
  }

  // Sidebar and text scroll in lockstep only while the aligned annotation list is mounted - it is
  // what positions its cards against their targets. Everywhere else the two scroll independently,
  // so the listeners stay off and a text view registering in the meantime does not turn them back
  // on by itself.
  startSync(panelId: string) {
    this.panel(panelId).syncEnabled = true
    this.startSidebar(panelId)
    Object.keys(this.panel(panelId).texts).forEach(contentUrl => this.startText(panelId, contentUrl))
  }

  stopSync(panelId: string) {
    this.panel(panelId).syncEnabled = false
    this.stopSidebar(panelId)
    Object.keys(this.panel(panelId).texts).forEach(contentUrl => this.stopText(panelId, contentUrl))
  }

  startSidebar(panelId: string) {
    if (!this.panel(panelId).syncEnabled) return
    this.getSidebar(panelId)?.addEventListener('scroll', this.sidebarScrollListener(panelId))
  }

  stopSidebar(panelId: string) {
    this.getSidebar(panelId)?.removeEventListener('scroll', this.sidebarScrollListener(panelId))
  }

  startText(panelId: string, contentUrl: string) {
    if (!this.panel(panelId).syncEnabled) return
    this.getText(panelId, contentUrl)?.addEventListener('scroll', this.textScrollListener(panelId))
  }

  stopText(panelId: string, contentUrl: string) {
    this.getText(panelId, contentUrl)?.removeEventListener('scroll', this.textScrollListener(panelId))
  }

  // One listener function per panel, kept so add and removeEventListener are handed the very same
  // reference - the listeners are bound per panel now, since a scroll event has to be attributed to
  // the panel whose element it came from.
  private sidebarScrollListeners: {[panelId: string]: EventListener} = {}
  private textScrollListeners: {[panelId: string]: EventListener} = {}

  private sidebarScrollListener(panelId: string): EventListener {
    if (!this.sidebarScrollListeners[panelId]) {
      this.sidebarScrollListeners[panelId] = () => this.handleSidebarScroll(panelId)
    }
    return this.sidebarScrollListeners[panelId]
  }

  private textScrollListener(panelId: string): EventListener {
    if (!this.textScrollListeners[panelId]) {
      this.textScrollListeners[panelId] = (e: Event) => this.handleTextScroll(panelId, e)
    }
    return this.textScrollListeners[panelId]
  }

  // Scrolls the text by delta. The write marks itself, so handleTextScroll does not take it for a
  // user scroll and sync on top of it. The target the scroll is meant to bring into view travels
  // along, so the synced targets of the other texts follow - the caller knows which target it is
  // aligning, the engine does not, and without it the counterpart in the other text would stay
  // behind.
  scrollText(panelId: string, contentUrl: string, delta: number, targetEl?: HTMLElement) {
    const text = this.getText(panelId, contentUrl)
    if (!text) return

    const settled = alignContainer(text, text.scrollTop + delta, 'smooth')
    if (!targetEl) return

    // A smooth scroll is still on its way when alignContainer returns, so the height the text is
    // leaving is not the one it settles at. The counterpart has to follow the height the text ends
    // up at, so it waits for the scroll to come to a stop. Landing on the scrollTop the text already
    // has scrolls nothing and never reaches scrollend - the write is a no-op in that case, and the
    // text is already standing where the counterpart is asked to go.
    if (settled === text.scrollTop) this.propagateToSyncedTargets(text, targetEl)
    else text.addEventListener('scrollend', () => this.propagateToSyncedTargets(text, targetEl), { once: true })
  }

  // ---------------------------------------------------------------------------
  // Synoptic connections
  //
  // A synoptic connection is a set of targets that stand for the same thing in different texts, in
  // different panels. Scrolling one of them into the focus band makes that one the active connection
  // and moves the others to the same height. This lives here rather than in the synopsis hook
  // because the connection spans panels: the scroll that starts it happens in one panel and the
  // targets it moves are in all the others.
  // ---------------------------------------------------------------------------

  // Registers the text a renderer handed over, with the elements of it that the sync annotations of
  // its source target, and starts listening for the user scrolling it. Passing a different text or a
  // new set of targets replaces the previous registration, so a rerender costs nothing.
  setSynoptic(panelId: string, source: string, text: Element | null, targetEls: HTMLElement[]) {
    const panel = this.panel(panelId)
    const previous = panel.synoptics[source]

    if (!text) {
      this.clearSynoptic(panelId, source)
      return
    }

    if (previous && previous.text === text && previous.targetEls === targetEls) return

    console.log(text, targetEls)
    this.clearSynoptic(panelId, source)
    // a text entering or leaving the graph is what makes a resolved ref point at something else
    this.resolvedTargets = null

    const container = text.closest('[data-text-container]') as HTMLElement | null
    if (!container) return

    const debounce: ScrollDebounce = { lastHandled: 0, timer: 0 }

    // The debounce of the scroll listener: one call per SYNC_SCROLL_WINDOW, the first of them
    // without delay so the texts keep up with the scrolling, the last of them after the window is
    // over so they end up where the scroll ended.
    const listener: EventListener = () => {
      const waited = Date.now() - debounce.lastHandled
      if (waited >= SYNC_SCROLL_WINDOW) {
        debounce.lastHandled = Date.now()
        this.handleSynopticScroll(panelId, source)
        return
      }

      if (debounce.timer) return
      debounce.timer = window.setTimeout(() => {
        debounce.timer = 0
        debounce.lastHandled = Date.now()
        this.handleSynopticScroll(panelId, source)
      }, SYNC_SCROLL_WINDOW - waited)
    }

    const view: SynopticView = { text, container, targetEls, listener, focusedTarget: null, yPos: null, debounce }
    container.addEventListener('scroll', listener, { passive: true })
    panel.synoptics[source] = view
  }

  private clearSynoptic(panelId: string, source: string) {
    const previous = this.panel(panelId).synoptics[source]
    if (!previous) return

    previous.container.removeEventListener('scroll', previous.listener)
    if (previous.debounce.timer) window.clearTimeout(previous.debounce.timer)
    delete this.panel(panelId).synoptics[source]
  }

  // The sync target in the focus band of the scrolled text becomes the active connection, and every
  // other text holding one of its counterparts is moved to the same height. Publishing the
  // connection is what lets the rest of the app follow the scroll, whether or not it can scroll
  // anything itself.
  private handleSynopticScroll(panelId: string, source: string) {
    const view = this.panel(panelId).synoptics[source]
    if (!view || isProgrammaticScroll(view.container)) return

    const focusedTarget = findFocusedTarget(view.container, view.targetEls)
    if (!focusedTarget) return

    const yPos = focusedTarget.getBoundingClientRect().top - view.container.getBoundingClientRect().top

    // A scroll reports far more events than it changes anything: the trailing ones of a smooth
    // scroll, the ones a text view sends while its content settles, the ones a trackpad sends
    // between two pixels. Resolving and writing for those would set the very same scroll position
    // again, so what the last event acted on is remembered and only a change of it goes on.
    if (view.focusedTarget === focusedTarget && view.yPos !== null && Math.abs(view.yPos - yPos) < 1) return

    view.focusedTarget = focusedTarget
    view.yPos = yPos

    const { syncAnnotationsBySource, setActiveSynopsisConnection } = useSynopsisStore.getState()
    const syncedTargets = getSyncedTargets(focusedTarget, source, syncAnnotationsBySource.get(source) ?? [])
    if (syncedTargets.length === 0) return

    setActiveSynopsisConnection({
      navigatedTarget: focusedTarget,
      otherSyncedTargets: syncedTargets,
      yPos,
      source: 'scroll'
    })

    console.log('handleSynopticScroll')
    // The text that was scrolled is left where the user put it - the others move to match it.
    this.alignSyncedTargets(syncedTargets, yPos, view.text)
  }

  // Moves every text holding a counterpart of the connection so the counterpart lands at yPos. The
  // text the connection was navigated from is skipped when one is given: the user's own scroll is
  // the reference the others are following, not something to be overridden.
  alignSyncedTargets(syncedTargets: SyncedTargetRef[], yPos: number, skipText?: Element) {
    console.log('resolve')
    const targetEls = this.resolve(syncedTargets)
    console.log(targetEls)
    alignTargets(skipText ? targetEls.filter((targetEl) => !skipText.contains(targetEl)) : targetEls, yPos)
  }
}

// One engine for the whole app. The scroller is not per panel: a synoptic connection reaches from
// one panel into another, so a single instance holding every panel's elements is what lets a scroll
// in one pane be resolved against the targets of every other. Panels stay separate inside it - see
// ScrollerPanelState.
let scroller: Scroller | null = null

function getScroller(): Scroller {
  if (!scroller) scroller = new Scroller()
  return scroller
}

export {
  Scroller,
  getScroller,
  resolveSyncedTargetElements
}
