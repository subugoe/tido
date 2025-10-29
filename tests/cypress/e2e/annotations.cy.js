
Cypress.Commands.add('getPanel', () => {
  cy.get('#panels-wrapper').should('be.visible')
    .find('.panel')
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
      cy.getPanel()
        .find('[data-sidebar-container="true"]')
        .find('[data-annotation]')
        .should('have.length', 7)

        .eq(0).contains('ܚܝܩܪ')
        .parents('[data-sidebar-container="true"]')
        .find('[data-annotation]')
        .eq(2).contains('ܣܪܚܐܕܘܡ')
    })

    it('Should initially display the annotation types as selected', () => {
      cy.getPanel()
        .find('[data-cy="annotations-header"]')
        .find('[data-cy="annotation-types"]')
        .children()
        .should('have.length', 2)
        .eq(0)
        .should('contain', 'Person')
        .should('have.attr', 'data-selected', 'true')

        .parents('[data-cy="annotation-types"]')
        .children()
        .eq(1)
        .should('contain', 'Place')
        .should('have.attr', 'data-selected', 'true')
    })

  it ('Should hide respective annotations when deselecting certain annotation type', () => {
    cy.getPanel()
      .find('[data-cy="annotations-header"]')
      .find('[data-cy="annotation-types"]')
      .children()
      .eq(0).click()

    cy.getPanel()
      .find('[data-sidebar-container="true"]')
      .find('[data-annotation]')
      .should('have.length', 2)
      .eq(0).should('contain', 'Place')
      .next().should('contain', 'Place')
  })
  }
)
