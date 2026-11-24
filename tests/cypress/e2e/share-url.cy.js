// The share example hides TIDO's own share button and creates the share url with Tido.getShareUrl()
describe('Share URL example', () => {
  beforeEach(() => {
    cy.visit('/share.html')
    cy.get('#share-button').should('be.enabled')
  })

  it('hides the share button of TIDO', () => {
    cy.get('[data-cy="rail-sidebar"]').should('be.visible')
    cy.get('[data-cy="share"]').should('not.exist')
  })

  it('shows the share url of the current panels in the dialog of the page', () => {
    cy.get('#share-button').click()
    cy.get('#share-dialog').should('be.visible')
    cy.get('#share-error').should('not.be.visible')

    cy.get('#share-url').invoke('val').should('include', 'tido=').then((value) => {
      const url = new URL(value)
      expect(url.pathname).to.eq('/share.html')

      cy.window()
        .then(win => win.Tido.decodeState(url.searchParams.get('tido')))
        .then((state) => {
          expect(state.target).to.have.length(1)
          expect(state.target[0].type).to.eq('Item')
          expect(state.target[0].partOf.partOf.id).to.include('/api/collections/example.json')
        })
    })
  })

  it('restores the panels from the share url', () => {
    cy.get('[data-cy="item-label"]').first().invoke('text').then((label) => {
      cy.get('#share-button').click()
      cy.get('#share-url').invoke('val').should('include', 'tido=').then((value) => {
        cy.visit(value)
        cy.get('#share-button').should('be.enabled')
        cy.get('[data-cy="panel"]').should('have.length', 1)
        cy.get('[data-cy="item-label"]').first().should('have.text', label)
      })
    })
  })
})
