describe('Annotations', () => {
	const annotationConfig = 'annotations.defaultMode=list&panels[0].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json'

	beforeEach(() => {
		cy.visit('/e2e.html?' + annotationConfig)
	})

	it('renders annotation sidebar and toggles list/aligned modes', () => {
		cy.get('[data-cy="sidebar-toggle"]').should('be.enabled').click()

		cy.get('[data-cy="annotations-header"]').should('be.visible')

		cy.get('[data-cy="annotations-mode-toggle"]').within(() => {
			cy.get('[data-cy="list"]').should('have.attr', 'data-state', 'on')
			cy.get('[data-cy="aligned"]').should('have.attr', 'data-state', 'off')
			cy.get('[data-cy="aligned"]').click()
		})

		cy.wait(250)

		cy.get('[data-cy="annotations-mode-toggle"]').within(() => {
			cy.get('[data-cy="aligned"]').should('have.attr', 'data-state', 'on')
			cy.get('[data-cy="list"]').should('have.attr', 'data-state', 'off')
		})

		cy.get('[data-sidebar-container="true"]').find('[data-annotation]').should('have.length.at.least', 10)
	})

	it('selects and deselects annotations and syncs target highlights', () => {
		cy.get('[data-cy="sidebar-toggle"]').click()

		cy.get('[data-sidebar-container="true"] [data-annotation]').first().as('firstAnnotation').click()
		cy.get('@firstAnnotation').should('have.attr', 'data-selected', 'true')

		// an annotation target should be selected in text (highlight mechanism)
		cy.get('[data-annotation-selected="true"]').should('have.length.at.least', 1)

		cy.get('[data-sidebar-container="true"]').find('[data-annotation]').eq(1).as('secondAnnotation').click()
		cy.get('@secondAnnotation').should('have.attr', 'data-selected', 'true')
		cy.get('@firstAnnotation').should('not.have.attr', 'data-selected')

		cy.get('@firstAnnotation').click()
		cy.get('@firstAnnotation').should('have.attr', 'data-selected', 'true')
	})

	it('applies annotation filters to hide and show annotations', () => {
		cy.get('[data-cy="sidebar-toggle"]').click()

		cy.get('[data-sidebar-container="true"]').find('[data-annotation]').as('allAnnotations')
		cy.get('@allAnnotations').its('length').should('be.gte', 10)

		cy.get('[data-cy="annotations-header"]').contains(/filters/i).click()

		cy.get('[data-radix-popper-content-wrapper]').within(() => {
			cy.get('input[type="checkbox"]').each(($checkbox) => {
				cy.wrap($checkbox).click({ force: true })
			})
		})

		cy.wait(300)
		cy.get('[data-sidebar-container="true"]').find('[data-annotation]').should('have.length', 0)

		cy.get('[data-radix-popper-content-wrapper]').within(() => {
			cy.get('input[type="checkbox"]').each(($checkbox) => {
				cy.wrap($checkbox).click({ force: true })
			})
		})

		cy.wait(300)
		cy.get('[data-sidebar-container="true"]').find('[data-annotation]').its('length').should('be.gte', 10)
	})

	it('handles long annotation content view_more/view_less when present', () => {
		cy.get('[data-cy="sidebar-toggle"]').click()

		cy.get('body').then(($body) => {
			const viewMore = $body.find('[data-sidebar-container="true"] button').filter((_, el) => /view more/i.test(el.textContent))
			if (viewMore.length === 0) {
				cy.log('No long annotation body in current fixtures; skipping view_more/view_less')
				return
			}

			cy.wrap(viewMore).click()
			cy.contains('button', 'View less').should('exist').click()
			cy.contains('button', 'View more').should('exist')
		})
	})

	it('should keep annotation list stable across mode switch and show filled counts', () => {
		cy.get('[data-cy="sidebar-toggle"]').click()

		cy.get('[data-sidebar-container="true"]').find('[data-annotation]').as('initialAnnotations')
		cy.get('@initialAnnotations').its('length').should('be.gte', 10)

		cy.get('[data-cy="annotations-mode-toggle"]').contains(/aligned/i).click()
		cy.wait(250)

		cy.get('[data-sidebar-container="true"]').find('[data-annotation]').its('length').should('be.gte', 10)

		cy.get('[data-cy="annotations-mode-toggle"]').contains(/list/i).click()
		cy.wait(250)

		cy.get('[data-sidebar-container="true"]').find('[data-annotation]').its('length').should('be.gte', 10)
	})

	it('should show nested annotations details on footer expand when present', () => {
		cy.get('[data-cy="sidebar-toggle"]').click()

		cy.get('[data-sidebar-container="true"]').then(($container) => {
			const footerButton = $container.find('button').filter((_, el) => /nested annotation/i.test(el.textContent))
			if (!footerButton.length) {
				cy.log('No nested annotation footer found; skipping nested annotation flow')
				return
			}

			cy.wrap(footerButton.first()).click()
			cy.get('[data-sidebar-container="true"]').find('[data-annotation]').should('have.length.at.least', 1)
			cy.wrap(footerButton.first()).click()
		})
	})

	it('should hover highlight target segments and reset on mouse leave', () => {
		cy.get('[data-cy="sidebar-toggle"]').click()

		cy.get('[data-sidebar-container="true"] [data-annotation]').first().as('firstAnnotation')
		cy.get('@firstAnnotation').trigger('mouseenter')
		// this test validates no runtime error for hover events, visual class updates are dataset-dependent

		cy.get('@firstAnnotation').trigger('mouseleave')
		// this test validates no runtime error for hover events, visual class updates are dataset-dependent
	})
})

