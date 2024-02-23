import { ahiqarApiBaseUrl, gflApiBaseUrl } from '../support/globals';

describe('Annotation', () => {
  describe('Multiple Tabs', () => {
    beforeEach(() => {
      cy
        .visit(`/ahiqar-arabic-karshuni-local.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r7vd/130/latest/item.json`)
        .get('#text-content')
        .should('be.visible')
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list')
        .should('be.visible')
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list .q-item')
        .should('be.visible');
    });

    it('Should display first annotation tab', () => {
      cy
        .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
        .first()
        .should('have.class', 'q-tab--active');

      cy
        .get('.panels-target > .item:nth-child(4) .q-list .q-item')
        .first()
        .contains('حيقار');
    });

    it('Should switch to second annotation tab', () => {
      cy
        .get('.panels-target > .item:nth-child(4) .q-list')
        .should('be.visible')
        .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
        .eq(1)
        .click()
        .wait(400) // wait for tab switch transition
        .should('have.class', 'q-tab--active')
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list .q-item')
        .eq(0)
        .contains('Successful courtier');
    });

    it('Should stay on first tab when switch item', () => {
      cy
        .get('button.next-item')
        .click()
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list')
        .should('be.visible')
        .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
        .first()
        .should('have.class', 'q-tab--active')
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list .q-item')
        .first();
    });

    it('Should stay on second tab when switch item', () => {
      cy
        .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
        .eq(1)
        .click()
        .wait(400) // wait for tab switch transition
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list')
        .should('be.visible')
        .get('button.next-item')
        .click()
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list .q-item')
        .first()
        .contains('Successful courtier');
    });

    it('Should switch to first tab when switch manifest', () => {
      cy
        .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
        .eq(1)
        .click()
        .get('button.previous-item')
        .invoke('attr', 'disabled')
        .then((disabled) =>{
          disabled ? cy.log('buttonIsDiabled') : cy.get('button.previous-item').click();
        })

        .get('.panels-target > .item:nth-child(4) .q-panel:nth-child(2) .q-list')
        .should('be.visible')
        .get('button.previous-item').then((prevButton) => {
          if (prevButton.disabled) { // when we are on 1st manifest, 1st item and have the 2nd tab of annotations opened.. Then we want to go to prev mainfest - here the button is disabled. So it doesnt proceed.. Therefore the first tab need not be active
            cy.get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
              .first()
              .should('have.class', 'q-tab--inactive');
          } else {
            cy.get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
              .first()
              .should('have.class', 'q-tab--active');
          }
        });
    });

    it('Should select all from panel action', () => {
      cy
        .get('.panels-target > .item:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .click()
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list .q-item')
        .should('have.class', 'active')
        .get('.panels-target > .item:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'true')
        .get('.panels-target > .item:nth-child(3)')
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 16);
    });

    it('Should unselect all from panel action', () => {
      cy
        .get('.panels-target > .item:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .click()
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list .q-item')
        .should('have.class', 'active')
        .get('.panels-target > .item:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'true')
        .click()
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list .q-item')
        .should('not.have.class', 'active')
        .get('.panels-target > .item:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'false')
        .get('.panels-target > .item:nth-child(3)')
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 0);
    });

    it('Should select one annotation', () => {
      cy
        .get('.panels-target > .item:nth-child(4)')
        .find('.q-tab-panel .q-list .q-item')
        .first()
        .click()
        .should('have.class', 'active')
        .get('.panels-target > .item:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'mixed')
        .get('.panels-target > .item:nth-child(3)')
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 1);
    });

    it('Should unselect one annotation', () => {
      cy
        .get('.panels-target > .item:nth-child(4)')
        .find('.q-tab-panel .q-list .q-item')
        .first()
        .click()
        .should('have.class', 'active')
        .get('.panels-target > .item:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'mixed')
        .get('.panels-target > .item:nth-child(4)')
        .find('.q-tab-panel .q-list .q-item')
        .first()
        .click()
        .get('.panels-target > .item:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'false')
        .get('.panels-target > .item:nth-child(3)')
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 0);
    });

    it('Should scroll in text to highlighted annotation', { scrollBehavior: false }, () => {

      // We scroll down the text panel first and select the first annotation
      // because there is a problem with initial scrolling of text panel.
      // Somehow it works when scroll programmatically like described above.
      cy
        .get('.panels-target > .item:nth-child(3) .content-view')
        .scrollTo('bottom')
        .get('.panels-target > .item:nth-child(4)')
        .find('.q-tab-panel .q-list .q-item')
        .first()
        .click().then(($annot) => {
          const delimiter = 'annotation-';
          const dataAnnotationId = $annot.attr('data-annotation-id');
          const annotTranscriptId = '#'.concat(dataAnnotationId.split(delimiter)[1]);
          cy.log('Annot transcript ID', annotTranscriptId);
          cy.get(annotTranscriptId)
          .invoke('attr', 'data-annotation-level').should('equal', '1');
        });
    });
  });

  describe('Text Annotation', () => {
    beforeEach(() => {
      cy.visit(`/gfl-local.html?item=${gflApiBaseUrl}/textapi/Z_1819-06-03_l/Z_1819-06-03_l_page1/latest/item.json`)

      cy
        .get('.panels-target > .item:nth-child(2)')
        .should('be.visible')
        .contains('Edierter Text')
        .click();

      cy
        .get('.panels-target > .item:nth-child(3)')
        .should('be.visible')
        .within(() => {
          cy
            .get('.q-tab-panel .q-list .q-item:first-child')
            .as('annotationItem')
            .should('be.visible');
        });
    });

    it('should not be selectable when clicked', () => {
      cy
        .get('@annotationItem')
        .should('have.length', 1) // retry until we have only one subject
        .click()
        .should('not.have.class', 'active');
    });

    it('should not have an icon', () => {
      cy
        .get('@annotationItem')
        .should('have.length', 1) // retry until we have only one subject
        .within(() => {
          cy
            .get('.q-item__section--avatar')
            .should('be.empty');
        });
    });
  });
});
