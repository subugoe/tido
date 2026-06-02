describe('Annotations', () => {

    const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
    console.log('api url', apiUrl)
    const annotationConfig = `annotations.defaultMode=list&panels[0].collection=${apiUrl}/example/collections/example.json`;

    const selectors = {
        sidebarToggle: '[data-cy="sidebar-toggle"]',
        sidebarContainer: '#panels-wrapper .panel [data-sidebar-container]'
    }

  const sidebar = () => cy.get(selectors.sidebarContainer)
  const openSidebar = () => {
        cy.get(selectors.sidebarToggle).click()
    }

    beforeEach(() => {
        cy.visit('/e2e.html?' + annotationConfig)
        cy
          .get('[data-cy="item-label"]')
          .contains('Pride and Prejudice, Chapter 1')
    })

    it('Should open annotation sidebar', () => {
        cy.get(selectors.sidebarToggle).click()
        cy.get(selectors.sidebarContainer).should('be.visible')
    })

    it('Should close annotation sidebar', () => {
        openSidebar()
        cy.get(selectors.sidebarToggle).click()
        cy.get(selectors.sidebarContainer).should('not.exist')
    })

    it('Should toggle annotation mode list/aligned', () => {
        openSidebar()

        sidebar().within(() => {
            cy.get('[data-cy="list"]').should('have.attr', 'data-state', 'on')
            cy.get('[data-cy="aligned"]').should('have.attr', 'data-state', 'off').click()
        })

        sidebar().within(() => {
            cy.get('[data-cy="aligned"]').should('have.attr', 'data-state', 'on')
            cy.get('[data-cy="list"]').should('have.attr', 'data-state', 'off')
        })
    })

    it('Should select exactly one annotation at a time', () => {
        openSidebar()

        sidebar().find('[data-annotation]').as('annots')
        cy.get('@annots').should('have.length.gte', 2)

        cy.get('@annots').first().as('first').click().should('have.attr', 'data-selected', 'true')

        cy.get('@annots').eq(1).as('second').click().should('have.attr', 'data-selected', 'true')
        cy.get('@first').should('not.have.attr', 'data-selected')
    })

    it('Should open filter popover and toggle filters off/on', () => {
      openSidebar()

      sidebar().find('[data-cy="annotations-list"] > div[data-annotation]').should('have.length',6)

      sidebar().contains('button', /filters/i).click()
        cy.get('[data-slot="popover-content"]').should('be.visible')

        cy.get('[data-slot="popover-content"] [data-slot="checkbox"]').each(($checkbox) => {
            if ($checkbox.attr('data-state') === 'checked') {
                cy.wrap($checkbox).click({ force: true })
            }
        })

      sidebar().find('[data-cy="empty-annotations-view"')

      cy.get('[data-slot="popover-content"] [data-slot="checkbox"]').each(($checkbox) => {
            if ($checkbox.attr('data-state') !== 'checked') {
                cy.wrap($checkbox).click({ force: true })
            }
        })
      sidebar().find('[data-cy="annotations-list"] > div[data-annotation]').should('have.length',6)

    })

    it('Should expand nested annotation footer if present', () => {
        openSidebar()

        sidebar().find('[data-annotation]').should('exist')
        const footer =  sidebar().find('div[data-cy="footer"]').first()
        footer.click()
        footer.find('div[data-annotation]').should('have.length.at.least', 1)
    })

    it('Should support view more/less on lengthy annotation body when available', () => {
        openSidebar()

        sidebar().find('[data-annotation]').should('exist')

        sidebar().find('[data-annotation]').first().contains('button', /view more/i).click()
        cy.contains('button', /view less/i).should('exist').click()
        cy.contains('button', /view more/i).should('exist')
    })

    it('Should trigger hover events on first annotation', () => {
        openSidebar()

        sidebar().find('[data-annotation]').first().as('firstAnnotation')
        cy.get('@firstAnnotation').trigger('mouseenter')
        cy.get('@firstAnnotation').trigger('mouseleave')
    })
})
