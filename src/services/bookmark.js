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

  async updateQueryFinal(updatedPart) {
    let oldQueryValue = this.getQuery();
    const attributeName = updatedPart[0];
    const [arrayAttributes, indexAttributePart] = this.getSettingFromQuery(oldQueryValue, attributeName);
    const numberAttributesInOldQuery = arrayAttributes.length;
    let newQueryAttributes = arrayAttributes.length > 0 ? arrayAttributes.slice() : [];
    let newQueryValue = '';
    if (indexAttributePart === -1) {
      // attribute is not in oldQuery, then we need to add it
      // check whether the oldQuery has no elements, 1 element
      if (numberAttributesInOldQuery === 0) {
        newQueryValue = updatedPart;
      }
      else if (numberAttributesInOldQuery > 0) {
        if (attributeName === 'm') {
          newQueryAttributes.splice(0, 0, updatedPart);
        }
        else if (attributeName === 'i') {
            newQueryAttributes.splice(1, 0, updatedPart);
            console.log('newQueryAttributes when i is given', newQueryAttributes);
        }
        else {
          newQueryAttributes.push(updatedPart)
        }
      }

    }

    else {
        // attributePart is in oldQuery
        // then find its index and update it
        if (updatedPart === 's') {
          newQueryAttributes.splice(indexAttributePart, 1)
        }
        //const attributeIndex = arrayAttributes.findIndex((element) => element.includes(attributeName) );
        else {
          newQueryAttributes[indexAttributePart] = updatedPart;
        }
        
    }
    if (newQueryValue === '') newQueryValue = newQueryAttributes.join('_');
    await this.pushQuery(newQueryValue);

  }

  async updatePanels(activeViews) {
    let oldQueryValue = this.getQuery();
    const [ arrayAttributes, indexPanelsPart] = this.getSettingFromQuery(oldQueryValue, 'p');
    let newQueryValue = '';
    const panels = Object.keys(activeViews).map((panelIndex) => `${panelIndex}.${activeViews[panelIndex]}`).join('-');
    const updatedPanelsPart = 'p'+ panels;

    this.updateQueryFinal(updatedPanelsPart);

    /*

    if (oldQueryValue.includes('p') === false) { 
      newQueryValue = oldQueryValue.concat('_'+'p'+panels);
    }
    else {
      newQueryValue = arrayAttributes.slice(0,indexPanelsPart).join('_').concat('_'+updatedPanelsPart); // joining part before panels with the updatedPanels part
      const showPart = arrayAttributes.slice(indexPanelsPart+1);
      if (showPart.length > 0) {  // if have 's' containing [1: n_panels-1], then concatenate the show part
        newQueryValue = newQueryValue.concat('_'+showPart);
      }  
    }
    
    await this.pushQuery(newQueryValue);

    */
  }

  async updateShow(panelIndexes = []) {
    // TODO: $route doesn't update quick enough, in future we have to switch to Composition APIs useRoute()
    await delay(300);

    let oldQueryValue = this.getQuery();
    let newQueryValue = '';
    const [arrayAttributes, indexShowPart] = this.getSettingFromQuery(oldQueryValue, 's');
    console.log('Panel indexes in updateShow()', panelIndexes);
    const updatedShowPart = 's'+ panelIndexes.join('-'); 
    this.updateQueryFinal(updatedShowPart);

    /*
    if (panelIndexes.length > 0) { 
      panelIndexes = panelIndexes.join('-');
      if (oldQueryValue.includes('s') === false) {
        newQueryValue = oldQueryValue.concat('_'+'s'+panelIndexes);
      }
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

    */
  }


  async updateItem(itemIndex, resultConfig) {
    const oldQueryValue = this.getQuery();
    const [arrayAttributes, indexItemPart] = this.getSettingFromQuery(oldQueryValue, 'i');
    const updatedItemPart = 'i'+ itemIndex.toString();

    this.updateQueryFinal(updatedItemPart);
    /*
    let newQueryValue = '';
    let partAfterItem = '';

    if (oldQueryValue === '' || (oldQueryValue.includes('i') === true && arrayAttributes.length === 1)) {
      newQueryValue = updatedItemPart;
    }
    else if (arrayAttributes.length === 1 && oldQueryValue.includes('m') === true) { 
      newQueryValue = arrayAttributes[0].concat('_', updatedItemPart);
    }
    else {
      if (indexItemPart !== -1) {
        // Option 1: manifest, item part, rest part
        // Option 2: item part, rest part
        // Option 3: manifest, item part
        partAfterItem = oldQueryValue.split('_').slice(indexItemPart + 1).join('_');
        if (partAfterItem !== '') {
          if (oldQueryValue.includes('m') === true) newQueryValue = arrayAttributes[0].concat('_', updatedItemPart, '_', partAfterItem);
          else {
          newQueryValue = updatedItemPart.concat('_', partAfterItem);
         }
        }
        else {
          newQueryValue = arrayAttributes[0].concat('_', updatedItemPart);
        }
      }
      else {
        // Only option: Manifest part, rest part 
        partAfterItem = oldQueryValue.split('_').slice(1).join('_');
        newQueryValue = arrayAttributes[0].concat('_', partAfterItem);
      }
    }   
    await this.pushQuery(newQueryValue);

    */
  }

  
  async updateManifest (manifestIndex, resultConfig) {
    const oldQueryValue = this.getQuery();
    const arrayAttributes = oldQueryValue.split('_');
    const updatedManifestPart = 'm'+ manifestIndex.toString();
    let newQueryValue = '';
    this.updateQueryFinal(updatedManifestPart);

    /*

    if (oldQueryValue === '' || (oldQueryValue.includes('m') === true && arrayAttributes.length === 1)) {
      newQueryValue = updatedManifestPart;
    }
    else if (oldQueryValue.includes('m') === true) {
      if (arrayAttributes.length > 1)  {
        newQueryValue = updatedManifestPart.concat('_'+oldQueryValue.split('_').slice(1).join('_'));  // concatenate partAfterManifest to the new manifestPart
      }
    }
    else if (oldQueryValue.includes('m') === false) {  // if there is a collection in config and there is no 'm' in URL, then add 'm' in URL 
      if ('collection' in resultConfig && resultConfig.collection !== '') {
          newQueryValue = updatedManifestPart.concat('_',oldQueryValue);  
        }
      else {
        newQueryValue = oldQueryValue;  // if there is a manifest in config, we don't add the manifestPart
      }
    }  
    await this.pushQuery(newQueryValue);

    */
  }

  async updateQuery(query, resultConfig) {
    for(const key of Object.keys(query)) {
      if (key === 'i') {
        this.updateItem(query[key], resultConfig);
      }
      if (key === 'm') {
        this.updateManifest(query[key], resultConfig);
      }
    }
  }

  getQuery() {
    let queryString = window.location.search.substring(1);
    if (queryString !== '') {
      queryString = queryString.split('=')[1];
    }
    return queryString;
  }

   getSettingFromQuery (oldQueryValue, attributeName) {
    const arrayAttributes = oldQueryValue !== '' ? oldQueryValue.split('_') : [];
    const attributePart = arrayAttributes.findIndex((element) => element.includes(attributeName) );
    return [arrayAttributes, attributePart];
  }
}

 

export default new BookmarkService();