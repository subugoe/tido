import * as AnnotationUtils from '@/utils/annotations';
import { useRoute } from "vue-router";

class BookmarkService {
  $router;

  $route;

  $store;

  query;

  panel;

  initRouter(router, route) {
    this.$router = router;
    this.$route = route;
  }

  initStore(store) {
    this.$store = store;
  }

  syncQuery(query) {
    this.query = query;

    if (this.$store) {
      this.handleConnectorUpdate(query);
      this.checkForPanelUpdate(query);
    }
  }

  checkForPanelUpdate = (query) => {
    if (this.panel !== query.panels) {
      this.setPanelsFromQuery(query.panels);
    }
  };

  getConnectorValue = (index) => {
    const connectors = BookmarkService.getConnectorObject({
      connector: this.query.connector,
    });
    return connectors[index] ? `tab${connectors[index]}` : 'tab0';
  };

  handleConnectorUpdate = (query) => {
    const connectors = BookmarkService.getConnectorObject({
      connector: query.connector,
    });
    const values = [];
    Object.entries(connectors).forEach(([index, value]) => {
      values[index] = `tab${value}`;
    });
    this.$store.dispatch('contents/setConnectors', values);
  };

  setAnnotationTabFromQuery() {
    const config = this.$store.getters['config/config'];
    const tabs = AnnotationUtils.getAnnotationTabs(config);
    const annotation = this.query.annotation || 0;

    this.$store.dispatch(
      'annotations/updateActiveTab',
      {tab: tabs?.[annotation].key, index: annotation},
      {
        root: true,
      },
    );
  }

  setContentTabFromQuery() {
    this.$store.dispatch('contents/setContentIndex', Number(this.query.text ?? '0'));
  }

  setDefaultContentAndAnnotationTabs() {
    const config = this.$store.getters['config/config'];
    const tabs = AnnotationUtils.getAnnotationTabs(config);
    this.$store.dispatch('annotations/updateActiveTab', {tab: tabs?.[0].key, index: 0}, {
      root: true,
    });
    this.$store.dispatch('contents/setContentIndex', 0);
  }

  setDefaultContentAndAnnotationQuery() {
    const query = {...this.query};
    delete query.annotation;
    delete query.text;
    this.$router.push({path: '/', query});
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

  static getConnectorString(connector) {
    const connectorString = Object.entries(connector || {})
      .map(([key, value]) => `${key}_${value}`)
      .join(',');

    return connectorString;
  }

  setPanelsFromQuery = (panels) => {
    const values = panels;
    const storePanels = [...this.$store.getters['contents/panels']];

    this.panel = panels;

    if (!values) {
      return this.$store.dispatch(
        'contents/setPanels',
        storePanels.map((el) => ({...el, show: true})),
      );
    }

    const indexes = values.split(',');
    return this.$store.dispatch(
      'contents/setPanels',
      storePanels.map((el, index) => ({
        ...el,
        show: indexes.includes(String(index)),
      })),
    );
  };

  updateAnnotationQuery = (index) => {
    const query = {...this.query};

    if (index) {
      query.annotation = index;
    } else {
      delete query.annotation;
    }

    this.$router.push({path: '/', query});
  };

  updateConnectorQuery = (value, panelIndex) => {
    const tabIndex = Number(value.replace('tab', ''));
    if (Number.isNaN(tabIndex)) {
      return;
    }

    const query = {...this.query};
    const connectors = BookmarkService.getConnectorObject(this.query);

    if (tabIndex === 0) {
      delete connectors[tabIndex];
    } else {
      connectors[panelIndex] = tabIndex;
    }

    const connectorQuery = BookmarkService.getConnectorString(connectors);
    if (!connectorQuery) {
      delete query.connector;
    } else {
      query.connector = connectorQuery;
    }

    this.$router.push({path: '/', query});
  };

  updatePanelsQuery = (panels) => {
    const displayedPanels = panels.filter((el) => el.show);
    const query = {...this.query};
    if (
      displayedPanels.length === panels.length
      || displayedPanels.length === 0
    ) {
      delete query.panels;
    } else {
      const indexes = displayedPanels.map((el) => panels.findIndex((panel) => panel.id === el.id));
      query.panels = indexes.join(',');
    }
    this.$router.push({path: '/', query});
  };

  updateTextQuery = (index) => {
    const query = {...this.query};
    if (index) {
      query.text = index;
    } else {
      delete query.text;
    }
    this.$router.push({path: '/', query});
  };

  updateItemQuery(item) {
    const query = {
      ...this.query,
      ...(item ? {item} : {})
    };

    this.$router.push({path: '/', query});
  }

  getQuery() {
    return this.$route.query;
  }
}

export default new BookmarkService();
