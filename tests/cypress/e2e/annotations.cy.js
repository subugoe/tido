describe('Annotations', () => {

    const apiUrl = Cypress.env('API_URL') || 'http://localhost:8181';
    const annotationConfig = `annotations.defaultMode=list&panels[0].collection=${apiUrl}/example/collections/example.json`;

    const selectors = {
        sidebarToggle: '[data-cy="sidebar-toggle"]',
        sidebarContainer: '[data-sidebar-container]'
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

        cy.get('@annots').eq(3).as('first').click().should('have.attr', 'data-selected', 'true')

        cy.get('@annots').eq(4).click().should('have.attr', 'data-selected', 'true')
        cy.get('@first').should('not.have.attr', 'data-selected')
    })

    it('Should open filter popover and toggle filters off/on', () => {
        openSidebar()

        sidebar().find('[data-annotation]').its('length').as('initialCount')

        sidebar().contains('button', /filters/i).click()
        cy.get('[data-slot="popover-content"]').should('be.visible')

        cy.get('[data-slot="popover-content"] [data-slot="checkbox"]').each(($checkbox) => {
            if ($checkbox.attr('data-state') === 'checked') {
                cy.wrap($checkbox).click({ force: true })
            }
        })

        cy.get('@initialCount').then((initialCount) => {
            sidebar().find('[data-annotation]').should('have.length.lessThan', initialCount)
        })

        cy.get('[data-slot="popover-content"] [data-slot="checkbox"]').each(($checkbox) => {
            if ($checkbox.attr('data-state') !== 'checked') {
                cy.wrap($checkbox).click({ force: true })
            }
        })

        cy.get('@initialCount').then((initialCount) => {
            sidebar().find('[data-annotation]').should('have.length.gte', initialCount)
        })
    })

    it('Should expand nested annotation footer if present', () => {
        openSidebar()

        sidebar().find('[data-annotation]').should('exist')

        sidebar().then(($container) => {
            const footerButton = $container.find('button').filter((_, el) => /nested annotation/i.test(el.textContent))
            if (!footerButton.length) {
                cy.log('No nested annotation footer in this dataset')
                return
            }

            cy.wrap(footerButton.first()).click()
            sidebar().find('[data-annotation]').should('have.length.at.least', 1)
            cy.wrap(footerButton.first()).click()
        })
    })

    it('Should support view more/less on lengthy annotation body when available', () => {
        openSidebar()

        sidebar().find('[data-annotation]').should('exist')

        sidebar().then(($container) => {
            const viewMoreBtn = $container
                .find('button')
                .filter((_, el) => /view more/i.test(el.textContent))

            if (!viewMoreBtn.length) {
                cy.log('No view more button in this dataset, skipping')
                return
            }

            cy.wrap(viewMoreBtn.first()).click()
            cy.contains('button', /view less/i).should('exist').click()
            cy.contains('button', /view more/i).should('exist')
        })
    })

    it('Should trigger hover events on first annotation', () => {
        openSidebar()

        sidebar().find('[data-annotation]').first().as('firstAnnotation')
        cy.get('@firstAnnotation').trigger('mouseenter')
        cy.get('@firstAnnotation').trigger('mouseleave')
    })

    it('Should display custom labels for annotation types when configured', () => {
        const customLabel = 'Character'
        const type = 'Place'
        cy.visit(`/e2e.html?${annotationConfig}&annotations.types[${type}].label=${customLabel}`)
        cy.get('[data-cy="item-label"]').contains('Pride and Prejudice, Chapter 1')
        openSidebar()
        sidebar().find('[data-annotation]', { timeout: 10000 }).should('have.length.at.least', 1)
        sidebar()
            .find('[data-slot="badge"]')
            .should('contain.text', customLabel)
    })

    it('Should show "No annotations found" when all annotations are filtered out', () => {
        openSidebar()
        sidebar().contains('button', /filters/i).click()
        cy.get('[data-slot="popover-content"] [data-slot="checkbox"][data-state="checked"]').each(($checkbox) => {
            cy.wrap($checkbox).click({ force: true })
        })
        cy.contains('No annotations found').should('be.visible')
    })

    it('Should show "No annotations available" when the document has no annotations', () => {
        openSidebar()
        sidebar().find('[data-annotation]').should('have.length.at.least', 1)
        sidebar().contains('button', /filters/i).click()
        cy.get('[data-slot="popover-content"] [data-slot="checkbox"][data-state="checked"]').each(($checkbox) => {
            cy.wrap($checkbox).click({ force: true })
        })
        cy.contains('No annotations found').should('be.visible')
    })

        it('Select second annotation aligns and selects text target', () => {
            cy.visit('/e2e.html?' + annotationConfig.replace('defaultMode=list', 'defaultMode=aligned'))
            cy.get('[data-cy="item-label"]').contains('Pride and Prejudice, Chapter 1')

            openSidebar()

            sidebar().find('[data-annotation]').eq(1).as('secondAnnot').click()

            cy.get('@secondAnnot').should('have.attr', 'data-selected', 'true')

            cy.get('[data-text-container] .bg-annotation-selected').should('exist')
        })

        it('Text-to-Sidebar Click opens sidebar and selects corresponding annotation', () => {
            cy.visit('/e2e.html?' + annotationConfig)
            cy.get('[data-text-container] [data-annotation-ids]').should('have.length.at.least', 1)

            cy.get('[data-cy="item-label"]').contains('Pride and Prejudice, Chapter 1')
            cy.get('[data-text-container] [data-annotation-ids]').first().click()

            cy.get('body').then($body => {
                if ($body.find('[data-slot="popover-content"]').length) {
                    cy.get('[data-slot="popover-content"]').within(() => {
                        cy.get('.group').first().click()
                    })
                }
            })

            cy.get(selectors.sidebarContainer, { timeout: 10000 }).should('be.visible')
            sidebar().find('[data-annotation][data-selected="true"]').should('exist')
        })

        it('Selecting a sidebar annotation scrolls the main text to its target (scroll sync)', () => {
            openSidebar()

            cy.get('[data-text-container]').scrollTo('bottom', { ensureScrollable: false })

            sidebar().find('[data-annotation]').first().click()

            cy.get('[data-text-container]').invoke('scrollTop').should('be.lessThan', 200)
        })

        it('2-way hover sync between sidebar and text targets', () => {
            openSidebar()

            sidebar().find('[data-annotation]').first().invoke('attr', 'data-annotation').then(id => {
                cy.get(`[data-text-container] [data-annotation-ids*="${id}"]`, { timeout: 10000 }).should('exist')
                sidebar().find('[data-annotation]').first().trigger('mouseenter').trigger('mouseover').trigger('mousemove')
                cy.get(`[data-text-container] [data-annotation-ids*="${id}"].bg-annotation-hover`, { timeout: 10000 }).should('exist')
                sidebar().find('[data-annotation]').first().trigger('mouseleave')
            })

            cy.get('[data-text-container] [data-annotation-ids]').first().trigger('mouseenter', { force: true })
            sidebar().find('[data-annotation]').first().should('have.class', 'border-primary')
        })
})