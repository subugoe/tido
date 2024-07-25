import { delay } from '@/utils';

class BookmarkService {

  async pushQuery(query) {
    const url = new URL(window.location);
    url.searchParams.set('tido', query);
    window.history.pushState({}, '', url);
  }

  getValueInOldQuery(oldQueryValue, key) {
    const oldQueryArray = oldQueryValue.split('_');
    let numbersPart = '';
    oldQueryArray.forEach((part) => {
      if (part.includes(key)) {
        numbersPart = part.slice(1);
      }
   });
   return numbersPart;
}

  async updateQueryFinal(updatedPartValue, key) {
    let oldQueryValue = this.getQuery();
    const attributes = ['m', 'i', 's', 'p'];
    let resultQuery = [null, null, null, null];

    if (oldQueryValue !== '') {
      // First: updateResult query based on the values of the previous oldQuery
      attributes.forEach((key, index) => {
        if (oldQueryValue.includes(key)) {
          // get the value of this key in the oldQuery
          // update this part in resultQuery
          resultQuery[index] = this.getValueInOldQuery(oldQueryValue, key);
        }
      });
    }

    // update the current key in resultQuery
    const indexKeyInQuery = attributes.findIndex((x) => x === key);
    resultQuery[indexKeyInQuery] = updatedPartValue;

    // join the query parts by filtering out 'undefined' part
    const newQuery = resultQuery
      .map((item, index) => ({ item, index }))
      .filter(({item}) => item !== null)
      .map(({item, index}) => attributes[index] + item)
      .join('_');

    await this.pushQuery(newQuery);
  }

  async updatePanels(activeViews) {
    const panels = Object.keys(activeViews).map((panelIndex) => `${panelIndex}.${activeViews[panelIndex]}`).join('-');
    this.updateQueryFinal(panels, 'p');
  }

  async updateShow(panelIndexes = []) {
    // TODO: $route doesn't update quick enough, in future we have to switch to Composition APIs useRoute()
    await delay(300);
    let updatedValue = panelIndexes.join('-');
    if (updatedValue === '') {
      // if all the panels are opened, then we remove the 's' part from URL
      updatedValue = null;
    }
    this.updateQueryFinal(updatedValue, 's');
  }

  async updateItem(itemIndex) {
    this.updateQueryFinal(itemIndex, 'i');
  }

  async updateManifest (manifestIndex) {
    this.updateQueryFinal(manifestIndex, 'm');
  }

  async updateQuery(query) {
    for (const key of Object.keys(query)) {
      if (key === 'i') {
        this.updateItem(query[key]);
      }
      if (key === 'm') {
        this.updateManifest(query[key]);
      }
    }
  }

  getQuery() {
    return new URLSearchParams(window.location.search).get('tido') ?? '';
  }
}

export default new BookmarkService();
