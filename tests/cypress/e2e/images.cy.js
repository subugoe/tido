const manifest = 'http://localhost:8181/example/manifests/images-test.json'
const noImagesItem = 'http://localhost:8181/example/items/no-images-page.json'
const emptyImagesItem = 'http://localhost:8181/example/items/empty-images-page.json'

const imageContainer = '[data-image-container]'
const panelContainer = '[data-cy="panel-container"]'

describe('Image pane handling based on images key', () => {
  describe('When item has no images key', () => {
    beforeEach(() => {
      cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${noImagesItem}`)
    })

    it('should hide the image pane by default', () => {
      cy.get(panelContainer).within(() => {
        cy.get(imageContainer).should('not.exist')
      })
    })

    it('should still show the text pane', () => {
      cy.get(panelContainer).within(() => {
        cy.get('[data-text-container]').should('be.visible')
      })
    })
  })

  describe('When item has no images key but image view is explicitly configured', () => {
    beforeEach(() => {
      const imageView = `panelViews[]=${encodeURIComponent(JSON.stringify({ label: 'Image', view: 'image' }))}`
      const textView = `panelViews[]=${encodeURIComponent(JSON.stringify({ label: 'Text', view: 'text' }))}`
      cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${noImagesItem}&${imageView}&${textView}`)
    })

    it('should keep the image pane visible', () => {
      cy.get(panelContainer).within(() => {
        cy.get(imageContainer).should('exist')
      })
    })
  })

  describe('When item has empty images array', () => {
    beforeEach(() => {
      cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${emptyImagesItem}`)
    })

    it('should show the image pane with a no images error', () => {
      cy.get(panelContainer).within(() => {
        cy.get(imageContainer).should('be.visible')
        cy.get(imageContainer).should('contain.text', 'No images found for this item.')
      })
    })

    it('should show the no image available header', () => {
      cy.get(panelContainer).within(() => {
        cy.get(imageContainer).should('contain.text', 'No image available')
      })
    })

    it('should show a retry button', () => {
      cy.get(panelContainer).within(() => {
        cy.get(imageContainer).find('button').should('contain.text', 'Retry')
      })
    })
  })
})
