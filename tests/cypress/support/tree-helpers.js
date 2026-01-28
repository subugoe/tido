/**
 * Tree helpers
 * ==================
 * Semantic helpers for interacting with and asserting against the global tree.
 * Accepts JQuery<HTMLElement> nodes and returns Cypress.Chainable for chaining.
 */

/* ------------------------------------------------------------------ */
/* Selectors                                                          */
/* ------------------------------------------------------------------ */

/**
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getTree() {
  return cy.get('[data-cy="tree"]')
}

/**
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getRootNodes() {
  return getTree().children('[data-cy="tree-node"]')
}

/**
 * @param {JQuery<HTMLElement>} $node
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getNodeLabel($node) {
  return cy.wrap($node).find('[data-cy="node-label"]').first()
}

/**
 * @param {JQuery<HTMLElement} $node
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getNodeActions($node) {
  return cy.wrap($node).find('[data-cy="tree-node-actions"]').first()
}


/**
 * Returns direct child tree nodes (exactly one level down),
 * resilient to additional wrapper elements.
 *
 * @param {JQuery<HTMLElement>} $node
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getDirectChildren($node) {
  //root level
  if ($node.is('[data-cy="tree"]')) {
    return cy.wrap($node).children('[data-cy="tree-node"]')
  }

  return cy.wrap($node)
    .children('[data-cy="node-children"]')
    .find('[data-cy="tree-node"], [data-cy="tree-node-leaf"]')
    .filter((_, el) => {
      // ensure this tree-node belongs to THIS node, not a deeper one
      return Cypress.$(el)
        .closest('[data-cy="node-children"]')
        .parent('[data-cy="tree-node"]')[0] === $node[0]
    })
}

/**
 * Finds a direct child node by its exact label text
 *
 * @param {JQuery<HTMLElement>} $node
 * @param {string} label
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getDirectChildByLabel($node, label) {
  return getDirectChildren($node)
    .contains('[data-cy="node-label"]', new RegExp(`^${label}$`))
    .should('exist')
    .closest('[data-cy="tree-node"],[data-cy="tree-node-leaf"]')
}

/* ------------------------------------------------------------------ */
/* Actions                                                            */
/* ------------------------------------------------------------------ */

/**
 * Opens the global tree toggle
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function openGlobalTree() {
  return cy.get('[data-cy="global-tree-toggle"]')
    .should('be.visible')
    .click()
}

/**
 * Clicks a direct child node by label within the given scope
 * @param {string} label
 * @param {JQuery<HTMLElement>} [$scope]
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function clickNode(label, $scope) {
  return getDirectChildByLabel($scope, label)
    .should('be.visible')
    .click()
}

/**
 * Clicks a sequence of nested nodes by label, level by level.
 * Returns the final node in the path.
 *
 * @param {string[]} labels
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function clickPath(labels) {
  let chain = getTree()

  labels.forEach((label) => {
    chain = chain.then(($el) => clickNode(label, $el))
  })

  return chain
}

/* ------------------------------------------------------------------ */
/* Assertions                                                         */
/* ------------------------------------------------------------------ */

/**
 * Assert that a node has exactly `count` direct children
 * @param {JQuery<HTMLElement>} $node
 * @param {number} count
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function shouldHaveChildren($node, count) {
  return getDirectChildren($node).should('have.length', count)
}

/**
 * Returns the child node at the given index
 * @param {JQuery<HTMLElement>} $node
 * @param {number} idx
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function getChildAt($node, idx) {
  return getDirectChildren($node).eq(idx)
}

/**
 * Assert that a node has a label containing the given text
 * @param {JQuery<HTMLElement>} $node
 * @param {string} text
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function shouldHaveLabel($node, text) {
  return getNodeLabel($node).should('contain.text', text)
}

/**
 * Assert that a node is expanded (its direct children are visible)
 * @param {JQuery<HTMLElement>} $node
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function shouldBeExpanded($node) {
  return cy.wrap($node).children('[data-cy="node-children"]').should('be.visible')
}

/**
 * Assert that a node is collapsed (its direct children are hidden)
 * @param {JQuery<HTMLElement>} $node
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function shouldBeCollapsed($node) {
  return cy.wrap($node).children('[data-cy="node-children"]').should('not.be.visible')
}

/**
 * Assert that a node has a marker visible/not visible
 * @param {JQuery<HTMLElement>} $node
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>}
 */
export function shouldHaveMarker($node, visible=true) {
  getNodeActions($node)
    .find('[data-cy="tree-node-marker"]')
    .as('marker')
  
  if (visible) {
    return cy.get('@marker')
      .should('exist')
      .should('be.visible')
  }

  return cy.get('@marker')
      .should('not.exist')
}

/* ------------------------------------------------------------------ */
/* Convenience namespace                                     */
/* ------------------------------------------------------------------ */

export const Tree = {
  // selectors
  getTree,
  getRootNodes,
  getDirectChildren,
  getDirectChildByLabel,
  getChildAt,
  getNodeActions,

  // actions
  open: openGlobalTree,
  clickNode,
  clickPath,

  // assertions
  
  shouldHaveChildren,
  shouldHaveLabel,
  shouldBeExpanded,
  shouldBeCollapsed,
  shouldHaveMarker

}
