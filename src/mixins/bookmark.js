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
  },
  methods: {
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
  },
};
