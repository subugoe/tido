function runConfigTest(param, name, callback) {
  it(name, () => {
    cy.visit('/e2e.html?' + param);
    callback();
  });
}

describe('Config', () => {
  runConfigTest('theme[primaryColor]=%2300ff00', 'theme.primaryColor', () => {
    cy.get('[data-cy="new-collection"]').should('have.css', 'background-color', 'rgb(0, 255, 0)')
  });
});
