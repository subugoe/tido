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

    console.log(query)

    await this.$router.push({path: '/', query});
  }

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
