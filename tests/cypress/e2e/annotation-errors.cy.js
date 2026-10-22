describe('Annotation data errors', () => {

  const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
  const manifest = `${apiUrl}/example/manifests/broken-annotations.json`;
  const item = `${apiUrl}/example/items/broken-annotations-page.json`;

  // The item's text is Pride and Prejudice, Chapter 1. Of its four annotations only the first one
  // (#truth) is valid - the others have an empty, an invalid and a non-matching selector.
  const selectors = {
    textContainer: '[data-text-container]',
    textWarning: '[data-text-warning]',
  };

  beforeEach(() => {
    const params = new URLSearchParams()
    params.set('annotations.defaultMode', 'list')
    params.set('panels[0].manifest', manifest)
    params.set('panels[0].item', item)

    cy.visit(`/e2e.html?${params.toString()}`)
  })

  it('Shows the text despite the broken annotations', () => {
    cy.get(selectors.textContainer).should('contain.text', 'It is a truth universally acknowledged')
  })

  it('Still highlights the targets of the valid annotations', () => {
    cy.get(selectors.textContainer).find('#truth').should('have.class', 'bg-accent')
  })

  it('Tells the visitor that there are problems with the annotations', () => {
    cy.get(selectors.textWarning).should('be.visible').and('not.be.empty')
  })

  it('Hides the warning when it is dismissed', () => {
    cy.get(selectors.textWarning).find('button').click()
    cy.get(selectors.textWarning).should('be.empty')
  })
})
