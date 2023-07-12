import { apiBaseUrl } from '../support/globals';

describe('Annotation - Multiple Tabs', () => {
  beforeEach(() => {
    cy
      .visit(`/ahiqar-arabic-karshuni-local.html?item=${apiBaseUrl}/textapi/ahiqar/arabic-karshuni/3r7vd/130/latest/item.json`)
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
      .wait(400)// wait for tab switch transition
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
});
