describe('Annotations', () => {
	const annotationConfig = 'annotations.defaultMode=list&panels[0].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json'

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

	beforeEach(() => {
		cy.visit('/e2e.html?' + annotationConfig)
	})

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
		})

		cy.wait(250)

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
				return
			}

			cy.wrap(footerButton.first()).click()
			cy.get(`${selectors.sidebarContainer} ${selectors.annotation}`).should('have.length.at.least', 1)
			cy.wrap(footerButton.first()).click()
		})
	})

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