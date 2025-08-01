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

  it('Should switch the panel mode and its corresponding panel body', () => {
    cy.get('#panels-wrapper')
      .find('[data-cy="panel-container"]')
      .find('[data-image-container]')
      .children().should('not.exist')   // data-image-container has no children in 'text' panelMode

      // select split mode
      .get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="panel-modes-toggle"]')
      .children()
      .first()
      .click()
      .parent()
      .children()
      .eq(0)
      .should('have.attr', 'data-cy', 'split')
      .should('have.attr', 'data-selected', 'true')          //'split' mode is selected
      .parent()
      .children()
      .eq(1)
      .should('have.attr', 'data-selected', 'false')

      //below two blocks of code check whether the content is in split mode: the image container is not empty and there is text in scroll container

      .get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="panel-container"]')
      .find('[data-image-container]')
      .children().should('not.have.length', 0)   // data-image-container now has children

      .get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="panel-container"]')
      .find('[data-scroll-container]')
      .contains('fol. 279a')
  })

  //  ------  Navigation  ---------

  it('should switch to next item', () => {
      cy.get('#panels-wrapper')
        .children()
        .eq(0)
        .find('[data-cy="panel-title-and-nav-arrows"]')
        .find('[data-cy="next-button"]')
        .click()

        // item label is updated
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="item-label"]')
      .contains('Page 280')
        // text content is updated

    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('.text-area')
      .contains('fol. 280a')
  })

  it('should navigate in item label', () => {
    // item label is updated
    // text is updated
    // item modal is not anymore in DOM
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="item-label"]')
      .contains('Page 279')
      .click()

      .get('[data-cy="dropdown-items"]')
      .children().should('have.length', 3)
      .eq(2)
      .contains('281')
      .click()

    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="dropdown-items"]').should('not.exist')

    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="item-label"]')
      .contains('Page 281')

    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('.text-area')
      .contains('fol. 281a')
  })

  it('should navigate in manifest and consecutively in item labels', () => {
      cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="manifest-label"]')
      .contains('Einsiedeln, 278 1040')
        .click()
        .get('[data-cy="dropdown-manifests"]')
        .children().should('have.length', 8)
        .eq(1)
        .contains(' Kloster Neuburg, Cod. 251')
        .next()
        .contains('München BSB Cgm 627')
        .click()

        // element 'dropdown-manifests' does not exist anymore in dom, 'dropdown-items' should be now in DOM
        .get('[data-cy="dropdown-manifests"]').should('not.exist')
        .get('[data-cy="dropdown-items"]')
        .children().should('have.length', 7)
        .eq(0).contains('243r')
        .next()
        .contains('243v')
        .click()

    // clicking this item: updates manifest and item labels and the text content
    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="dropdown-items"]').should('not.exist')
      .get('#panels-wrapper').find('.panel').eq(0)
      .find('[data-cy="manifest-label"]')
      .contains('München BSB Cgm 627')

    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('[data-cy="item-label"]')
      .contains('243v')

    cy.get('#panels-wrapper')
      .children().eq(0)
      .find('.text-area')
      .contains('fol. 243va')
  })

  // ----------- End of Navigation ---------

});
