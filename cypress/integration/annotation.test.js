describe('Annotation - Multiple Tabs', () => {
  beforeEach(() => {
    cy
      .visit('/#/?item=https://ahiqar.uni-goettingen.de/api/textapi/ahikar/arabic-karshuni/3r7vd-130/latest/item.json')
      .get('.root.panels-target > .item:nth-child(4) .q-list')
      .should('be.visible');
  });
  it('Should display first annotation tab', () => {
    cy
      .get('.root.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
      .first()
      .should('have.class', 'q-tab--active');

    cy
      .get('.root.panels-target > .item:nth-child(4) .q-list .q-item')
      .first()
      .contains('حيقار');
  });

  it('Should switch to second annotation tab', () => {
    cy
      .get('.root.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .should('have.class', 'q-tab--active')
      .get('.root.panels-target > .item:nth-child(4) .q-panel:nth-child(2) .q-list .q-item')
      .eq(0)
      .contains('Successful courtier');
  });

  it('Should stay on first tab when switch item', () => {
    cy
      .get('button.next-item')
      .click()
      .get('.root.panels-target > .item:nth-child(4) .q-panel:nth-child(1) .q-list')
      .should('be.visible')
      .get('.root.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
      .first()
      .should('have.class', 'q-tab--active')
      .get('.root.panels-target > .item:nth-child(4) .q-panel:nth-child(1) .q-list .q-item')
      .first()
      .contains('نادان');
  });

  it('Should stay on second tab when switch item', () => {
    cy
      .get('.root.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .get('.root.panels-target > .item:nth-child(4) .q-panel:nth-child(2) .q-list')
      .should('be.visible')
      .get('button.next-item')
      .click()
      .get('.root.panels-target > .item:nth-child(4) .q-panel:nth-child(2) .q-list .q-item')
      .first()
      .contains('Successful courtier');
  });

  it('Should switch to first tab when switch manifest', () => {
    cy
      .get('.root.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
      .eq(1)
      .click()
      .get('button.previous-item')
      .click()
      .get('.root.panels-target > .item:nth-child(4) .q-panel:nth-child(2) .q-list')
      .should('be.visible')
      .get('.root.panels-target > .item:nth-child(3) #text-content')
      .contains('وورمت')
      .get('.root.panels-target > .item:nth-child(4) .q-tabs__content .q-tab')
      .first()
      .should('have.class', 'q-tab--active')
      .get('.root.panels-target > .item:nth-child(4) .q-panel:nth-child(1) .q-list .q-item')
      .first()
      .contains('حيقار');
  });
});
