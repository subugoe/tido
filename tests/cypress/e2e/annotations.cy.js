describe('Annotations', () => {
	const annotationConfig = 'annotations.defaultMode=list&panels[0].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json'

<<<<<<< Updated upstream
=======
	const selectors = {
		sidebarToggle: '[data-cy="sidebar-toggle"]',
		annotationsHeader: '[data-cy="annotations-header"]',
		annotationsModeToggle: '[data-cy="annotations-mode-toggle"]',
		sidebarContainer: '[data-sidebar-container="true"]',
		annotation: '[data-annotation]',
		filterArea: '[data-cy="annotations-header"]',
		popover: '[data-radix-popper-content-wrapper]'
	}

	const openSidebar = () => {
		cy.get(selectors.sidebarToggle).click()
	}

>>>>>>> Stashed changes
	beforeEach(() => {
		cy.visit('/e2e.html?' + annotationConfig)
	})

<<<<<<< Updated upstream
	it('renders annotation sidebar and toggles list/aligned modes', () => {
		cy.get('[data-cy="sidebar-toggle"]').should('be.enabled').click()

		cy.get('[data-cy="annotations-header"]').should('be.visible')

		cy.get('[data-cy="annotations-mode-toggle"]').within(() => {
			cy.get('[data-cy="list"]').should('have.attr', 'data-state', 'on')
			cy.get('[data-cy="aligned"]').should('have.attr', 'data-state', 'off')
			cy.get('[data-cy="aligned"]').click()
=======
	it('opens annotation sidebar', () => {
		openSidebar()
		cy.get(selectors.sidebarContainer).should('be.visible')
	})

	it('closes annotation sidebar', () => {
		openSidebar()
		cy.get(selectors.sidebarToggle).click()
		cy.get(selectors.sidebarContainer).should('not.exist')
	})

	it('toggles annotation mode list/aligned', () => {
		openSidebar()

		cy.get(selectors.annotationsModeToggle).within(() => {
			cy.get('[data-cy="list"]').should('have.attr', 'data-state', 'on')
			cy.get('[data-cy="aligned"]').should('have.attr', 'data-state', 'off').click()
>>>>>>> Stashed changes
		})

		cy.wait(250)

<<<<<<< Updated upstream
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
=======
		cy.get(selectors.annotationsModeToggle).within(() => {
			cy.get('[data-cy="aligned"]').should('have.attr', 'data-state', 'on')
			cy.get('[data-cy="list"]').should('have.attr', 'data-state', 'off')
		})
	})

	it('selects exactly one annotation at a time', () => {
		openSidebar()

		cy.get(`${selectors.sidebarContainer} ${selectors.annotation}`).as('annots')
		cy.get('@annots').its('length').should('be.gte', 2)

		cy.get('@annots').first().as('first').click().should('have.attr', 'data-selected', 'true')

		cy.get('@annots').eq(1).as('second').click().should('have.attr', 'data-selected', 'true')
		cy.get('@first').should('not.have.attr', 'data-selected')
	})

	it('opens filter popover and toggles filters off/on', () => {
		openSidebar()

		cy.get(selectors.sidebarContainer).then(($container) => {
			cy.wrap($container.find(selectors.annotation).length).as('initialCount')
		})

		cy.get(selectors.filterArea).contains(/filters/i).click()
		cy.get(selectors.popover).should('be.visible')

		cy.get(`${selectors.popover} input[type="checkbox"]`).each(($checkbox) => {
			if ($checkbox.is(':checked')) {
				cy.wrap($checkbox).click({ force: true })
			}
		})

		cy.wait(300)
		cy.get('@initialCount').then((initialCount) => {
			cy.get(selectors.sidebarContainer).then(($container) => {
				expect($container.find(selectors.annotation).length).to.be.lt(initialCount)
			})
		})

		cy.get(`${selectors.popover} input[type="checkbox"]`).each(($checkbox) => {
			if (!$checkbox.is(':checked')) {
				cy.wrap($checkbox).click({ force: true })
			}
		})

		cy.wait(300)
		cy.get('@initialCount').then((initialCount) => {
			cy.get(selectors.sidebarContainer).then(($container) => {
				expect($container.find(selectors.annotation).length).to.be.gte(initialCount)
			})
		})
	})

	it('expands nested annotation footer if present', () => {
		openSidebar()

		cy.get(selectors.sidebarContainer).then(($container) => {
			const footerButton = $container.find('button').filter((_, el) => /nested annotation/i.test(el.textContent))
			if (!footerButton.length) {
				cy.log('No nested annotation footer in this dataset')
>>>>>>> Stashed changes
				return
			}

			cy.wrap(footerButton.first()).click()
<<<<<<< Updated upstream
			cy.get('[data-sidebar-container="true"]').find('[data-annotation]').should('have.length.at.least', 1)
=======
			cy.get(`${selectors.sidebarContainer} ${selectors.annotation}`).should('have.length.at.least', 1)
>>>>>>> Stashed changes
			cy.wrap(footerButton.first()).click()
		})
	})

<<<<<<< Updated upstream
	it('should hover highlight target segments and reset on mouse leave', () => {
		cy.get('[data-cy="sidebar-toggle"]').click()

		cy.get('[data-sidebar-container="true"] [data-annotation]').first().as('firstAnnotation')
		cy.get('@firstAnnotation').trigger('mouseenter')
		// this test validates no runtime error for hover events, visual class updates are dataset-dependent

		cy.get('@firstAnnotation').trigger('mouseleave')
		// this test validates no runtime error for hover events, visual class updates are dataset-dependent
	})
})

=======
	it('supports view more/less on lengthy annotation body when available', () => {
		openSidebar()

		cy.get('body').then(($body) => {
			const viewMoreBtn = $body
				.find(`${selectors.sidebarContainer} button`)
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

	it('triggers hover events on first annotation', () => {
		openSidebar()

		cy.get(`${selectors.sidebarContainer} ${selectors.annotation}`).first().as('firstAnnotation')
		cy.get('@firstAnnotation').trigger('mouseenter')
		cy.get('@firstAnnotation').trigger('mouseleave')
	})
})
>>>>>>> Stashed changes
