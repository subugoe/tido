import { manifest } from '@/store/contents/getters';
import { delay } from '@/utils';

class BookmarkService {
  $router;

  initRouter(router) {
    this.$router = router;
  }

  async pushQuery(query) {
    const url = new URL(window.location);
    url.search = '';
    const params = url.searchParams;
    let newQuery = {};
    newQuery.tido = {...query};
    Object.keys(newQuery).forEach((key) => {
      params.set(key, JSON.stringify(newQuery[key]));
    });
    window.history.pushState({}, '', url);
  }


  async updatePanels(activeViews) {
    let oldQuery = this.getQuery();
    const panels = Object.keys(activeViews).map((panelIndex) => `${panelIndex}_${activeViews[panelIndex]}`).join(',');
    let newQuery = {...oldQuery};
    newQuery.p = panels;
    await this.pushQuery(newQuery);
  }

  async updateShow(panelIndexes = []) {
    // TODO: $route doesn't update quick enough, in future we have to switch to Composition APIs useRoute()
    await delay(300);

    const oldQuery = this.getQuery();
    let newQuery = {...oldQuery};

    // Does not append (= removes) the "show" param from URL if panelIndexes empty.
    if (panelIndexes.length > 0) {
      newQuery.s = panelIndexes.join(',');

    } else {
      if (oldQuery.s) delete oldQuery.s;
      newQuery = oldQuery;
    }
    
    await this.pushQuery(newQuery);
  }

  async updateItem(itemIndex, oldQuery) {
    let newQuery = this.getQuery();
    newQuery.i = itemIndex;
    await this.pushQuery(newQuery);

  }

  async updateManifest (manifestIndex, oldQuery) {
    let newQuery = this.getQuery();
    newQuery.m = manifestIndex;
    await this.pushQuery(newQuery);

  }

  async updateQuery(query) {

    const oldQuery = {...this.getQuery()};
    for(const key of Object.keys(query)) {
      if (key === 'i') this.updateItem(query[key], oldQuery);
      if (key === 'm') this.updateManifest(query[key], oldQuery);
    }
  }

  getQuery() {
    
    let queryString = window.location.search.substring(1);

    let queryObject = queryString.split('&').reduce((acc, cur) => {
      const [key, value] = cur.split('=');
      if (key && value) acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
   
   let newQueryObject = {} 
   if ('tido' in queryObject) newQueryObject = JSON.parse(queryObject.tido);
   else {
    newQueryObject = Object.keys(queryObject).length > 0 ? JSON.parse(queryObject) : {};   
   }
   return newQueryObject;
    
  }
}

export default new BookmarkService();
