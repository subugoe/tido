function runConfigTest(param, name, callback, only=false) {
  const test = () => {
    cy.visit('/e2e.html?' + param);
    callback();
  }
  
  if (only) {
    it.only(name, test);
  }

  it(name, test);
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

function checkTreeExpandedCollectionManifests(
  $manifestNodes, 
  manifests = { count: 0, idx: 0, label: '' },
  items = { count: 0, idx: 0, label: '' }
) {
  cy.wrap($manifestNodes)
    .should('have.length', manifests.count)

    .eq(manifests.idx)
    .should('contain.text', manifests.label)
    .as('manifest')
  
  cy.get('@manifest')
    .click()
  
  cy.get('@manifest')
    .children('[data-cy="node-children"]')
    .find('[data-cy="tree-node"]')
    .should('have.length', items.count)

    .eq(items.idx)
    .should('contain.text', items.label)
}

function checkTreeCollapsedCollection($rootCollection, collectionLabel, manifests, items) {
  cy.wrap($rootCollection).as('rootCollection')

  cy.get('@rootCollection')
    .children('[data-cy="node-children"]')
    .should('not.be.visible')

  cy.get('@rootCollection')
    .should('contain.text', collectionLabel)  
    .click()
  
    .children('[data-cy="node-children"]')
    .should('be.visible')
    
    .find('[data-cy="tree-node"]')
    .then(($manifestNodes) => {
      checkTreeExpandedCollectionManifests($manifestNodes, manifests, items)
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
  });
  runConfigTest('showThemeToggle=true', 'Should show theme toggle', () => {
    cy.get('[data-cy="settings"]').click()
    
    cy.contains('Light').should('not.exist')
    cy.contains('Dark').should('not.exist')
    cy.contains('System').should('not.exist')
    
    cy.contains('Toggle theme').click()
    
    cy.contains('Light').should('be.visible')
    cy.contains('Dark').should('be.visible')
    cy.contains('System').should('be.visible')
  });
  runConfigTest('panels[0].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json',
    'Should show first item from first manifest when providing collection', () => {
      checkPanelItemLabels(
        'Textual witnesses in Arabic and Karshuni',
        'Cod. Arab. 236 Copenhagen',
        '2a'
      )
    }
  );
  runConfigTest('panels[0].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json&panels[0].manifest=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/3r176/manifest.json',
    'Should show first item when providing collection and manifest', () => {
      checkPanelItemLabels(
        'Textual witnesses in Arabic and Karshuni',
        'Brit.Mus. cod. Add. 7209',
        '182b'
      )
    }
  );
  runConfigTest('panels[0].collection=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json&panels[0].manifest=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/3r176/manifest.json&panels[0].item=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/3r176/183a/latest/item.json',
    'Should show item when providing collection, manifest and item', () => {
      checkPanelItemLabels(
        'Textual witnesses in Arabic and Karshuni',
        'Brit.Mus. cod. Add. 7209',
        '183a'
      )
    }
  );
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
  );
  //simplified is the second (=non-default) contentType of the collection
  runConfigTest('panels[0].collection=http://localhost:8181/4w/reproduction/collection.json&panels[0].contentType=simplified',
    'Should apply the given panel contentType', () => {
      cy.get('[data-cy="content-type"]')
        .should('be.visible')
        .should('contain.text', 'simplified')
        .click()
      
      cy.get('[data-cy="content-types-dropdown"]')
        .contains('simplified')
        .should('have.attr', 'data-state', 'checked')

      cy.get('[data-cy="content-types-dropdown"]')
        .contains('accurate')
        .should('have.attr', 'data-state', 'unchecked')
    }
  );
  runConfigTest('rootCollections[]=http://localhost:8181/4w/reproduction/collection.json&panels[0].collection=http://localhost:8181/4w/reproduction/collection.json',
    'Should show markers in tree for open panel', () => {
      //open tree
      cy.get('[data-cy="global-tree-toggle"]')
        .should('be.visible')
        .click()
      
      cy.get('[data-cy="tree"]')
        .children('[data-cy="tree-node"]')
        .eq(0)
        .as('rootCollection')
      
      //should have a marker at collection level
      cy.get('@rootCollection')  
        .find('[data-cy="node-label"]')
        .eq(0)
        .should('contain.text', 'Ebene 1: Reproduktion der Dokumente')
        .siblings('[data-cy="tree-node-actions"]')
        .find('[data-cy="tree-node-marker"]')
        .should('be.visible')
      
      cy.get('@rootCollection')
        .children('[data-cy="node-children"]') //manifest nodes
        .find('[data-cy="tree-node-marker"]') 
        .should('have.length', 1)
        .parents('[data-cy="tree-node"]')
        .eq(0)
        //manifest node with marker
        .within(() => {
          //open items of marked manifest
          cy.get('[data-cy="node-label"]')
            .should('contain.text', 'Einsiedeln, 278 1040')
            .click()
          //should only have one marker at item level for item '279'
          cy.get('[data-cy="node-children"]')
            .find('[data-cy="tree-node-marker"]')
            .should('have.length', 1)
            .parents('[data-cy="tree-node"]')
            .eq(0)
            .find('[data-cy="node-label"]')
            .should('contain.text', '279')
        })
    }
  );
  runConfigTest('rootCollections[]=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json',
    'Should show one root collection in global tree with root node expanded', () => {
      cy.get('[data-cy="global-tree-toggle"]')
        .should('be.visible')
        .click()
      
      cy.get('[data-cy="tree"]')
        .children('[data-cy="tree-node"]')
        .should('have.length', 1)
        .children()
        .eq(0)
        .find('[data-cy="node-label"]')
        .should('contain.text', 'Textual witnesses in Arabic and Karshuni')

        .parents('[data-cy="tree-node"]')
        .children('[data-cy="node-children"]')
        .find('[data-cy="tree-node"]')
        .then(($manifestNodes) => {
          //should have 30 manifests and the third should be labelled 'Borg. Arab. 201'
          const manifests = { count: 30, idx: 2, label: 'Borg. Arab. 201' }
          //should have 18 items under 'Borg. Arab. 201' and the fourth should be labelled '200a'
          const items = { count: 18, idx: 3, label: '200a' }
          checkTreeExpandedCollectionManifests($manifestNodes, manifests, items)
        })
    }
  );
  runConfigTest('rootCollections[]=http://localhost:8181/ahiqar/textapi/ahiqar/arabic-karshuni/collection.json&rootCollections[]=http://localhost:8181/4w/reproduction/collection.json', 
    'Should show two root collections in global tree with both root nodes collapsed', () => {
      cy.get('[data-cy="global-tree-toggle"]')
        .should('be.visible')
        .click()
      
      cy.get('[data-cy="tree"]')
        .children('[data-cy="tree-node"]')
        .should('have.length', 2)
        .as('rootCollections')

      cy.get('@rootCollections')
        .eq(0)
        .then(($rootCollection) => {
          const collectionLabel = 'Textual witnesses in Arabic and Karshuni'
          //should have 30 manifests and the last one should be labelled 'Syr 17'
          const manifests = { count: 30, idx: 29, label: 'Syr 17'}
          //should have 50 items under 'Syr 17' and the second should be labelled '2v'
          const items = { count: 50, idx: 1, label: '2v'}

          checkTreeCollapsedCollection($rootCollection, collectionLabel, manifests, items)
        })

      cy.get('@rootCollections')
        .eq(1)
        .then(($rootCollection) => {
          const collectionLabel = 'Ebene 1: Reproduktion der Dokumente'
          //should have 8 manifests and the first should be labelled 'Einsiedeln, 278 1040'
          const manifests = { count: 8, idx: 0, label: 'Einsiedeln, 278 1040'}
          //should have 3 items under 'Einsiedeln, 278 1040' and the last should be labelled '281'
          const items = { count: 3, idx: 2, label: '281'}

          checkTreeCollapsedCollection($rootCollection, collectionLabel, manifests, items)
        })
    }
  );
  runConfigTest('showGlobalTree=false', 'Should not show the global tree toggle', () => {
    cy.get('[data-cy="global-tree-toggle"]')
      .should('not.exist')
  });
});
