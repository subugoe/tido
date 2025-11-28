function runConfigTest(param, name, callback) {
  it(name, () => {
    cy.visit('/e2e.html?' + param);
    callback();
  });
}

function getPanelModeOption(mode) {
  return cy.get('[data-cy="options-button"]').click().get(`[data-cy="${mode}"]`)
}

function updatePanelFromRootCollection(manifestIdx = 0, itemIdx = 0) {
  cy.get('[data-cy="global-tree-toggle"]').click()
  const manifestNode = cy.get('[data-cy="tree"]')
    .eq(0)
    .get('[data-cy="node-children"]')
    .eq(0)
    .children()
    .eq(manifestIdx)
      
  manifestNode.click()
  manifestNode.find('[data-cy="node-children"]')
    .children()
    .eq(itemIdx)
    .click()
  cy.get('[data-cy="buttons-update-panel"]').click() 
}

describe('Config', () => {
  runConfigTest('', 'Should apply defaults', () => {
    cy.get('[data-cy="new-panel"]').should('have.css', 'background-color', 'rgb(52, 86, 170)')
    cy.get('[data-cy="global-tree-toggle"]').should('be.visible')
    cy.get('[data-cy="new-panel"]').should('be.visible')
    cy.get('[data-cy="new-panel"]').should('have.text', 'Add New Panel')
    getPanelModeOption('swap').should('have.attr', 'data-selected', 'true')
    cy.get('[data-cy="panel-placeholder"]').should('be.visible')
  });

  // ===== Specific Config Values =====
  runConfigTest('theme[primaryColor]=%2300ff00', 'theme.primaryColor custom', () => {
    cy.get('[data-cy="new-panel"]').should('have.css', 'background-color', 'rgb(0, 255, 0)')
  });
  runConfigTest('showGlobalTree=false', 'showGlobalTree false', () => {
    cy.get('[data-cy="global-tree-toggle"]').should('not.exist')
  });
  runConfigTest('showAddNewPanelButton=false', 'showAddNewPanelButton false', () => {
    cy.get('[data-cy="new-panel"]').should('not.exist')
  });
  runConfigTest('lang=de', 'translations: read from default `de` file', () => {
    cy.get('[data-cy="new-panel"]').should('have.text', 'Neues Panel hinzufügen')
  });
  runConfigTest('defaultPanelMode=split', 'defaultPanelMode: split', () => {
    getPanelModeOption('split').should('have.attr', 'data-selected', 'true')
  });
  runConfigTest('showPanelPlaceholder=true', 'Should show panel placeholder', () => {
    cy.get('[data-cy="panel-placeholder"]').should('be.visible')
  });
  runConfigTest('showPanelPlaceholder=false', 'Should not show panel placeholder', () => {
    cy.get('[data-cy="panel-placeholder"]').should('not.exist')
  });
  runConfigTest('title=4%20Wachen', 'Should apply custom title', () => {
    cy.get('h1').should('have.text', '4 Wachen')
  });
  runConfigTest('container=%23alternativeApp', 'Should append the app to a custom container', () => {
    cy.get('#alternativeApp [data-cy="app"]').should('exist')
    cy.get('#app [data-cy="app"]').should('not.exist')
  });
  runConfigTest('allowNewCollections=true', 'Should allow adding a panel from new collections', () => {
    cy.get('[data-cy="header"] [data-cy="new-panel"]').click()
    cy.contains('From new collection').click()
    cy.contains('Enter a collection URL')
  });
  runConfigTest('showThemeToggle=false', 'Should not show theme toggle', () => {
    cy.get('[data-cy="settings"]').click()
    cy.contains('Toggle theme').should('not.exist')
  })
  runConfigTest('showThemeToggle=true', 'Should show theme toggle', () => {
    cy.get('[data-cy="settings"]').click()
    
    cy.contains('Light').should('not.exist')
    cy.contains('Dark').should('not.exist')
    cy.contains('System').should('not.exist')
    
    cy.contains('Toggle theme').click()
    
    cy.contains('Light').should('be.visible')
    cy.contains('Dark').should('be.visible')
    cy.contains('System').should('be.visible')
  })
  //collection with annotations
  runConfigTest('annotationsMode=list&rootCollections[]=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json',
    'Should have annotations list view preselected', () => {
      //select panel with annotations
      updatePanelFromRootCollection()
      
      //open annotations sidebar
      cy.get('[data-cy="sidebar-toggle"]')
        .should('be.enabled')
        .click()
      
      //check if toggle is on
      cy.get('[data-cy="annotations-header"]')
        .find('button#annotations-mode')
        .should('have.attr', 'data-state', 'checked')

      //check if "Successful courtier" is the last annotation 
      // Successful courtier is the last item in list view but not in align view
      cy.get('[data-sidebar-container="true"]')
        .find('[data-annotation]')
        .should('have.length', 10)
        .then($annotations => {
          const top9 = $annotations.eq(9).position().top
          const top8 = $annotations.eq(8).position().top

          //in list view, the last item is below the second to last item for this collection
          expect(top9, 'Annotation #10 should be below (have a higher position.top) annotation #9')
            .to.be.gt(top8)
        })
    }
  )
  //collection with annotations
  runConfigTest('annotationsMode=align&rootCollections[]=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json',
    'Should have annotations align view preselected', () => {
      updatePanelFromRootCollection()

      //open annotations sidebar
      cy.get('[data-cy="sidebar-toggle"]')
        .should('be.enabled')
        .click()

      //check if toggle is off
      cy.get('[data-cy="annotations-header"]')
        .find('button#annotations-mode')
        .should('have.attr', 'data-state', 'unchecked')

      //check if "Successful courtier" is NOT the last annotation 
      // Successful courtier is the last item in list view but not in align view
      cy.get('[data-sidebar-container="true"]')
        .find('[data-annotation]')
        .should('have.length', 10)
        .then($annotations => {
          const top9 = $annotations.eq(9).position().top
          const top8 = $annotations.eq(8).position().top

          //in align view, the last item is above the second to last item for this collection
          expect(top9, 'Annotation #10 should be above (have a lower position.top) annotation #9')
            .to.be.lt(top8)
        })
    }
  )
});
