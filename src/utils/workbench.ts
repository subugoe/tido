// The state of the workbench in the aligned annotations sidebar: a stack of cards, each standing for
// one annotation or a group of them. Plain functions over plain data, so every rule about which card
// shows what can be followed without the components around it.

export interface WorkbenchCard {
  // stable for the same set of annotations
  key: string
  // the annotations of the column the card shows, in column order
  annotationIds: string[]
  collapsed: boolean
  // the rows of the card that are expanded, by annotation id
  expandedRows: string[]
  // per row: the chain of sub-annotations opened below it, outermost first
  subPaths: Record<string, string[]>
}

export interface WorkbenchState {
  // newest first - the top card is the first one
  cards: WorkbenchCard[]
  activeKey: string | null
}

export const EMPTY_WORKBENCH: WorkbenchState = { cards: [], activeKey: null }

export function getCardKey(annotationIds: string[]): string {
  return annotationIds.join('|')
}

export function createCard(annotationIds: string[], expandedRows: string[] = []): WorkbenchCard {
  return { key: getCardKey(annotationIds), annotationIds, collapsed: false, expandedRows, subPaths: {} }
}

function contains(card: WorkbenchCard, ids: string[]) {
  return ids.every((id) => card.annotationIds.includes(id))
}

function moveToTop(cards: WorkbenchCard[], card: WorkbenchCard): WorkbenchCard[] {
  return [card, ...cards.filter((c) => c.key !== card.key)]
}

// Opens a card for the given annotations - or brings forward what already shows them, so nothing
// is on the workbench twice:
// - a card that already shows all of them moves to the top
// - cards that show only some of them are taken into the new one (a group opened after one of its
//   members), keeping what was expanded in them
// The opened card is the active one, uncollapsed, with the given rows expanded on top.
export function openCard(state: WorkbenchState, annotationIds: string[], expandRows: string[] = []): WorkbenchState {
  if (annotationIds.length === 0) return state

  const existing = state.cards.find((card) => contains(card, annotationIds))
  if (existing) {
    const updated: WorkbenchCard = {
      ...existing,
      collapsed: false,
      expandedRows: [...new Set([...existing.expandedRows, ...expandRows])]
    }
    return { cards: moveToTop(state.cards, updated), activeKey: updated.key }
  }

  const absorbed = state.cards.filter((card) => card.annotationIds.every((id) => annotationIds.includes(id)))
  const card = createCard(annotationIds, [...new Set([...absorbed.flatMap((c) => c.expandedRows), ...expandRows])])
  card.subPaths = Object.assign({}, ...absorbed.map((c) => c.subPaths))

  const rest = state.cards.filter((c) => !absorbed.includes(c))
  return { cards: [card, ...rest], activeKey: card.key }
}

// Removes a card. When it was the active one, the card now on top becomes active.
export function closeCard(state: WorkbenchState, key: string): WorkbenchState {
  const cards = state.cards.filter((card) => card.key !== key)
  const activeKey = state.activeKey === key ? (cards[0]?.key ?? null) : state.activeKey
  return { cards, activeKey }
}

export function closeAll(): WorkbenchState {
  return EMPTY_WORKBENCH
}

export function setActive(state: WorkbenchState, key: string): WorkbenchState {
  return state.cards.some((card) => card.key === key) ? { ...state, activeKey: key } : state
}

function updateCard(state: WorkbenchState, key: string, update: (card: WorkbenchCard) => WorkbenchCard): WorkbenchState {
  return { ...state, cards: state.cards.map((card) => card.key === key ? update(card) : card) }
}

export function toggleCollapsed(state: WorkbenchState, key: string): WorkbenchState {
  return updateCard(state, key, (card) => ({ ...card, collapsed: !card.collapsed }))
}

export function collapseAll(state: WorkbenchState): WorkbenchState {
  return { ...state, cards: state.cards.map((card) => ({ ...card, collapsed: true })) }
}

export function toggleRow(state: WorkbenchState, key: string, annotationId: string): WorkbenchState {
  return updateCard(state, key, (card) => card.expandedRows.includes(annotationId)
    ? { ...card, expandedRows: card.expandedRows.filter((id) => id !== annotationId) }
    : { ...card, expandedRows: [...card.expandedRows, annotationId] })
}

// Opens the chain of sub-annotations below a row - replacing what was open below it, as a path
// leads down one branch at a time. The row itself is expanded too.
export function setSubPath(state: WorkbenchState, key: string, rowId: string, path: string[]): WorkbenchState {
  return updateCard(state, key, (card) => ({
    ...card,
    expandedRows: card.expandedRows.includes(rowId) ? card.expandedRows : [...card.expandedRows, rowId],
    subPaths: { ...card.subPaths, [rowId]: path }
  }))
}

// What Escape closes: the deepest open sub-annotation of the active card, else the card itself.
export function closeDeepest(state: WorkbenchState): WorkbenchState {
  const card = state.cards.find((c) => c.key === state.activeKey)
  if (!card) return state

  const deepestRow = Object.keys(card.subPaths)
    .filter((rowId) => card.subPaths[rowId].length > 0)
    .sort((a, b) => card.subPaths[b].length - card.subPaths[a].length)[0]

  if (deepestRow) {
    return setSubPath(state, card.key, deepestRow, card.subPaths[deepestRow].slice(0, -1))
  }

  return closeCard(state, card.key)
}

export function findCardWith(state: WorkbenchState, annotationId: string): WorkbenchCard | undefined {
  return state.cards.find((card) => card.annotationIds.includes(annotationId))
}

// The chain from a root annotation of the column down to the given annotation, outermost first:
// [root, child, ..., annotation]. Empty when the annotation does not hang off a root.
export function getAncestorChain(annotationId: string, parentOf: (id: string) => string | null, isRoot: (id: string) => boolean): string[] {
  const chain: string[] = []
  const seen = new Set<string>()
  let current: string | null = annotationId

  while (current && !seen.has(current)) {
    seen.add(current)
    chain.unshift(current)
    if (isRoot(current)) return chain
    current = parentOf(current)
  }

  return []
}
