describe('Panel', () => {
  beforeEach(() => {
    cy.visit('/4w-local.html')
  });

  it('Should navigate correctly in local tree', () => {
    // click collection title opens a tree with the expanded root collection and
    cy.get('[data-cy="panels-wrapper"]')
      .find('[data-cy="panel"]')
      .eq(0)
      .find('[data-cy="collection-title"]')
      .find('span')
      .contains( 'Ebene 1: Reproduktion der Dokumente')
      .click()
      .get('[data-cy="tree"]')
      .children().eq(1)
      .children('[data-cy="tree-node"]')
      .should('have.length', 1)           // initially we have one root node
      .children('[data-cy="node-children"]')
      .children()
      .should('have.length', 8)           // children exists -> the root node is expanded initially

    // click at manifest and item updates the content correctly
      .eq(2).click()
      .find('[data-cy="node-children"]')
      .first()
      .children().should('have.length', 7)    // number of items of manifest
      .eq(1).click()
      .get('[data-radix-popper-content-wrapper]')     // popover is closed
      .should('not.exist')
      .get('[data-cy="manifest-label"]')
      .contains('München BSB Cgm 627')
      .get('[data-cy="item-label"]')
      .contains('Page 243v')
      .get('#panels-wrapper')
      .find('.text-area').first()
      .contains('fol. 243va')
  })

  it('Should display the configured panelModes and the defaultPanelMode as selected', () => {
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="panel-modes-toggle"]')
      .first()
      .children()
      .should('have.length', 3)
      .eq(1)                    // order of panelModes is displayed as provided
      .should('have.attr', 'data-cy', 'text')
      .should('have.attr', 'data-selected', 'true')
      .parent()
      .children().eq(0)
      .should('have.attr', 'data-cy', 'split')
  })
});
