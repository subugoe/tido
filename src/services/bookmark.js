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
      if (numberAttributesInOldQuery === 0) {
        // attribute is not in oldQuery, then we need to add it
        newQueryValue = updatedPart;
      }
      else if (numberAttributesInOldQuery > 0) {
        if (attributeName === 'm') {
          // if 'm' is not in oldQuery, then we add it in the beginning of oldQuery
          newQueryAttributes.splice(0, 0, updatedPart); 
        }
        else if (attributeName === 'i') {
          // if 'i' is not in oldQuery, then we add it in the 2nd position of oldQuery (i.e after 'm' part)
            newQueryAttributes.splice(1, 0, updatedPart);
        }
        else {
          // when the updatedPart name is 's' or 'p', then for sure we have 'm' or 'i' before that. Therefore we just append it.
          newQueryAttributes.push(updatedPart)
        }
      }
    }
    else {
        if (updatedPart === 's') {
          // if all the panels are opened, then we remove the 's' part from URL
          newQueryAttributes.splice(indexAttributePart, 1)
        }
        else {
          newQueryAttributes[indexAttributePart] = updatedPart;
        }  
    }
    if (newQueryValue === '') newQueryValue = newQueryAttributes.join('_');
    await this.pushQuery(newQueryValue);
  }

  async updatePanels(activeViews) {
    const panels = Object.keys(activeViews).map((panelIndex) => `${panelIndex}.${activeViews[panelIndex]}`).join('-');
    const updatedPanelsPart = 'p'+ panels;
    this.updateQueryFinal(updatedPanelsPart);
  }

  async updateShow(panelIndexes = []) {
    // TODO: $route doesn't update quick enough, in future we have to switch to Composition APIs useRoute()
    await delay(300);
    const updatedShowPart = 's'+ panelIndexes.join('-'); 
    this.updateQueryFinal(updatedShowPart);
  }

  async updateItem(itemIndex) {
    const updatedItemPart = 'i'+ itemIndex.toString();
    this.updateQueryFinal(updatedItemPart);
  }

  async updateManifest (manifestIndex) {
    const updatedManifestPart = 'm'+ manifestIndex.toString();
    this.updateQueryFinal(updatedManifestPart);
  }

  async updateQuery(query, resultConfig) {
    for(const key of Object.keys(query)) {
      if (key === 'i') {
        this.updateItem(query[key]);
      }
      if (key === 'm') {
        this.updateManifest(query[key]);
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