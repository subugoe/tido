function runConfigTest(param, name, callback) {
  it(name, () => {
    cy.visit('/e2e.html?' + param);
    callback();
  });
}

describe('Config', () => {
  runConfigTest('', 'Should apply defaults', () => {
    cy.get('[data-cy="new-panel"]').should('have.css', 'background-color', 'rgb(52, 86, 170)')
    cy.get('[data-cy="global-tree-toggle"]').should('be.visible', true)
    cy.get('[data-cy="new-panel"]').should('be.visible', true)
    cy.get('[data-cy="new-panel"]').should('have.text', 'Add New Panel')
    cy.get('[data-cy="swap"]').should('have.attr', 'data-selected', 'true')
    cy.get('[data-cy="panel-placeholder"]').should('be.visible', true)
  });

  // ===== Specific Config Values =====
  runConfigTest('theme[primaryColor]=%2300ff00', 'theme.primaryColor custom', () => {
    cy.get('[data-cy="new-panel"]').should('have.css', 'background-color', 'rgb(0, 255, 0)')
  });
  runConfigTest('showGlobalTree=false', 'showGlobalTree false', () => {
    cy.get('[data-cy="global-tree-toggle"]').should('be.visible', false)
  });
  runConfigTest('showAddNewPanelButton=false', 'showAddNewPanelButton false', () => {
    cy.get('[data-cy="new-panel"]').should('be.visible', false)
  });
  runConfigTest('lang=de', 'translations: read from default `de` file', () => {
    cy.get('[data-cy="new-panel"]').should('have.text', 'Neues Panel hinzufügen')
  });
  runConfigTest('defaultView=split', 'defaultView: split', () => {
    cy.get('[data-cy="split"]').should('have.attr', 'data-selected', 'true')
  });
  runConfigTest('panelPlaceholder=false', 'panelPlaceholder: false', () => {
    cy.get('[data-cy="panel-placeholder"]').should('be.visible', false)
  });
});
