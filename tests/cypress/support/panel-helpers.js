/**
 * Selectors shared by the panel specs - spread them into the selectors of a spec: \`{ ...panelSelectors, ... }\`.
 */
export const panelSelectors = {
  panelsWrapper: '[data-cy="panels-wrapper"]',
  panel: '[data-cy="panel"]',
  panes: '[data-cy="panel-container"] .split-view-view-visible',
  breadcrumb: '[data-cy="panel-breadcrumb"]',
  collectionTitle: '[data-cy="collection-title"]',
  manifestLabel: '[data-cy="manifest-label"]',
  itemLabel: '[data-cy="item-label"]',
  nextItemButton: '[data-cy="next-item-button"]',
  prevItemButton: '[data-cy="prev-item-button"]',
  viewToggles: '[data-cy="panel-views"]',
  viewToggle: '[data-cy="panel-view-toggle"]',
  annotationsToggle: '[data-cy="annotations-toggle"]',
  textContainer: '[data-text-container]',
  contentType: '[data-cy="content-type"]',
  contentTypesDropdown: '[data-cy="content-types-dropdown"]',
  contentTypeOption: '[role="menuitemradio"]',
  annotationsView: '[data-annotations-view]',
  annotationsScrollContainer: '[data-annotations-scroll-container]',
  annotationsHeader: '[data-cy="annotations-header"]',
  annotationsLoading: '[data-cy="annotations-loading"]',
  popover: '[data-slot="popover-content"]',
  checkbox: '[data-slot="checkbox"]',
}

/**
 * The view toggles of a panel in its header: one per pane, the annotations among them.
 * @param {number} panelIndex
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} the toggle group
 */
export function getPanelViews(panelIndex = 0) {
  return cy.get('[data-cy="panels-wrapper"]')
    .find('[data-cy="panel"]')
    .eq(panelIndex)
    .find('[data-cy="panel-views"]')
}

/**
 * Toggles the text or image view at viewIndex in the panel at panelIndex.
 * @param {number} panelIndex
 * @param {number} viewIndex
 */
export function togglePanelView(panelIndex, viewIndex) {
  getPanelViews(panelIndex)
    .find('[data-cy="panel-view-toggle"]')
    .eq(viewIndex)
    .click()
}

export const Panel = {
  getPanelViews,
  togglePanelView,
}
