import { delay } from 'src/utils';

class BookmarkService {
  $router;

  initRouter(router) {
    this.$router = router;
  }

  async updatePanels(activeViews) {
    const panels = activeViews.map((view, i) => `${i}_${view}`).join(',');
    const query = { ...this.getQuery(), panels };

    await this.$router.replace({ query });
  }

  async updateShow(panelIndexes = []) {
    // TODO: $route doesn't update quick enough, in future we have to switch to Composition APIs useRoute()
    await delay(300);

    const oldQuery = this.getQuery();
    let query = {};

    // Does not append (= removes) the "show" param from URL if panelIndexes empty.
    if (panelIndexes.length > 0) {
      query = { ...this.getQuery(), show: panelIndexes.join(',') };
    } else {
      if (oldQuery.show) delete oldQuery.show;
      query = oldQuery;
    }

    await this.$router.replace({ query });
  }

  async updateItemQuery(item) {
    const query = {
      ...this.getQuery(),
      ...(item ? { item } : {}),
    };

    await this.$router.replace({ query });
  }

  getQuery() {
    const queryString = window.location.search.substring(1);
    return queryString.split('&').reduce((acc, cur) => {
      const [key, value] = cur.split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {});
  }
}

export default new BookmarkService();
