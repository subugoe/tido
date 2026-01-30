/**
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getPanelModeSelect() {
  return cy.get('[data-cy="panel-mode-select"]')
}

/**
 * @param {string} mode
 * @param {boolean} isDropdownMenuOpen 
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getPanelModeOption(mode, isDropdownMenuOpen=false) {
  if (!isDropdownMenuOpen) {
    getPanelModeSelect().click()
  }
  return cy
    .get('[data-cy="panel-mode-menu"]')
    .find(`[data-cy="${mode}"]`)
}

export const Panel = {
    getPanelModeSelect,
    getPanelModeOption,
}