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

  it('Should render manifests of collection', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('[data-cy="tree-node"]')
      .click()
    cy.get('[data-cy="tree-node-child"]')
      .children()
      .should('have.length', 8)
    cy.get('[data-cy="tree-node-child"]')
      .first()
      .should('have.text','Einsiedeln, 278 1040')
      .next()
      .should('have.text', 'Kloster Neuburg, Cod. 251')
  })

  it('Should show the right number of items', () => {
    cy.get('[data-cy="global-tree-toggle"]').click()
    cy.get('[data-cy="tree-node"]')
      .click()
    cy.get('[data-cy="tree-node-child"]')
      .first()
      .click()
      .find('[data-cy="tree-node-child"]')
      .should('have.length', 3)
  })
});
