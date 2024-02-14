import { ahiqarApiBaseUrl, gflApiBaseUrl } from '../support/globals';

const selectors = {
  list: '.panels-wrapper > .panel:nth-child(4) [role="tablist"] .annotations-list',
  listItem: '.panels-wrapper > .panel:nth-child(4) [role="tablist"] .annotations-list .item',
  listOfSecondTab: '.panels-wrapper > .panel:nth-child(4) [role="tabpanel"]:nth-child(2) .annotations-list',
  tab: '.panels-wrapper > .panel:nth-child(4) [role="tablist"] [data-pc-section="nav"] [data-pc-name="tabpanel"]'
}

describe('Annotation', () => {
  describe('Multiple Tabs', () => {
    beforeEach(() => {
      cy
        .visit(`/ahiqar-arabic-karshuni-local.html?item=${ahiqarApiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r7vd/130/latest/item.json`)
        .get('#text-content')
        .should('be.visible')
        .get(selectors.list)
        .should('be.visible')
        .get(selectors.listItem)
        .should('be.visible');
    });

    it('Should display first annotation tab', () => {
      cy
        .get(selectors.tab)
        .first()
        .should('have.attr', 'data-p-active', 'true');

      cy
        .get(selectors.listItem)
        .first()
        .contains('حيقار');
    });

    it('Should switch to second annotation tab', () => {
      cy
        .get(selectors.list)
        .should('be.visible')
        .get(selectors.tab)
        .eq(1)
        .click()
        .wait(400) // wait for tab switch transition
        .should('have.attr', 'data-p-active', 'true')
        .get(selectors.listItem)
        .eq(0)
        .contains('Successful courtier');
    });

    it('Should stay on first tab when switch item', () => {
      cy
        .get('button.next-item')
        .click()
        .get('#text-content')
        .contains('ذلك')
        .get(selectors.list)
        .should('be.visible')
        .get(selectors.tab)
        .first()
        .should('have.attr', 'data-p-active', 'true')
    .get(selectors.listItem)
        .first()
        .contains('نادان');
    });

    it('Should stay on second tab when switch item', () => {
      cy
        .get(selectors.tab)
        .eq(1)
        .click()
        .wait(400) // wait for tab switch transition
        .get(selectors.list)
        .should('be.visible')
        .get('button.next-item')
        .click()
        .get(selectors.listItem)
        .first()
        .contains('Successful courtier');
    });

    it('Should switch to first tab when switch manifest', () => {
      cy
        .get(selectors.tab)
        .eq(1)
        .click()
        .get('button.previous-item')
        .click()
        .get(selectors.listOfSecondTab)
        .should('be.visible')
        .get('.panels-target > .item:nth-child(3) #text-content')
        .contains('وورمت')
        .get(selectors.tab)
        .first()
        .should('have.attr', 'data-p-active', 'true');
    });

    it('Should select all from panel action', () => {
      cy
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .click()
        .get(selectors.listItem)
        .should('have.class', 'active')
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'true')
        .get('.panels-target > .item:nth-child(3)')
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 16);
    });

    it('Should unselect all from panel action', () => {
      cy
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .click()
        .get(selectors.listItem)
        .should('have.class', 'active')
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'true')
        .click()
        .get(selectors.listItem)
        .should('not.have.class', 'active')
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'false')
        .get('.panels-target > .item:nth-child(3)')
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 0);
    });

    it('Should select one annotation', () => {
      cy
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.q-tab-panel .q-list .q-item')
        .first()
        .click()
        .should('have.class', 'active')
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'mixed')
        .get('.panels-target > .item:nth-child(3)')
        .find('#text-content [data-annotation-ids][data-annotation-level="1"]')
        .should('have.length', 1);
    });

    it('Should unselect one annotation', () => {
      cy
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.q-tab-panel .q-list .q-item')
        .first()
        .click()
        .should('have.class', 'active')
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.panel-header .actions > div:first-child .q-checkbox')
        .should('have.attr', 'aria-checked', 'mixed')
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.q-tab-panel .q-list .q-item')
        .first()
        .click()
        .get('.panels-wrapper > .panel:nth-child(4)')
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
        .get('.panels-wrapper > .panel:nth-child(4)')
        .find('.q-tab-panel .q-list .q-item')
        .first()
        .click()
        .get('#t_Mingana_ar_christ_93_84_MD1816225N1l5l3l5l5l47l3l2_1')
        .should('be.visible');
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
