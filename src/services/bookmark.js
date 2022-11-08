import { delay } from 'src/utils';

class BookmarkService {
  $router;

  initRouter(router) {
    this.$router = router;
  }

  async updatePanels(activeViews) {
    const panels = activeViews.map((view, i) => `${i}_${view}`).join(',');
    const query = { ...this.getQuery(), panels };

    await this.$router.push({ path: '/', query });
  }

  async updateShow(panelIndexes) {
    await delay(300); // TODO: $route doesn't update quick enough, we have to siwtch to Composition APIs useRoute()
    const query = { ...this.getQuery(), show: panelIndexes.join(',') };
    await this.$router.push({ path: '/', query });
  }

  async updateItemQuery(item) {
    const query = {
      ...this.getQuery(),
      ...(item ? { item } : {}),
    };

    await this.$router.push({ path: '/', query });
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
