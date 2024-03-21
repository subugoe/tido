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
    
    console.log('query in pushQuery()', query);
    let newQuery = {};
    newQuery.tido = query;
    
    Object.keys(newQuery).forEach((key) => {
      params.set(key, newQuery[key]);
    });
    

    console.log('new Query in pushQuery()', newQuery);

    window.history.pushState({}, '', url);
  }


  async updatePanels(activeViews) {
    console.log('update panels', activeViews);
    let oldQueryValue = this.getQuery();
    let newQueryValue = '';
    const panels = Object.keys(activeViews).map((panelIndex) => `${panelIndex}.${activeViews[panelIndex]}`).join('-');
    
    console.log('panels value', panels);
    if (oldQueryValue.includes('p') === false) newQueryValue = oldQueryValue.concat('_'+'p'+panels);
    else {
      const pIndex = oldQueryValue.indexOf("p")
      const stringBeforePanels = oldQueryValue.substring(0, pIndex-1);
      newQueryValue = stringBeforePanels.concat('_'+'p'+panels);
    }
    
    await this.pushQuery(newQueryValue);
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

  async updateItem(itemIndex) {
    const oldQueryValue = this.getQuery();
    let newQueryValue = '';
    console.log('old Query in updateItem()', oldQueryValue);
    if (oldQueryValue === '') {
      newQueryValue = oldQueryValue.concat('i'+itemIndex.toString());
    }


    else if (oldQueryValue.includes('i') === true) {
      const arrayAttributes = oldQueryValue.split('_');
      const indexItemPart = arrayAttributes.findIndex((element) => element.includes('i') );
      const updatedItemPart = 'i'+ itemIndex.toString();

      console.log('Array attributes', arrayAttributes);
      console.log('index item Part', indexItemPart);
      console.log('Updated item Part', updatedItemPart);
      
      newQueryValue = arrayAttributes.slice(0,indexItemPart).join('_').concat('_'+updatedItemPart);

      const partAfterItem = arrayAttributes.slice(indexItemPart+1).join('_');
      if (partAfterItem !== '') {
        newQueryValue = newQueryValue.concat('_'+arrayAttributes.slice(indexItemPart+1).join('_'));
      }  
      console.log('new Query Value in updateItem', newQueryValue);
    }

    else if (oldQueryValue.includes('i') === false) {
      newQueryValue = oldQueryValue.concat('_'+'i'+itemIndex.toString());
    }
   
    await this.pushQuery(newQueryValue);

  }

  async updateManifest (manifestIndex) {
    const oldQueryValue = this.getQuery();
    let newQueryValue = '';
    console.log('old Query in updateManifest()', oldQueryValue);
    if (oldQueryValue === '') {
      newQueryValue = oldQueryValue.concat('m'+manifestIndex.toString());
    }
    else if (oldQueryValue.includes('m') === true) {
      // split the query based on '_'
      // change the value of manifest on the respective split 
      // Join again the splits

      //const splitManifest = oldQueryValue.split('_')[0];
      const newSplitManifest = 'm'+ manifestIndex.toString(); 
      newQueryValue = newSplitManifest.concat('_'+oldQueryValue.split('_').slice(1).join('_'));
      
      
    }

    else if (oldQueryValue.includes('m') === false) {
      newQueryValue = oldQueryValue.concat('_'+'m'+manifestIndex.toString());
    }

    await this.pushQuery(newQueryValue);

  }

  async updateQuery(query) {

    for(const key of Object.keys(query)) {
      if (key === 'i') this.updateItem(query[key]);
      if (key === 'm') this.updateManifest(query[key]);
    }
  }

  getQuery() {
    
    let queryString = window.location.search.substring(1);
    console.log('queryString', queryString);
    if (queryString !== '') queryString = queryString.split('=')[1];
    
    console.log('query String in getQuery()', queryString);
    /*
    let queryObject = queryString.split('&').reduce((acc, cur) => {
      const [key, value] = cur.split('=');
      if (key && value) acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
    */
   
   //let newQueryValue = '';
   //console.log('query string', queryString);

   /*
   if ('tido' in queryObject) newQueryValue = queryObject.tido;
   else {
    newQueryValue = Object.keys(queryObject).length > 0 ? queryString : '';   
   }
   console.log('newQueryValue')
   //console.log('New query object', newQueryObject);

   */

   return queryString;
    
  }
}

export default new BookmarkService();
