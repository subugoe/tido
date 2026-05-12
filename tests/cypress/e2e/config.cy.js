import { Panel } from '../support/panel-helpers'
import { Tree } from '../support/tree-helpers'

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

function checkTreeCollapsedCollection($rootCollection, collectionLabel, manifestsCount) {
  cy.wrap($rootCollection).as('rootCollection')

  cy.get('@rootCollection')
    .then($rootCollection => {
      Tree.shouldBeCollapsed($rootCollection)
      Tree.shouldHaveLabel($rootCollection, collectionLabel)
    })

  cy.get('@rootCollection').click()

  cy.get('@rootCollection')
    .then(($rootCollection) => {
      Tree.shouldBeExpanded($rootCollection)
      Tree.shouldHaveChildren($rootCollection, manifestsCount)
    })
}

describe('Config', () => {
  runConfigTest('', 'Should apply defaults', () => {
    cy.get('[data-cy="new-panel"]').should('have.css', 'background-color', 'oklch(0.474346 0.140455 264.941)')
    cy.get('[data-cy="global-tree-toggle"]').should('be.visible')
    cy.get('[data-cy="new-panel"]').should('be.visible')
    cy.get('[data-cy="new-panel"]').should('have.text', 'Add New Panel')
    cy.get('[data-cy="panel-placeholder"]').should('be.visible')
  });

  // ===== Specific Config Values =====
  runConfigTest('theme[primaryColor]=%2300ff00', 'theme.primaryColor custom', () => {
    cy.get('[data-cy="new-panel"]').should('have.css', 'background-color', 'oklch(0.86644 0.294827 142.495)')
  });
  runConfigTest('showGlobalTree=false', 'showGlobalTree false', () => {
    cy.get('[data-cy="global-tree-toggle"]').should('not.exist')
  });
  runConfigTest('showAddNewPanelButton=false', 'showAddNewPanelButton false', () => {
    cy.get('[data-cy="new-panel"]').should('not.exist')
  });
  runConfigTest('showContentTypeToggle=false&panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json', 'showContentTypeToggle false hides TextOptions', () => {
    cy.get('[data-cy="content-type"]').should('not.exist')
  });
  runConfigTest('showContentTypeToggle=true&panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json', 'showContentTypeToggle true shows TextOptions', () => {
    cy.get('[data-cy="content-type"]').should('be.visible')
  });
  runConfigTest('lang=de', 'translations: read from default `de` file', () => {
    cy.get('[data-cy="new-panel"]').should('have.text', 'Neues Panel hinzufügen')
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
  runConfigTest('panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json',
    'Should show first item from first manifest when providing collection', () => {
      checkPanelItemLabels(
        'Transkriptionen',
        'E: 3. Viertel 14. Jh.',
        'Seite einsiedeln_278_1040-279'
      )
  });
  runConfigTest('panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json&panels[0].manifest=http://localhost:8181/4w/manifests/klosterneuburg_cod_251.json',
    'Should show first item when providing collection and manifest', () => {
      checkPanelItemLabels(
        'Transkriptionen',
        'Kl: 1380er Jahre',
        'Seite klosterneuburg_cod_251-72v'
      )
  });
  runConfigTest('panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json&panels[0].manifest=http://localhost:8181/4w/manifests/muenchen_bsb_cgm_627.json&panels[0].item=http://localhost:8181/4w/items/muenchen_bsb_cgm_627-243v.json',
    'Should show item when providing collection, manifest and item', () => {
      checkPanelItemLabels(
        'Transkriptionen',
        'M1: 1458',
        'Seite muenchen_bsb_cgm_627-243v'
      )
  });
  runConfigTest('panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json&panels[1].collection=http://localhost:8181/example/collections/example.json',
    'Should show two panels with first item from two collections', () => {
      cy.get('[data-cy="panels-wrapper"]')
        .find('[data-cy="panel"]')
        .should('have.length', 2)

      checkPanelItemLabels(
        'Transkriptionen',
        'E: 3. Viertel 14. Jh.',
        'Seite einsiedeln_278_1040-279',
        0
      )

      checkPanelItemLabels(
        'Classic Literature Collection',
        'Pride and Prejudice',
        'Chapter 1',
        1
      )
  });
  //simplified is the second (=non-default) contentType of the collection
  // runConfigTest('panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json&panels[0].contentType=simplified',
  //   'Should apply the given panel contentType', () => {
  //     cy.get('[data-cy="content-type"]')
  //       .should('be.visible')
  //       .should('contain.text', 'simplified')
  //       .click()
  //
  //     cy.get('[data-cy="content-types-dropdown"]')
  //       .contains('simplified')
  //       .should('have.attr', 'data-state', 'checked')
  //
  //     cy.get('[data-cy="content-types-dropdown"]')
  //       .contains('accurate')
  //       .should('have.attr', 'data-state', 'unchecked')
  //   }
  // );
  runConfigTest('rootCollections[]=http://localhost:8181/4w/collections/transcriptions.json&panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json',
    'Should show markers in tree for open panel', () => {
      Tree.open()
      Tree.getRootNodes()
        .eq(0)
        .as('rootCollection')

      //should have a marker at collection level
      cy.get('@rootCollection').then($rootCollection => {
        Tree.shouldHaveLabel($rootCollection, 'Transkriptionen')
        Tree.shouldHaveMarker($rootCollection)

        Tree.getDirectChildren($rootCollection)
      }).as('manifests')

      //should have only one marker at manifest level for manifest 'Einsiedeln, 278 1040'
      cy.get('@manifests')
        .find('[data-cy="tree-node-marker"]')
        .should('have.length', 1)
        .closest('[data-cy="tree-node"]')
        .as('manifest')

      cy.get('@manifest').then(($manifest) => {
        Tree.shouldHaveLabel($manifest, 'einsiedeln_278_1040.json')
          .click()

        //should only have one marker at item level for item '279'
        Tree.getDirectChildren($manifest)
          .find('[data-cy="tree-node-marker"]')
          .should('have.length', 1)
          .closest('[data-cy="tree-node-leaf"]')
          .then(($item) => Tree.shouldHaveLabel($item, 'einsiedeln_278_1040-279.json'))
      })
  });
  runConfigTest('rootCollections[]=http://localhost:8181/example/collections/example.json',
    'Should show one root collection in global tree with root node expanded', () => {
      Tree.open()
      Tree.getRootNodes()
        .should('have.length', 1)
        .eq(0)
        .then(($rootCollection) => {
          const manifestsCount = 3
          Tree.shouldHaveLabel($rootCollection, 'Classic Literature Collection')
          Tree.shouldHaveChildren($rootCollection, manifestsCount)
        })
  });
  runConfigTest('rootCollections[]=http://localhost:8181/example/collections/example.json&rootCollections[]=http://localhost:8181/4w/collections/transcriptions.json',
    'Should show two root collections in global tree with both root nodes collapsed', () => {
      Tree.open()
      Tree.getRootNodes()
        .should('have.length', 2)
        .as('rootCollections')

      cy.get('@rootCollections')
        .eq(0)
        .then(($rootCollection) => {
          const collectionLabel = 'Classic Literature Collection'
          const manifestsCount = 3
          checkTreeCollapsedCollection($rootCollection, collectionLabel, manifestsCount)
        })

      cy.get('@rootCollections')
        .eq(1)
        .then(($rootCollection) => {
          const collectionLabel = 'Transkriptionen'
          const manifestsCount = 4
          checkTreeCollapsedCollection($rootCollection, collectionLabel, manifestsCount)
        })
  });
  runConfigTest('showGlobalTree=false', 'Should not show the global tree toggle', () => {
    cy.get('[data-cy="global-tree-toggle"]')
      .should('not.exist')
  });
  //collection with annotations
  runConfigTest('annotations.defaultMode=list&panels[0].collection=http://localhost:8181/example/collections/example.json',
    'Should have annotations list view preselected', () => {
      cy
        .get('[data-cy="item-label"')
        .should('contain', 'Chapter 1')
      //open annotations sidebar
        .get('[data-cy="sidebar-toggle"]')
        .should('be.enabled')
        .click()
        .get('[data-cy="annotations-header"]')
        .should('be.visible')
        .find('[data-cy="annotations-mode-toggle"]')
        .find('[data-cy="list"]')
        .should('be.visible')
        .should('have.attr', 'data-state', 'on')

      // Hint: commented out this test because the order of annotations it's not a testable evidence.
      // Annotations in list view should actually also maintain the order of appearance.
      //check if "Successful courtier" is the last annotation
      // Successful courtier is the last item in list view but not in align view
      // cy.get('[data-sidebar-container="true"]')
      //   .find('[data-annotation]')
      //   .should('have.length', 10)
      //   .then($annotations => {
      //     const top9 = $annotations.eq(9).position().top
      //     const top8 = $annotations.eq(8).position().top
      //
      //     //in list view, the last item is below the second to last item for this collection
      //     expect(top9, 'Annotation #10 should be below (have a higher position.top) annotation #9')
      //       .to.be.gt(top8)
      //   })
  });
  //collection with annotations
  runConfigTest('defaultAnnotationsMode=align&panels[0].collection=http://localhost:8181/example/collections/example.json',
    'Should have annotations align view preselected', () => {
      //open annotations sidebar
      cy
        .get('[data-cy="item-label"')
        .should('contain', 'Chapter 1')
        .get('[data-cy="sidebar-toggle"]')
        .should('be.enabled')
        .click()
        .get('[data-cy="annotations-header"]')
        .should('be.visible')
        .find('[data-cy="annotations-mode-toggle"]')
        .find('[data-cy="aligned"]')
        .should('be.visible')
        .should('have.attr', 'data-state', 'on')

      // Hint: commented out this test because the order of annotations it's not a testable evidence.
      // Annotations in both views should actually also maintain the order of appearance.
      //check if "Successful courtier" is NOT the last annotation
      // Successful courtier is the last item in list view but not in align view
      // cy.wait(1000).get('[data-sidebar-container="true"]')
      //   .find('[data-annotation]')
      //   .should('have.length', 10)
      //   .then($annotations => {
      //     const top9 = $annotations.eq(9).position().top
      //     const top8 = $annotations.eq(8).position().top
      //
      //     //in align view, the last item is above the second to last item for this collection
      //     expect(top9, 'Annotation #10 should be above (have a lower position.top) annotation #9')
      //       .to.be.lt(top8)
      //   })
  });
  runConfigTest('lang=de&translations.de.common.add_new_panel=Willk%C3%BCrliche%20%C3%9Cbersetzung',
    'Should apply custom common translation "Willkürliche Übersetzung" to add-new-panel-button', () => {
      cy.get('[data-cy="new-panel"]').should('have.text', 'Willkürliche Übersetzung')
  });
  runConfigTest('lang=de&translations.de.common.accurate=genau&panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json',
    'Should apply custom common translation "genau" for custom translation key "accurate"', () => {
      cy.get('[data-cy="content-type"]').should('contain.text', 'genau')
  });
  runConfigTest('lang=de&translations.de.transcriptions.accurate=genau&panels[0].collection=http://localhost:8181/4w/collections/transcriptions.json',
    'Should apply custom translation "genau" for custom translation key "accurate" and collection key "reproduction"', () => {
      cy.get('[data-cy="content-type"]').should('contain.text', 'genau')
  });
  // runConfigTest('panelModes[]=text&panelModes[]=split',
  //   'Should have panel mode "text" preselected, with "split" as the only other selectable panel mode', () => {
  //     Panel.getPanelModeOption('text')
  //       .should('have.attr', 'data-selected', 'true')
  //     Panel.getPanelModeOption('split', true)
  //       .should('have.attr', 'data-selected', 'false')
  //     Panel.getPanelModeOption('swap', true)
  //       .should('not.exist')
  // });
  // runConfigTest('panelModes[]=image',
  //   'Should not allow panel mode selection when configuring a singular panel mode', () => {
  //     Panel.getPanelModeSelect().should('not.exist')
  // });
  // runConfigTest('defaultPanelMode=split&panels[0].mode=text',
  // 'Should apply panel specific panel mode and ignore default panel mode for this panel', () => {
  //   Panel.getPanelModeOption('text')
  //     .should('have.attr', 'data-selected', 'true')
  //   Panel.getPanelModeOption('split', true)
  //     .should('have.attr', 'data-selected', 'false')
  // });
});
