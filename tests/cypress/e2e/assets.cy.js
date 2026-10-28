const cssUrl = 'http://localhost:8181/4w/css/styles-2.css'

describe('Manifest assets', () => {
  beforeEach(() => {
    cy.intercept('GET', cssUrl).as('assetCss')
    cy.visit('/e2e.html?panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json')
  })

  it('Should request CSS assets identified by their contentType', () => {
    cy.wait('@assetCss').its('response.statusCode').should('eq', 200)

    cy.document()
      .its('head')
      .find(`link[rel="stylesheet"][href="${cssUrl}"]`)
      .should('have.length', 1)
  })
})
