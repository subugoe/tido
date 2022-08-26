import * as AnnotationUtils from '@/utils/annotations';

class BookmarkService {
  $router;

  $store;

  query;

  panel;

  initRouter(router) {
    this.$router = router;
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

  handleContentItemDataChange = (isManifestChanged, previousManifest) => {
    const config = this.$store.getters['config/config'];
    const tabs = AnnotationUtils.getAnnotationTabs(config);
    let contentIndex = Number(this.query.text ?? '0');

    if (!previousManifest) {
      const annotation = this.query.annotation || 0;

      this.$store.dispatch(
        'annotations/updateActiveTab',
        { tab: tabs?.[annotation].key, index: annotation },
        {
          root: true,
        },
      );
    } else if (isManifestChanged) {
      this.$store.dispatch('annotations/updateActiveTab', { tab: tabs?.[0].key, index: 0 }, {
        root: true,
      });
      const query = { ...this.query };
      delete query.annotation;
      delete query.text;
      contentIndex = 0;
      this.$router.push({ path: '/', query });
    }

    return contentIndex;
  };

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
        storePanels.map((el) => ({ ...el, show: true })),
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

  updateAnnotationQuery = (key, index) => {
    const query = { ...this.query };

    if (index) {
      query.annotation = index;
    } else {
      delete query.annotation;
    }

    this.$router.push({ path: '/', query });
  };

  updateConnectorQuery = (value, index) => {
    const tabIndex = Number(value.replace('tab', ''));
    if (Number.isNaN(tabIndex)) {
      return;
    }

    const query = { ...this.query };
    const connectors = BookmarkService.getConnectorObject(this.query);

    if (tabIndex === 0) {
      delete connectors[tabIndex];
    } else {
      connectors[index] = tabIndex;
    }

    const connectorQuery = BookmarkService.getConnectorString(connectors);
    if (!connectorQuery) {
      delete query.connector;
    } else {
      query.connector = connectorQuery;
    }

    this.$router.push({ path: '/', query });
  };

  updatePanelsQuery = (panels) => {
    const displayedPanels = panels.filter((el) => el.show);
    const query = { ...this.query };
    if (
      displayedPanels.length === panels.length
      || displayedPanels.length === 0
    ) {
      delete query.panels;
    } else {
      const indexes = displayedPanels.map((el) => panels.findIndex((panel) => panel.id === el.id));
      query.panels = indexes.join(',');
    }
    this.$router.push({ path: '/', query });
  };

  updateTextQuery = (index) => {
    const query = { ...this.query };
    if (index) {
      query.text = index;
    } else {
      delete query.text;
    }
    this.$router.push({ path: '/', query });
  };
}

export default new BookmarkService();
