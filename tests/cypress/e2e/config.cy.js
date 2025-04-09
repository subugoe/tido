function runConfigTest(param, name, callback) {
  it(name, () => {
    cy.visit('/e2e.html?' + param);
    callback();
  });
}

describe('Config', () => {
  runConfigTest('', 'Should apply defaults', () => {
    cy.get('[data-cy="new-collection"]').should('have.css', 'background-color', 'rgb(52, 86, 170)')
    cy.get('[data-cy="global-tree-toggle"]').should('be.visible', true)
    cy.get('[data-cy="new-collection"]').should('be.visible', true)
  });

  // ===== Specific Config Values =====
  runConfigTest('theme[primaryColor]=%2300ff00', 'theme.primaryColor custom', () => {
    cy.get('[data-cy="new-collection"]').should('have.css', 'background-color', 'rgb(0, 255, 0)')
  });
  runConfigTest('showGlobalTree=false', 'showGlobalTree false', () => {
    cy.get('[data-cy="global-tree-toggle"]').should('be.visible', false)
  });
  runConfigTest('showNewCollectionButton=false', 'showNewCollectionButton false', () => {
    cy.get('[data-cy="new-collection"]').should('be.visible', false)
  });
});
