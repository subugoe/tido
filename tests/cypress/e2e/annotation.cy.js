import { ahiqarApiBaseUrl, gflApiBaseUrl } from '../support/globals';

describe('Annotation', () => {
  describe('Multiple Tabs', () => {
    beforeEach(() => {
      cy
        //.visit(`/ahiqar-arabic-karshuni-local.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r7vd/130/latest/item.json`)
        .visit(`http://localhost:2222/ahiqar-arabic-karshuni-local.html?tido={"m":7,"i":0,"p":"0_0,1_0,2_0,3_0"}`)
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
        .get('#text-content')
        .contains('ذلك')
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list')
        .should('be.visible')
        .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
        .first()
        .should('have.class', 'q-tab--active')
        .get('.panels-target > .item:nth-child(4) .q-tab-panel .q-list .q-item')
        .first()
        .contains('نادان');
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
        .click()
        .get('.panels-target > .item:nth-child(4) .q-panel:nth-child(2) .q-list')
        .should('be.visible')
        .get('.panels-target > .item:nth-child(3) #text-content')
        .contains('وورمت')
        .get('.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
        .first()
        .should('have.class', 'q-tab--active');
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
        .click()
        .get('#t_Mingana_ar_christ_93_84_MD1816225N1l5l3l5l5l47l3l2_1') //Orlin: it was:
        //.get('#t_Mingana_ar_christ_93_84_MD1789222N1l5l3l5l5l7l3l2_1') // Orlin: it became

        .should('be.visible');
    });
  });

  describe('Text Annotation', () => {
    beforeEach(() => {
      //cy.visit(`/gfl-local.html?item=${gflApiBaseUrl}/textapi/Z_1819-06-03_l/Z_1819-06-03_l_page1/latest/item.json`)
      cy.visit(`/gfl-local.html?tido={"i":0}`)
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
