function runConfigTest(param, name, callback) {
  it(name, () => {
    cy.visit('/e2e.html?' + param);
    callback();
  });
}

function getPanelModeOption(mode) {
  return cy.get('[data-cy="options-button"]').click().get(`[data-cy="${mode}"]`)
}

function checkPanelItemLabels(collectionLabel, manifestLabel, itemLabel, panelIdx=0) {
  cy.get('[data-cy="panels-wrapper"]')
    .find('[data-cy="panel"]')
    .eq(panelIdx)
    .within(() => {
      cy.get('[data-cy="collection-title"]')
        .should('contain.text', collectionLabel)
    
      cy.get('[data-cy="manifest-label"')
        .should('contain.text', manifestLabel)
      
      cy.get('[data-cy="item-label"]')
        .should('contain.text', itemLabel)
    })
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
    cy.contains('From existing collections').should('exist')
    cy.contains('From new collection').click()
    cy.contains('Enter a collection URL').should('exist')
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
  runConfigTest('panels[0].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json',
    'Should show first item from first manifest when providing collection', () => {
      checkPanelItemLabels(
        'Textual witnesses in Arabic and Karshuni',
        'Cod. Arab. 236 Copenhagen',
        '2a'
      )
    }
  )
  runConfigTest('panels[0].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json&panels[0].manifest=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/3r176/manifest.json',
    'Should show first item when providing collection and manifest', () => {
      checkPanelItemLabels(
        'Textual witnesses in Arabic and Karshuni',
        'Brit.Mus. cod. Add. 7209',
        '182b'
      )
    }
  )
  runConfigTest('panels[0].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json&panels[0].manifest=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/3r176/manifest.json&panels[0].item=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/3r176/183a/latest/item.json',
    'Should show item when providing collection, manifest and item', () => {
      checkPanelItemLabels(
        'Textual witnesses in Arabic and Karshuni',
        'Brit.Mus. cod. Add. 7209',
        '183a'
      )
    }
  )
  runConfigTest('panels[0].collection=http://localhost:8181/4w/reproduction/collection.json&panels[1].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json',
    'Should show two panels with first item from two collections', () => {
      cy.get('[data-cy="panels-wrapper"]')
        .find('[data-cy="panel"]')
        .should('have.length', 2)
      
      checkPanelItemLabels(
        'Ebene 1: Reproduktion der Dokumente',
        'Einsiedeln, 278 1040',
        '279',
        0
      )

      checkPanelItemLabels(
        'Textual witnesses in Arabic and Karshuni',
        'Cod. Arab. 236 Copenhagen',
        '2a',
        1
      )
    }
  )
  runConfigTest('panels[0].collection=http://localhost:8181/4w/reproduction/collection.json&panels[0].contentType=simplified',
    'Should apply the given panel contentType', () => {
      cy.get('[data-cy="content-type"]')
        .should('contain.text', 'simplified')
        .click()
      
      cy.get('[data-cy="content-types-dropdown"]')
        .contains('simplified')
        .should('have.attr', 'data-state', 'checked')

      cy.get('[data-cy="content-types-dropdown"]')
        .contains('accurate')
        .should('have.attr', 'data-state', 'unchecked')
    }
  )
  
});
