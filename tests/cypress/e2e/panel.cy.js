describe('Panel', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  it('Should navigate correctly in local tree', () => {
    // click collection title opens a tree with the right root collection
    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .eq(0)
      .find('[data-cy="collection-title"]')
      .click()
      .get('[data-cy="tree"]')
      .children()
      .eq(0)
      .children()
      .should('have.length', 1)           // one root node
      .children('[data-cy="node-children"]')
      .children()
      .should('have.length', 8)           // children exists -> the root node is expanded initially
  })
});
