/**
 * Opens the panel's "more" menu (the "…" button in the panel header) whose dropdown holds the
 * per-view visibility switches.
 * @param {number} panelIndex
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} the visible panel menu dropdown
 */
export function openPanelViewMenu(panelIndex = 0) {
  cy.get('[data-cy="panels-wrapper"]')
    .find('[data-cy="panel"]')
    .eq(panelIndex)
    .find('[data-cy="panel-menu"]')
    .click()

  return cy.get('[data-cy="panel-menu-dropdown"]').should('be.visible')
}

/**
 * Toggles the visibility switch of the view at viewIndex in the panel at panelIndex's menu and
 * closes the menu again.
 * @param {number} panelIndex
 * @param {number} viewIndex
 */
export function togglePanelView(panelIndex, viewIndex) {
  openPanelViewMenu(panelIndex)

  cy.get('[data-cy="panel-menu-dropdown"]')
    .find('[data-cy="panel-view-toggle"]')
    .eq(viewIndex)
    .click()

  closePanelViewMenu()
}

/**
 * Closes an open panel view menu.
 */
export function closePanelViewMenu() {
  cy.get('body').type('{esc}')
  cy.get('[data-cy="panel-menu-dropdown"]').should('not.exist')
}

export const Panel = {
  openPanelViewMenu,
  togglePanelView,
  closePanelViewMenu,
}
