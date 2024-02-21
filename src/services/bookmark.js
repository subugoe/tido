import { manifest } from '@/store/contents/getters';
import { delay } from '@/utils';

import {setPanelIndexes} from '../store/contents/mutations';

let newQuery = {}

let countOnLoad = 1;

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
    
    console.log("Pushed query", query);
    
    Object.keys(query).forEach((key) => {
      params.set(key, JSON.stringify(query[key]));
      console.log("Url", url);
    });
    //Object.keys(query).forEach((key) => params.set(key, query[key]));
    window.history.pushState({}, '', url);
  }


  async updatePanels(activeViews) {
    let oldQuery = this.getQuery();
    console.log("Old query");
    const panels = Object.keys(activeViews).map((panelIndex) => `${panelIndex}_${activeViews[panelIndex]}`).join(',');
    console.log("Panels updated", panels);
    console.log("Type of panels", typeof panels);
    const newQuery = this.updateQuery(oldQuery, panels, 'panels');
    await this.pushQuery(newQuery);
  }

  async updateShow(panelIndexes = []) {
    console.log("Func() updateShow");
    // TODO: $route doesn't update quick enough, in future we have to switch to Composition APIs useRoute()
    await delay(300);


    const oldQuery = this.getQuery();
    let oldQueryValue = oldQuery.tido;
    let newQuery = {}

    console.log("Old query", oldQuery);

    // Does not append (= removes) the "show" param from URL if panelIndexes empty.
    if (panelIndexes.length > 0) {
      newQuery = this.updateQuery(oldQuery, panelIndexes.join(','), 'show');
    } else {
      if (oldQuery.tido.show) delete oldQuery.tido.show;  // when we open all panels, then we remove show from the Query GET Params
      newQuery = oldQuery;
    }
    //commit('content/{setPanelIndexes}', panelIndexes, { root: true });
    await this.pushQuery(newQuery);
  }

  async updateItemQuery(item) {


    const oldQuery = {...this.getQuery()};

    if ('tido' in oldQuery) {
      console.log("Keys of old query in updateItemQuery", Object.keys(oldQuery.tido));
      console.log('Old query', oldQuery);
    }

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
    /* Initial solution: 
    const query = {
      ...this.getQuery(),
      ...(item ? { 'tido':item } : {}),
    };
    */
    console.log("Updated item query in the Bookmark service", query);
    await this.pushQuery(query);
  }

  updateQuery (oldQuery, updatedAttribute, nameUpdatedAttribute){
    oldQuery.tido[nameUpdatedAttribute] = updatedAttribute;
    newQuery = {...oldQuery};
    return newQuery;
  } 

  getQuery() {
    
    let queryString = window.location.search.substring(1);
    //let queryString = window.location.search;
    
    console.log('Query string in getQuery (1)', queryString);


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
    
    console.log('Query string in getQuery (2)', queryString);
    return queryString;
    
  }
}

export default new BookmarkService();
