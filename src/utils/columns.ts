// The columns sub-annotations open in, between the texts and the sidebar - mirrored to a file
// browser: level 1 next to the sidebar, deeper levels further left. Plain functions, so how many
// columns are shown in full and what a column quotes can be followed without the components.

export const COLUMN_WIDTH = 300
export const STRIP_WIDTH = 40
// the narrowest a text gets while columns are open, as far as the room allows
export const MIN_TEXT_WIDTH = 240

// How many of the given levels are shown as full columns in the room left once every text has its
// minimum width. Two when the second one still fits next to the strips of the older levels, else
// one - never none, so a narrow panel still shows the deepest level.
export function getFullColumnCount(levels: number, available: number): number {
  if (levels <= 0) return 0
  if (levels === 1) return 1
  return (levels - 2) * STRIP_WIDTH + 2 * COLUMN_WIDTH <= available ? 2 : 1
}

export function getColumnsWidth(levels: number, fullCount: number): number {
  return fullCount * COLUMN_WIDTH + Math.max(0, levels - fullCount) * STRIP_WIDTH
}

export interface Excerpt {
  before: string
  match: string
  after: string
  // whether text was left out before or after the excerpt
  cutBefore: boolean
  cutAfter: boolean
}

function collapse(value: string) {
  return value.replace(/\s+/g, ' ')
}

// The part of a text around [start, end): up to radius characters on either side, cut back to the
// nearest word boundary so no word is broken.
export function getExcerpt(text: string, start: number, end: number, radius = 80): Excerpt {
  let from = Math.max(0, start - radius)
  let to = Math.min(text.length, end + radius)

  if (from > 0) {
    const space = text.indexOf(' ', from)
    from = space !== -1 && space < start ? space + 1 : start
  }
  if (to < text.length) {
    const space = text.lastIndexOf(' ', to)
    to = space !== -1 && space >= end ? space : end
  }

  return {
    before: collapse(text.slice(from, start)).trimStart(),
    match: collapse(text.slice(start, end)),
    after: collapse(text.slice(end, to)).trimEnd(),
    cutBefore: from > 0,
    cutAfter: to < text.length
  }
}

// Where the element a selector matches sits in the plain text of a note: its character range.
// Null when the note has no such element.
export function findInNote(html: string, selector: string): { text: string, start: number, end: number } | null {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  let el: Element | null = null
  try {
    el = doc.body.querySelector(selector)
  } catch {
    return null
  }
  if (!el) return null

  const range = doc.createRange()
  range.setStart(doc.body, 0)
  range.setEndBefore(el)
  const start = range.toString().length

  return { text: doc.body.textContent ?? '', start, end: start + (el.textContent ?? '').length }
}
