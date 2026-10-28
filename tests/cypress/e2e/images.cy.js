const manifest = 'http://localhost:8181/example/manifests/images-test.json'
const noImagesItem = 'http://localhost:8181/example/items/no-images-page.json'
const emptyImagesItem = 'http://localhost:8181/example/items/empty-images-page.json'
const withImagesItem = 'http://localhost:8181/example/items/with-images-page.json'

const imageContainer = '[data-image-container]'
const textContainer = '[data-text-container]'
const panelContainer = '[data-cy="panel-container"]'
const nextItemButton = '[data-cy="next-item-button"]'
const prevItemButton = '[data-cy="prev-item-button"]'

describe('Image pane handling based on images key, when the views are not configured', () => {
  describe('When item has an empty images array', () => {
    beforeEach(() => {
      cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${emptyImagesItem}`)
    })

    it('should show only the text pane', () => {
      cy.get(panelContainer).within(() => {
        cy.get(imageContainer).should('not.exist')
        cy.get(textContainer).should('have.length', 1).and('be.visible')
      })
    })
  })

  describe('When item has images', () => {
    beforeEach(() => {
      cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${withImagesItem}`)
    })

    it('should show the image and the text pane', () => {
      cy.get(panelContainer).within(() => {
        cy.get(imageContainer).should('have.length', 1).and('be.visible')
        cy.get(textContainer).should('have.length', 1).and('be.visible')
      })
    })
  })

  describe('When navigating from items without images to an item with images', () => {
    // the manifest order is: no images key, empty images array, with images
    beforeEach(() => {
      cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${noImagesItem}`)
    })

    function shouldShowOnlyTextPane() {
      cy.get(panelContainer).within(() => {
        cy.get(imageContainer).should('not.exist')
        cy.get(textContainer).should('have.length', 1).and('be.visible')
      })
    }

    it('should show the image and the text pane, and only the text pane after navigating back to the first item', () => {
      shouldShowOnlyTextPane()

      cy.get(nextItemButton).click()
      shouldShowOnlyTextPane()

      cy.get(nextItemButton).click()
      cy.get(panelContainer).within(() => {
        cy.get(imageContainer).should('have.length', 1).and('be.visible')
        // the image is loaded correctly, no error is shown
        cy.get(imageContainer).find('.openseadragon-canvas').should('exist')
        cy.get(imageContainer).should('not.contain.text', 'Retry')
        cy.get(textContainer).should('have.length', 1).and('be.visible')
      })

      cy.get(prevItemButton).click()
      shouldShowOnlyTextPane()

      cy.get(prevItemButton).click()
      shouldShowOnlyTextPane()
    })
  })
})
