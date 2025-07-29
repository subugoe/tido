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
      .should('have.length', 1)
      .find('[data-cy="tree-node"]')
      .first()
      .children()
      .eq(1)
      .children().should('have.length', 8)
  })
});
