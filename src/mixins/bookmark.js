import * as AnnotationUtils from '@/utils/annotations';

export default {
  data: () => ({ connectorValue: '' }),
  computed: {
    activeContentUrl() {
      return this.contentUrls[this.contentIndex];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    connector() {
      return this.$route.query.connector;
    },
    contentIndex() {
      return this.$store.getters['contents/contentIndex'];
    },
    queryPanels() {
      return this.$route.query.panels;
    },
    storePanels() {
      return this.$store.getters['contents/panels'];
    },
  },
  watch: {
    queryPanels: 'onQueryPanelUpdate',
    connector: {
      handler: 'onConnectorsUpdate',
      immediate: true,
    },
  },
  methods: {
    onActiveContentChange(index) {
      const query = { ...this.$route.query };
      if (index) {
        query.text = index;
      } else {
        delete query.text;
      }
      this.$router.push({ path: '/', query });
    },
    onContentItemDataChange(isManifestChanged, previousManifest) {
      const tabs = AnnotationUtils.getAnnotationTabs(this.config);
      let contentIndex = Number(this.$route.query.text ?? '0');

      if (!previousManifest) {
        const annotation = this.$route.query.annotation || 0;

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
        const query = { ...this.$route.query };
        delete query.annotation;
        delete query.text;
        contentIndex = 0;
        this.$router.push({ path: '/', query });
      }

      return contentIndex;
    },
    onPanelUpdate(panels) {
      const displayedPanels = panels.filter((el) => el.show);
      const query = { ...this.$route.query };
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
    },
    onQueryPanelUpdate(values) {
      if (!values) {
        return this.$store.dispatch(
          'contents/setPanels',
          [...this.storePanels].map((el) => ({ ...el, show: true })),
        );
      }
      const indexes = values.split(',');
      return this.$store.dispatch(
        'contents/setPanels',
        [...this.storePanels].map((el, index) => ({
          ...el,
          show: indexes.includes(String(index)),
        })),
      );
    },
    onTabChange(value) {
      const tabIndex = Number(value.replace('tab', ''));
      if (Number.isNaN(tabIndex)) {
        return;
      }
      const query = { ...this.$route.query };
      const connectors = this.toConnectorObject(this.$route.query);
      if (tabIndex === 0) {
        delete connectors[tabIndex];
      } else {
        connectors[this.index] = tabIndex;
      }

      const connectorQuery = this.toConnectorString(connectors);
      if (!connectorQuery) {
        delete query.connector;
      } else {
        query.connector = connectorQuery;
      }
      this.$router.push({ path: '/', query });
    },
    toConnectorObject(query) {
      const connector = (query.connector || '')
        .split(',')
        .filter((el) => el)
        .reduce((prev, curr) => {
          const [panelIndex, connectorIndex] = curr.split('_');
          prev[panelIndex] = connectorIndex;
          return prev;
        }, {});

      return connector;
    },
    toConnectorString(connector) {
      return Object.entries(connector || {})
        .map(([key, value]) => `${key}_${value}`)
        .join(',');
    },
    onConnectorsUpdate(value) {
      const connectors = this.toConnectorObject({ connector: value });
      if (connectors[this.index]) {
        this.connectorValue = `tab${connectors[this.index]}`;
      } else {
        this.connectorValue = 'tab0';
      }
    },
  },
};
