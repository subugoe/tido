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
    newQuery.tido = query;
    
    Object.keys(newQuery).forEach((key) => {
      params.set(key, newQuery[key]);
    });
    window.history.pushState({}, '', url);
  }


  async updatePanels(activeViews) {
    let oldQueryValue = this.getQuery();
    let newQueryValue = '';
    const panels = Object.keys(activeViews).map((panelIndex) => `${panelIndex}.${activeViews[panelIndex]}`).join('-');

    if (oldQueryValue.includes('p') === false) newQueryValue = oldQueryValue.concat('_'+'p'+panels);
    else {
      
      const arrayAttributes = oldQueryValue.split('_');
      const indexPanelsPart = arrayAttributes.findIndex((element) => element.includes('p') );
      const updatedPanelsPart = 'p'+ panels;
      
      newQueryValue = arrayAttributes.slice(0,indexPanelsPart).join('_').concat('_'+updatedPanelsPart);

      const partAfterPanels = arrayAttributes.slice(indexPanelsPart+1).join('_');
      if (partAfterPanels !== '') {
        newQueryValue = newQueryValue.concat('_'+arrayAttributes.slice(indexPanelsPart+1).join('_'));
      }  
    }
    
    await this.pushQuery(newQueryValue);
  }

  async updateShow(panelIndexes = []) {
    // TODO: $route doesn't update quick enough, in future we have to switch to Composition APIs useRoute()
    await delay(300);

    let oldQueryValue = this.getQuery();
    let newQueryValue = '';

    // Does not append (= removes) the "show" param from URL if panelIndexes empty.
    if (panelIndexes.length > 0) {
      panelIndexes = panelIndexes.join('-');
      if (oldQueryValue.includes('s') === false) newQueryValue = oldQueryValue.concat('_'+'s'+panelIndexes);
      else {
        const arrayAttributes = oldQueryValue.split('_');
        const indexShowPart = arrayAttributes.findIndex((element) => element.includes('s') );
        const updatedShowPart = 's'+ panelIndexes;
        
        newQueryValue = arrayAttributes.slice(0,indexShowPart).join('_').concat('_'+updatedShowPart);
  
        const partAfterItem = arrayAttributes.slice(indexShowPart+1).join('_');
        if (partAfterItem !== '') {
          newQueryValue = newQueryValue.concat('_'+arrayAttributes.slice(indexShowPart+1).join('_'));
        }  
      }

    } else {
      if (oldQueryValue.includes('s') === true) {
        const arrayAttributes = oldQueryValue.split('_');
        const indexShowPart = arrayAttributes.findIndex((element) => element.includes('s') );
        arrayAttributes.splice(indexShowPart, 1);
        newQueryValue = arrayAttributes.join('_');
      } 
    }
    
    await this.pushQuery(newQueryValue);
  }

  async updateItem(itemIndex, resultConfig) {
    const oldQueryValue = this.getQuery();
    let newQueryValue = '';
    if (oldQueryValue === '') {
      newQueryValue = oldQueryValue.concat('i'+itemIndex.toString());
    }

    else if (oldQueryValue.includes('i') === true) {
      const arrayAttributes = oldQueryValue.split('_');
      const indexItemPart = arrayAttributes.findIndex((element) => element.includes('i') );
      const updatedItemPart = 'i'+ itemIndex.toString();
      
      if (oldQueryValue.includes('m') === true) {
          newQueryValue = arrayAttributes.slice(0,indexItemPart).join('_').concat('_'+updatedItemPart);
        }
      else {
        newQueryValue = updatedItemPart;
      }

      const partAfterItem = arrayAttributes.slice(indexItemPart+1).join('_');
      if (partAfterItem !== '') {
        newQueryValue = newQueryValue.concat('_'+arrayAttributes.slice(indexItemPart+1).join('_'));
      }  
    }

    else if (oldQueryValue.includes('i') === false) {
      newQueryValue = oldQueryValue.concat('_'+'i'+itemIndex.toString());
    }
    await this.pushQuery(newQueryValue);

  }

  async updateManifest (manifestIndex, resultConfig) {
    const oldQueryValue = this.getQuery();
    const arrayAttributes = oldQueryValue.split('_');
    const updatedManifestPart = 'm'+ manifestIndex.toString();
    let newQueryValue = '';

    if (oldQueryValue === '') {
      newQueryValue = oldQueryValue.concat('m'+manifestIndex.toString());
    }
    else if (oldQueryValue.includes('m') === true) {
      // split the query based on '_'
      // change the value of manifest on the respective split 
      // Join again the splits
      
      if (arrayAttributes.length > 1)  newQueryValue = updatedManifestPart.concat('_'+oldQueryValue.split('_').slice(1).join('_'));
      else {
        newQueryValue = updatedManifestPart;   //  if the next part of the oldQuery is empty - then don't add a _
      }
    }

    else if (oldQueryValue.includes('m') === false) {
      if ('collection' in resultConfig && resultConfig.collection !== '') {
          newQueryValue = updatedManifestPart.concat('_',oldQueryValue);  // if there is a collection in config and there is no 'm' in URL, then add 'm' in URL 
      }
      else {
        newQueryValue = oldQueryValue;  // if there is a manifest in config
      }
    }
    await this.pushQuery(newQueryValue);

  }

  async updateQuery(query, resultConfig) {
    for(const key of Object.keys(query)) {
      if (key === 'i') this.updateItem(query[key], resultConfig);
      if (key === 'm') this.updateManifest(query[key], resultConfig);
    }
  }

  getQuery() {
    let queryString = window.location.search.substring(1);
    if (queryString !== '') queryString = queryString.split('=')[1];
    return queryString;
  }
}

export default new BookmarkService();