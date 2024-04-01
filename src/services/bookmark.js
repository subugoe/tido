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
    const updatedPanelsPart = 'p'+ panels;

    if (oldQueryValue.includes('p') === false) newQueryValue = oldQueryValue.concat('_'+'p'+panels);
    else {
      const arrayAttributes = oldQueryValue.split('_');
      const indexPanelsPart = arrayAttributes.findIndex((element) => element.includes('p') );
      newQueryValue = arrayAttributes.slice(0,indexPanelsPart).join('_').concat('_'+updatedPanelsPart); // joining part before panels with the updatedPanels part
      const showPart = arrayAttributes.slice(indexPanelsPart+1);
      if (showPart.length > 0) {  // if have 's' containing [1: n_panels-1], then concatenate the show part
        newQueryValue = newQueryValue.concat('_'+showPart);
      }  
    }
    
    await this.pushQuery(newQueryValue);
  }

  async updateShow(panelIndexes = []) {
    // TODO: $route doesn't update quick enough, in future we have to switch to Composition APIs useRoute()
    await delay(300);

    let oldQueryValue = this.getQuery();
    let newQueryValue = '';
    const arrayAttributes = oldQueryValue.split('_');
    const indexShowPart = arrayAttributes.findIndex((element) => element.includes('s') );
    if (panelIndexes.length > 0) { 
      panelIndexes = panelIndexes.join('-');
      if (oldQueryValue.includes('s') === false) newQueryValue = oldQueryValue.concat('_'+'s'+panelIndexes);
      else { 
        const updatedShowPart = 's'+ panelIndexes; 
        newQueryValue = arrayAttributes.slice(0,indexShowPart).join('_').concat('_'+updatedShowPart);  // concatenate the part before 's' and the updatedShow part
        const panelsPart = arrayAttributes.slice(indexShowPart+1).join('_');
        if (panelsPart !== '') {      // if we open have opened show and then panels sequentially, in the oldQuery we have panels at the end. when we update show, then we don't forget to include panels as well
          newQueryValue = newQueryValue.concat('_'+panelsPart);
        }  
      }

    } else { // when we have all panels opened, then panel_Indexes becomes 0, in this case we remove 's' attribute from the URL
        arrayAttributes.splice(indexShowPart, 1);
        newQueryValue = arrayAttributes.join('_');
    }
    
    await this.pushQuery(newQueryValue);
  }

  async updateItem(itemIndex, resultConfig) {
    const oldQueryValue = this.getQuery();
    const arrayAttributes = oldQueryValue.split('_');
    const updatedItemPart = 'i'+ itemIndex.toString();
    let newQueryValue = '';
    let partAfterItem = '';

    if (oldQueryValue === '' || (oldQueryValue.includes('i') === true && arrayAttributes.length === 1)) newQueryValue = updatedItemPart;
    else if (oldQueryValue.includes('m') === true) {
      if (arrayAttributes.length === 1) newQueryValue = oldQueryValue.concat('_',updatedItemPart);  
      else {
        if (oldQueryValue.includes('i') === true) {
          partAfterItem = arrayAttributes.slice(2).join('_');
          if (partAfterItem === '') newQueryValue = arrayAttributes[0].concat('_', updatedItemPart);
          else if (partAfterItem !== '')  newQueryValue = arrayAttributes[0].concat('_', updatedItemPart,'_',partAfterItem); 
        } 
        else if (oldQueryValue.includes('i') === false) {
          partAfterItem = arrayAttributes.slice(1).join('_');
          newQueryValue = oldQueryValue.concat('_', partAfterItem);
        }
      }
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
      console.log('old Query in updateManifest', oldQueryValue);
      if (arrayAttributes.length > 1)  {
        newQueryValue = updatedManifestPart.concat('_'+oldQueryValue.split('_').slice(1).join('_'));
        console.log('updated queryValue in updateManifest', newQueryValue);
      }
      else {
        newQueryValue = updatedManifestPart;   //  if the next part of the oldQuery is empty - then don't add a _
      }
    }

    else if (oldQueryValue.includes('m') === false) {
      if ('collection' in resultConfig && resultConfig.collection !== '') {
          newQueryValue = updatedManifestPart.concat('_',oldQueryValue);  // if there is a collection in config and there is no 'm' in URL, then add 'm' in URL 
          console.log('new Query Value in updateManifest', newQueryValue);
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