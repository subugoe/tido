import { getAnnotationTargets } from '@/utils/annotation-data.ts'
import { getSelectorValue, getSource } from '@/utils/annotations.ts'

// The layout of the aligned annotations sidebar: every annotation of the panel's visible texts in one
// column, each entry at the height of its target. Positions are measured in the coordinate system of
// the target's own text (its top within the scrolled content), so they do not depend on how far a
// text is scrolled and are only recomputed when the layout of a text or the sidebar changes - never
// on scrolling and never on a selection.

// Height of an entry and the gap below it.
export const ALIGNED_ITEM_HEIGHT = 30
export const ALIGNED_ITEM_GAP = 4
// How far an entry may be pushed below its target before it joins the slot above as a group
// instead. 0 means an entry stands either exactly at its target or in the group above it.
export const ALIGNED_TOLERANCE = 0

export interface AlignedEntry {
  annotation: Annotation
  contentUrl: string
  // position of the text in the panel (panelViews order), breaks ties between equal tops
  textIndex: number
  // top and bottom of the target in sidebar coordinates
  top: number
  bottom: number
  // top of the target within the scrolled content of its own text
  textTop: number
}

export interface AlignedSlot {
  // the id of the first member - stable as long as that member stays first
  id: string
  // top of the slot in sidebar coordinates
  y: number
  members: AlignedEntry[]
}

export interface AlignedLayoutOptions {
  itemHeight?: number
  gap?: number
  tolerance?: number
}

// The letter a text of the panel is referred to by in the aligned column: A for the first visible
// text, B for the second and so on.
export function getTextLetter(textIndex: number): string {
  return String.fromCharCode(65 + textIndex)
}

export function getEntryKey(entry: Pick<AlignedEntry, 'contentUrl' | 'annotation'>): string {
  return `${entry.contentUrl}|${entry.annotation.id}`
}

// Sorts the entries by the top of their target - by text order on a tie - and stacks them into
// slots. An entry that would have to be pushed further below its target than the tolerance allows
// becomes a member of the slot above.
export function layoutAligned(entries: AlignedEntry[], options: AlignedLayoutOptions = {}): AlignedSlot[] {
  const itemHeight = options.itemHeight ?? ALIGNED_ITEM_HEIGHT
  const gap = options.gap ?? ALIGNED_ITEM_GAP
  const tolerance = options.tolerance ?? ALIGNED_TOLERANCE

  const sorted = [...entries].sort((a, b) => (a.top - b.top) || (a.textIndex - b.textIndex))

  const slots: AlignedSlot[] = []
  let bottom = 0

  sorted.forEach((entry) => {
    const y = Math.max(entry.top, bottom)
    const previous = slots[slots.length - 1]

    if (previous && (y - entry.top) > tolerance) {
      previous.members.push(entry)
      return
    }

    slots.push({ id: getEntryKey(entry), y, members: [entry] })
    bottom = y + itemHeight + gap
  })

  return slots
}

export interface AlignedText {
  contentUrl: string
  container: HTMLElement
  annotations: Annotation[]
}

export interface AlignedMeasurement {
  entries: AlignedEntry[]
  // the scroll height the sidebar needs so it can follow every text to its end
  innerHeight: number
}

// The elements the annotation targets in this text. A selector may match several elements - a
// passage spanning paragraphs - and all of them belong to the target.
function getTargetElements(annotation: Annotation, contentUrl: string, container: HTMLElement): Element[] {
  return getAnnotationTargets(annotation)
    .filter((target) => getSource(target).id === contentUrl)
    .flatMap((target) => {
      const selector = getSelectorValue(target)
      if (!selector) return []
      try {
        // scoped to the text like in matchAnnotations
        return Array.from(container.querySelectorAll(`:scope ${selector}`))
      } catch {
        return []
      }
    })
}

// Measures the targets of every text against the sidebar. A target's position is its top within
// the scrolled content of its text, shifted by how far the text's viewport starts below the
// sidebar's - so with sidebar.scrollTop equal to the text's scrollTop the entry and its target
// stand at the same height on screen.
export function measureAligned(texts: AlignedText[], sidebar: HTMLElement): AlignedMeasurement {
  const sidebarTop = sidebar.getBoundingClientRect().top
  const entries: AlignedEntry[] = []
  let innerHeight = 0

  texts.forEach(({ contentUrl, container, annotations }, textIndex) => {
    const containerTop = container.getBoundingClientRect().top
    const offset = containerTop - sidebarTop
    const toText = (viewportY: number) => viewportY - containerTop + container.scrollTop
    const toSidebar = (viewportY: number) => toText(viewportY) + offset

    innerHeight = Math.max(innerHeight, container.scrollHeight + offset)

    annotations.forEach((annotation) => {
      const elements = getTargetElements(annotation, contentUrl, container)
      if (elements.length === 0) return

      let top = Infinity
      let bottom = -Infinity
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        top = Math.min(top, rect.top)
        bottom = Math.max(bottom, rect.bottom)
      })

      entries.push({ annotation, contentUrl, textIndex, top: toSidebar(top), bottom: toSidebar(bottom), textTop: toText(top) })
    })
  })

  return { entries, innerHeight }
}
