const manifest = 'http://localhost:8181/example/manifests/images-test.json'
const noImagesItem = 'http://localhost:8181/example/items/no-images-page.json'
const emptyImagesItem = 'http://localhost:8181/example/items/empty-images-page.json'
const withImagesItem = 'http://localhost:8181/example/items/with-images-page.json'
const brokenImageItem = 'http://localhost:8181/example/items/broken-image-page.json'
const imageWithoutUrlItem = 'http://localhost:8181/example/items/image-without-url-page.json'

const imageContainer = '[data-image-container]'
const textContainer = '[data-text-container]'
const panelContainer = '[data-cy="panel-container"]'
const nextItemButton = '[data-cy="next-item-button"]'
const prevItemButton = '[data-cy="prev-item-button"]'
const imageEmptyState = '[data-image-empty]'

const imageView = `panelViews[]=${encodeURIComponent(JSON.stringify({ label: 'Image', view: 'image' }))}`
const textView = `panelViews[]=${encodeURIComponent(JSON.stringify({ label: 'Text', view: 'text' }))}`

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

  describe('When item has an image without url', () => {
    beforeEach(() => {
      cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${imageWithoutUrlItem}`)
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

describe('Image pane handling, when the image view is configured in panelViews', () => {
  function shouldShowEmptyState() {
    cy.get(panelContainer).within(() => {
      cy.get(imageContainer).should('be.visible')
      cy.get(imageEmptyState).should('be.visible')
      cy.get(imageEmptyState).should('contain.text', 'No image available')
      cy.get(imageEmptyState).should('contain.text', 'There is no image associated with this item.')
      cy.get(imageContainer).should('not.contain.text', 'Retry')
      cy.get(textContainer).should('have.length', 1).and('be.visible')
    })
  }

  it('should show the empty state when the item has no images key', () => {
    cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${noImagesItem}&${imageView}&${textView}`)
    shouldShowEmptyState()
  })

  it('should show the empty state when the item has an empty images array', () => {
    cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${emptyImagesItem}&${imageView}&${textView}`)
    shouldShowEmptyState()
  })

  it('should show the empty state when the item has an image without url', () => {
    cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${imageWithoutUrlItem}&${imageView}&${textView}`)
    shouldShowEmptyState()
  })

  it('should show the image when the item has images', () => {
    cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${withImagesItem}&${imageView}&${textView}`)
    cy.get(panelContainer).within(() => {
      cy.get(imageContainer).find('.openseadragon-canvas').should('exist')
      cy.get(imageEmptyState).should('not.exist')
      cy.get(imageContainer).should('not.contain.text', 'Retry')
    })
  })

  it('should show the error state when the image cannot be loaded', () => {
    cy.visit(`/e2e.html?panels[0].manifest=${manifest}&panels[0].item=${brokenImageItem}&${imageView}&${textView}`)
    cy.get(panelContainer).within(() => {
      cy.get(imageEmptyState).should('not.exist')
      cy.get(imageContainer).should('contain.text', 'No image available')
      cy.get(imageContainer).should('contain.text', 'Could not load the given image.')
      cy.get(imageContainer).find('button').should('contain.text', 'Retry')
    })
  })
})
