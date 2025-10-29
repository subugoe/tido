
Cypress.Commands.add('getPanel', () => {
  cy.get('#panels-wrapper').should('be.visible')
    .find('.panel')
})

Cypress.Commands.add('clickAnnotationType', (i) => {
  cy.getPanel()
    .find('[data-cy="annotations-header"]')
    .find('[data-cy="annotation-types"]')
    .children()
    .eq(i).click()
})

Cypress.Commands.add('checkNumberAnnotations', (number) => {
  cy.getPanel()
    .find('[data-sidebar-container="true"]')
    .find('[data-annotation]')
    .should('have.length', number)
})

Cypress.Commands.add('checkNumberAnnotationTypes', (number) => {
  cy.getPanel()
    .find('[data-cy="annotations-header"]')
    .find('[data-cy="annotation-types"]')
    .children()
    .should('have.length', number)
})

Cypress.Commands.add('switchContentType', (index) => {
  cy.getPanel()
    .find('[data-text-options="true"]')
    .find('button')
    .eq(0)    // open dropdown menu and not click at the right eye symbol
    .click()
    .get('[data-slot="dropdown-menu-radio-group"]')
    .children()
    .eq(index).click()  // change to content type of provided index
})





describe('Annotations', () => {
    beforeEach(() => {
      cy.visit('/ahiqar-local.html')
      cy.getPanel()
        .find('[data-cy="sidebar-toggle"]')
        .click()
        .wait(100)
    });

    it('Should check the initial number of annotations and a few values', () => {
      cy.checkNumberAnnotations(7)

        .eq(0).contains('ܚܝܩܪ')
        .parents('[data-sidebar-container="true"]')
        .find('[data-annotation]')
        .eq(2).contains('ܣܪܚܐܕܘܡ')
    })

    it('Should initially display the annotation types as selected', () => {
      cy.checkNumberAnnotationTypes(2)
        .eq(0)
        .should('contain', 'Person')
        .should('have.attr', 'data-selected', 'true')

        .parents('[data-cy="annotation-types"]')
        .children()
        .eq(1)
        .should('contain', 'Place')
        .should('have.attr', 'data-selected', 'true')
    })

    it('Should hide respective annotations when deselecting certain annotation type', () => {
      cy.clickAnnotationType(0)

      cy.checkNumberAnnotations(2)
        .eq(0).should('contain', 'Place')
        .next().should('contain', 'Place')
    })

    it('Should redisplay respective annotations when reselecting annotation type', () => {
      cy.clickAnnotationType(0)
      cy.clickAnnotationType(0)

      cy.checkNumberAnnotations(7)
    })

    it('Should hide all annotations when deselecting all annotation types', () => {
      cy.clickAnnotationType(0)
      cy.clickAnnotationType(1)

      cy.checkNumberAnnotations(0)
    })

  it('Should update annotation types on content type switch', () => {
    cy.switchContentType(1)
      .checkNumberAnnotationTypes(4)
      .eq(0).should('have.attr', 'data-selected', 'true').and('contain', 'Person')
      .next().should('have.attr', 'data-selected', 'true').and('contain', 'Place')
      .next().should('have.attr', 'data-selected', 'true').and('contain', 'Editorial Comment')
      .next().should('have.attr', 'data-selected', 'true').and('contain', 'Motif')
  })



  it('Should preserve annotation types selection and hide respective annotations on item change', () => {
    cy.switchContentType(1)
  })

  }
)
