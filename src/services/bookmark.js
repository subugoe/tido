class BookmarkService {
  $router;
  $route;

  initRouter(router, route) {
    this.$router = router;
    this.$route = route;
  }

  async updatePanels(activeViews) {
    const panels = activeViews.map((view, i) => `${i}_${view}`).join(',');
    const query = {...this.$route.query, panels };

    await this.$router.push({path: '/', query});
  }


  static getConnectorObject = (query) => {
    const connector = (query.connector || '')
      .split(',')
      .filter((el) => el)
      .reduce((prev, curr) => {
        const [panelIndex, connectorIndex] = curr.split('_');
        prev[panelIndex] = connectorIndex;
        return prev;
      }, {});

    return connector;
  };

  async updateItemQuery(item) {
    const query = {
      ...this.$route.query,
      ...(item ? {item} : {})
    };

    await this.$router.push({path: '/', query});
  }

  getQuery() {
    return this.$route.query;
  }
}

export default new BookmarkService();
