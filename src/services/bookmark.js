import { manifest } from '@/store/contents/getters';
import { delay } from '@/utils';

class BookmarkService {
  $router;

  initRouter(router) {
    this.$router = router;
  }

  async pushQuery(query) {
    // Orlin: In this solution I treat query as the (key, value) pair of the current action
    const url = new URL(window.location);
    url.search = '';
    const params = url.searchParams;

    Object.keys(query).forEach((key) => {
      params.set(key, JSON.stringify(query[key]));
      console.log("Url", url);
    });
    //Object.keys(query).forEach((key) => params.set(key, query[key]));
    window.history.pushState({}, '', url);
  }


  async updatePanels(activeViews) {
    let oldQuery = this.getQuery();
    const panels = Object.keys(activeViews).map((panelIndex) => `${panelIndex}_${activeViews[panelIndex]}`).join(',');
    const newQuery = this.updateQuery(oldQuery, panels, 'p');
    await this.pushQuery(newQuery);
  }

  async updateShow(panelIndexes = []) {
    // TODO: $route doesn't update quick enough, in future we have to switch to Composition APIs useRoute()
    await delay(300);

    const oldQuery = this.getQuery();
    let oldQueryValue = oldQuery.tido;
    let newQuery = {}

    // Does not append (= removes) the "show" param from URL if panelIndexes empty.
    if (panelIndexes.length > 0) {
      newQuery = this.updateQuery(oldQuery, panelIndexes.join(','), 's');
    } else {
      if (oldQuery.tido.s) delete oldQuery.tido.s;  // when we open all panels, then we remove show from the Query GET Params
      newQuery = oldQuery;
    }
    
    await this.pushQuery(newQuery);
  }

  async updateItemQuery(item) {

    const oldQuery = {...this.getQuery()};
    let query = {
      ...oldQuery,
      ...(item ? { 'tido':item } : {}),
    };

    if (item && 'tido' in oldQuery){
      for(const key of Object.keys(oldQuery['tido'])){
        if(key in query.tido === false){
          query.tido[key] = oldQuery['tido'][key];
        }
      }
    }

    await this.pushQuery(query);
  }

  updateQuery (oldQuery, updatedAttribute, nameUpdatedAttribute){
    oldQuery.tido[nameUpdatedAttribute] = updatedAttribute;
    const newQuery = {...oldQuery};
    return newQuery;
  } 

  getQuery() {
    
    let queryString = window.location.search.substring(1);

    queryString = queryString.split('&').reduce((acc, cur) => {
      const [key, value] = cur.split('=');
      if (key && value) acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
    // at first load the URL params is {} -> no key
    if ('tido' in queryString){
      let getParamsValueJson = JSON.parse(queryString.tido);
      queryString.tido = getParamsValueJson;
    }
    
    return queryString;
    
  }
}

export default new BookmarkService();
