// Helpers for the aligned annotations column. Every annotation has an entry there, either on its
// own - then it stands exactly at the height of its target - or as a member of a group, when its
// own place was taken: the group stands above the target then. A collapsed group keeps its members
// in the DOM, hidden, so an entry can always be looked up by its annotation.

// Mirror ALIGNED_ITEM_HEIGHT and ALIGNED_ITEM_GAP in src/utils/aligned-layout.ts.
export const ALIGNED_ITEM_HEIGHT = 30
export const ALIGNED_ITEM_GAP = 4

/**
 * The element an entry is shown as: the entry itself, or the group it is a member of.
 * @param {HTMLElement} entryEl
 * @returns {HTMLElement}
 */
export function slotOf(entryEl) {
  return entryEl.parentElement.closest('[data-annotation-group]') ?? entryEl
}

/**
 * Whether the entry is a member of a group rather than standing on its own.
 * @param {HTMLElement} entryEl
 */
export function isGrouped(entryEl) {
  return slotOf(entryEl) !== entryEl
}

/**
 * Asserts, synchronously (use inside a `.should` callback), that the entry is shown at its target:
 * on its own at the target's height, in a group above it otherwise - and that what shows it lies
 * inside the visible part of the sidebar.
 * @param {HTMLElement} entryEl
 * @param {HTMLElement} targetEl
 * @param {HTMLElement} sidebarEl the sidebar scroll container
 * @param {number} tolerance how far a single entry may stand off its target, 0 for exactly
 */
export function assertEntryAtTarget(entryEl, targetEl, sidebarEl, tolerance = 0) {
  const slot = slotOf(entryEl)
  const slotY = slot.getBoundingClientRect().top
  const targetY = targetEl.getBoundingClientRect().top
  const sidebarRect = sidebarEl.getBoundingClientRect()

  expect(slotY, 'entry is inside the sidebar viewport').to.be.within(sidebarRect.top, sidebarRect.bottom)

  if (slot === entryEl) {
    expect(slotY, `entry y ${slotY} vs target y ${targetY}`).to.be.closeTo(targetY, tolerance)
  } else {
    expect(slotY, `group y ${slotY} stands above target y ${targetY}`).to.be.at.most(targetY + tolerance)
  }
}

/**
 * Asserts, synchronously, that no two slots of the column overlap: each one starts at least an
 * item height and a gap below the one above it.
 * @param {HTMLElement} sidebarEl the sidebar scroll container
 */
export function assertNoOverlappingSlots(sidebarEl) {
  const list = sidebarEl.querySelector('[data-aligned-list]')
  const tops = [...list.children].map((slot) => slot.getBoundingClientRect().top).sort((a, b) => a - b)

  tops.slice(1).forEach((top, i) => {
    expect(top - tops[i], 'slot starts below the one above it').to.be.at.least(ALIGNED_ITEM_HEIGHT + ALIGNED_ITEM_GAP - 1)
  })
}
