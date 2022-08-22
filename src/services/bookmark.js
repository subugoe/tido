import * as AnnotationUtils from '@/utils/annotations';

class BookmarkService {
  $router;

  query;

  initRouter(router) {
    this.$router = router;
  }

  syncQuery(query) {
    this.query = query;
  }

  handleAnnotationTabChange = (key, index) => {
    const query = { ...this.query };

    if (index) {
      query.annotation = index;
    } else {
      delete query.annotation;
    }

    this.$router.push({ path: '/', query });
  };

  handleActiveContentChange = (index) => {
    const query = { ...this.query };
    if (index) {
      query.text = index;
    } else {
      delete query.text;
    }
    this.$router.push({ path: '/', query });
  };

  handleContentItemDataChange = (isManifestChanged, previousManifest) => {
    const tabs = AnnotationUtils.getAnnotationTabs(this.config);
    let contentIndex = Number(this.query.text ?? '0');

    if (!previousManifest) {
      const annotation = this.query.annotation || 0;

      this.$store.dispatch(
        'annotations/updateActiveTab',
        tabs?.[annotation].key,
        {
          root: true,
        },
      );
    } else if (isManifestChanged) {
      this.$store.dispatch('annotations/updateActiveTab', tabs?.[0].key, {
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

  handleContentMetadataTabChange = (value, index) => {
    const tabIndex = Number(value.replace('tab', ''));
    if (Number.isNaN(tabIndex)) {
      return;
    }

    const query = { ...this.query };
    const connectors = this.getConnectorObject(this.query);

    if (tabIndex === 0) {
      delete connectors[tabIndex];
    } else {
      connectors[index] = tabIndex;
    }

    const connectorQuery = this.getConnectorString(connectors);
    if (!connectorQuery) {
      delete query.connector;
    } else {
      query.connector = connectorQuery;
    }

    this.$router.push({ path: '/', query });
  };

  handlePanelToggle = (panels) => {
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

  getConnectorObject = (query) => {
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

  getConnectorString(connector) {
    const connectorString = Object.entries(connector || {})
      .map(([key, value]) => `${key}_${value}`)
      .join(',');

    return connectorString;
  }

  getConnectorValue = (index) => {
    const connectors = this.getConnectorObject({
      connector: this.query.connector,
    });
    return connectors[index] ? `tab${connectors[index]}` : 'tab0';
  };
}

export default new BookmarkService();
