describe('Tree', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  it('Should render app container', () => {
    cy.get('[data-cy="app"]').should('be.visible');
  });

  it('Should display collection node', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('[data-cy="tree-node"]').should('be.visible')
      .find('span')
      .should("have.text", "Vier Wachen vernetzt: Digitale Edition eines mystischen Traktats des Spätmittelalters");
  })
});
