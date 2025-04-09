function runConfigTest(param, name, callback) {
  it(name, () => {
    cy.visit('/e2e.html?' + param);
    callback();
  });
}

describe('Config', () => {
  runConfigTest('', 'theme.primaryColor default', () => {
    cy.get('[data-cy="new-collection"]').should('have.css', 'background-color', 'rgb(52, 86, 170)')
  });
  runConfigTest('theme[primaryColor]=%2300ff00', 'theme.primaryColor custom', () => {
    cy.get('[data-cy="new-collection"]').should('have.css', 'background-color', 'rgb(0, 255, 0)')
  });
  runConfigTest('showNewCollectionButton=false', 'showNewCollectionButton', () => {
    cy.get('[data-cy="new-collection"]').should('be.visible', false)
  });
});
