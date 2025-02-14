import {
  scrollToElement,
  setAutoScrolling,
  isAutoScrolling,
  syncScrollPosition,
  removeAutoScrolling
} from '@/utils/scroll.ts'
import { panelStore } from '@/store/PanelStore.tsx'
import { dataStore } from '@/store/DataStore.tsx'
import { scrollStore } from '@/store/ScrollStore.tsx'


function getTargetSelectorsInPanel(panelState: PanelState, annotations: Annotation[]) {
  const targetSelectors: string[] = []
  annotations
    .forEach((annotation) => {
      const { target } = annotation
      target.forEach(({ source, selector }) => {
        const [manifestId, itemId] = source.split('_')
        if (manifestId === panelState.manifest.id && itemId === panelState.item.id) {
          targetSelectors.push((selector as CssSelector).value)
        }
      })
    })
  return targetSelectors
}

function scrollToTarget(scrollContainer: HTMLElement, targetSelector: string) {
  const el = scrollContainer.querySelector(targetSelector) as HTMLElement
  if (!el) return
  setAutoScrolling(scrollContainer)
  scrollToElement(scrollContainer, el)
}

function setHighlightingOnTarget(el: HTMLElement) {
  el.setAttribute('data-scroll-target', 'true')
  el.classList.add('t-bg-gray-200', 't-cursor-pointer')
}

function setAnnotationIdOnTarget(el: HTMLElement, annotation: Annotation) {
  el.setAttribute('data-annotation-id', annotation.id)
}

function setSelectedHighlightingOnTarget(el: HTMLElement) {
  el.classList.remove('t-bg-gray-200')
  el.classList.add('t-bg-blue-200')
}

function resetHighlighting(container: HTMLElement, targetSelectors: string[]) {
  targetSelectors.forEach(selector => {
    const el = container.querySelector(selector) as HTMLElement
    if (!el) return
    setHighlightingOnTarget(el)
  })
}

function selectSyncTargetByIndex(panelId: string, index: number) {
  const panelStates = panelStore.getState().panels
  const panelState = panelStates[panelId]
  if (!panelState) return

  const annotations = dataStore.getState().annotations[panelState.collectionId]
  if (!annotations) return

  const scrollContainer = document.querySelector(`[data-panel="${panelState.id}"]`) as HTMLElement

  const otherPanelStates = scrollStore.getState().panelIds
    .filter(p => p !== panelId)
    .map(id => panelStates[id])

  const targets = getTargetSelectorsInPanel(panelState, annotations)

  const el = scrollContainer.querySelector(targets[index]) as HTMLElement
  if (!el) return

  scrollToTarget(scrollContainer, targets[index])
  selectSyncTarget(el, panelState, otherPanelStates)
}

function getSyncClickListener(el: HTMLElement, panelState: PanelState, otherPanelStates: PanelState[]) {
  return function() {
    selectSyncTarget(el, panelState, otherPanelStates)
  }
}

function selectSyncTarget(el: HTMLElement, panelState: PanelState, otherPanelStates: PanelState[]) {

  const annotationId = el.getAttribute('data-annotation-id')
  const annotations = dataStore.getState().annotations[panelState.collectionId]
  if (!annotations) return

  const annotation = annotations.find(a => a.id === annotationId)
  if (!annotation) return

  const targetSelectors = getTargetSelectorsInPanel(panelState, annotations)
  const scrollContainer = document.querySelector(`[data-panel="${panelState.id}"]`) as HTMLElement
  resetHighlighting(scrollContainer, targetSelectors)
  setSelectedHighlightingOnTarget(el)
  panelStore.getState().setActiveTargetIndex(panelState.id, getIndexOnTarget(el))

  otherPanelStates.forEach(otherPanelState => {
    const otherScrollContainer = document.querySelector(`[data-panel="${otherPanelState.id}"]`) as HTMLElement
    annotation.target.forEach(({ source, selector }) => {
      const [manifestId, itemId] = source.split('_')
      if (manifestId === otherPanelState.manifest.id && itemId === otherPanelState.item.id) {
        scrollToTarget(otherScrollContainer, (selector as CssSelector).value)
      }
    })
  })
}

function setHighlighting(panelState: PanelState, annotations: Annotation[]) {
  const container = document.querySelector(`[data-panel="${panelState.id}"]`) as HTMLElement
  if (!container) return

  let index = -1
  annotations.forEach(annotation => {
    const { target } = annotation
    target.forEach(({ source, selector }) => {
      const [manifestId, itemId] = source.split('_')
      if (manifestId === panelState.manifest.id && itemId === panelState.item.id) {
        const el = container.querySelector((selector as CssSelector).value) as HTMLElement
        if (!el) return
        index++
        setHighlightingOnTarget(el)
        setAnnotationIdOnTarget(el, annotation)
        setIndexOnTarget(el, index)
      }
    })
  })
}

function setIndexOnTarget(el: HTMLElement, index: number) {
  el.setAttribute('data-target-index', index.toString())
}

function getIndexOnTarget(el: HTMLElement) {
  const value = el.getAttribute('data-target-index')
  return value ? parseInt(value) : -1
}

function setClickListeners(panelState: PanelState, annotations: Annotation[]) {
  const targets = getTargetSelectorsInPanel(panelState, annotations)
  const otherPanelStates = scrollStore.getState().panelIds
    .map(panelId => panelStore.getState().panels[panelId])

  targets.forEach(target => {
    const el = document.querySelector(target) as HTMLElement
    if (!el) return

    const listener = getSyncClickListener(el, panelState, otherPanelStates)
    scrollStore.getState().registerListener(panelState.id, {
      element: el,
      eventName: 'click',
      listener
    })
  })
}

function setupScrollPanel(panelState: PanelState) {
  const annotations = dataStore.getState().annotations[panelState.collectionId]
  if (!annotations) return

  setHighlighting(panelState, annotations)
  setClickListeners(panelState, annotations)
}

function setupSyncScrolling(panelStates: PanelState[]) {
  panelStates.forEach(panelState => {
    const scrollContainer = document.querySelector(`[data-panel="${panelState.id}"]`) as HTMLElement
    if (!scrollContainer) return

    const wheelListener = getSyncWheelListener(scrollContainer)
    scrollStore.getState().registerListener(panelState.id, {
      element: scrollContainer,
      eventName: 'wheel',
      listener: wheelListener
    })

    const otherPanelStates = panelStates.filter(p => p.id !== panelState.id)

    const scrollListener = getSyncScrollListener(scrollContainer, otherPanelStates)
    scrollStore.getState().registerListener(panelState.id, {
      element: scrollContainer,
      eventName: 'scroll',
      listener: scrollListener
    })
  })
}

function getSyncScrollListener(container: HTMLElement, otherPanelStates: PanelState[]) {
  return function () {
    if (isAutoScrolling(container)) return
    otherPanelStates.forEach(otherPanelState => {
      const otherScrollContainer = document.querySelector(`[data-panel="${otherPanelState.id}"]`) as HTMLElement
      if (!otherScrollContainer) return
      syncScrollPosition(container, otherScrollContainer)
    })
  }
}

function getSyncWheelListener(container: HTMLElement) {
  return function () {
    removeAutoScrolling(container)
  }
}

function setupScrollPanels(panelIds: string[]) {
  const panelStates = Object.keys(panelStore.getState().panels)
    .filter(key => panelIds.includes(key))
    .map(key => panelStore.getState().panels[key])

  panelStates.forEach(panelState => setupScrollPanel(panelState))
  setupSyncScrolling(panelStates)
}

export {
  setupScrollPanels,
  selectSyncTargetByIndex
}
