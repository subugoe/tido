<template>
  <q-layout
    class="root viewport"
    view="hHh Lpr fFf"
  >
    <Header v-if="isConfigValid && config['header_section'].show" />

    <q-page-container
      v-if="isConfigValid"
      class="root"
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { colors } from 'quasar';
import Header from '@/components/Header.vue';
import Navigation from '@/mixins/navigation';
import * as PanelUtils from '@/utils/panels';

export default {
  name: 'TIDO',
  components: {
    Header,
  },
  mixins: [Navigation],
  computed: {
    annotations() {
      return this.$store.getters['annotations/annotations'];
    },
    collectionTitle() {
      return this.$store.getters['contents/collectionTitle'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    configErrorMessage() {
      return this.$store.getters['config/configErrorMessage'];
    },
    contentTypes() {
      return this.$store.getters['contents/contentTypes'];
    },
    contentUrls() {
      return this.$store.getters['contents/contentUrls'];
    },
    errorText() {
      return this.$store.getters['contents/errorText'];
    },
    item() {
      return this.$store.getters['contents/item'];
    },
    itemUrl() {
      return this.$store.getters['contents/itemUrl'];
    },
    itemUrls() {
      return this.$store.getters['contents/itemUrls'];
    },
    isConfigValid() {
      return this.$store.getters['config/isConfigValid'];
    },
    loaded() {
      return this.$store.getters['config/initialized'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    selectedManifest() {
      return this.$store.getters['contents/selectedManifest'];
    },
    tree() {
      return this.$store.getters['contents/tree'];
    },
    panels() {
      return this.$store.getters['contents/panels'];
    },
  },
  watch: {
    '$route.query': {
      handler: 'onRouteQueryChange',
      immediate: true,
    },
    itemUrl: {
      handler: 'onItemUrlChange',
      immediate: true,
    },
    manifests: {
      handler: 'onManifestsChange',
      immediate: true,
    },
  },
  async created() {
    const isValid = await this.loadConfig();

    if (!isValid) {
      return;
    }
    this.init();

    this.$q.dark.set('auto');

    if (
      this.config.colors.primary
      && this.config.colors.secondary
      && this.config.colors.accent
    ) {
      colors.setBrand('primary', this.config.colors.primary);
      colors.setBrand('secondary', this.config.colors.secondary);
      colors.setBrand('accent', this.config.colors.accent);
    }
  },
  mounted() {
    this.$i18n.locale = this.config.lang;
  },
  methods: {
    /**
     * get collection data according to 'entrypoint'
     * (number of requests equal the number of manifests contained within a collection)
     * initialize the tree's root node
     * caller: *init()*
     *
     * @param string url
     */
    async getCollection(url) {
      this.$store.dispatch('contents/initCollection', url);
    },
    async loadConfig() {
      return this.$store.dispatch('config/loadConfig');
    },
    /**
     * fetch all data provided on 'item level'
     * caller: *mounted-hook*, *getManifest()*
     *
     * @param string url
     */

    async getContentsItemData(url) {
      const { isManifestChanged } = await this.$store.dispatch(
        'contents/initContentItem',
        url,
      );
      if (isManifestChanged) {
        this.$store.dispatch('contents/setPanels', PanelUtils.getNewPanels(this.panels));
        this.$store.dispatch('contents/setContentIndex', 0);
      }
    },

    async getImageItemData(url) {
      this.$store.dispatch('contents/initImageData', url);
    },
    getManifest(url) {
      this.$store.dispatch('contents/initManifest', url);
    },
    /**
     * decide whether to start with a collection or a single manifest
     * caller: *created-hook*
     *
     * @return function getCollection() | getManifest()
     */
    init() {
      this.$store.dispatch('contents/initPanels');
      return this.config.entrypoint.match(/collection.json\s?$/)
        ? this.getCollection(this.config.entrypoint)
        : this.getManifest(this.config.entrypoint);
    },

    onItemUrlChange(val) {
      if (!this.itemUrl) {
        return;
      }
      const treeDom = document.getElementById(val);

      if (treeDom) {
        treeDom.scrollIntoView({ block: 'center' });
      }

      this.getContentsItemData(this.itemUrl);
      this.getImageItemData(this.itemUrl);
    },
    onManifestsChange() {
      const { itemurl } = this.$route.query;
      if (!itemurl && this.manifests?.[0]?.sequence?.[0]?.id) {
        this.navigate(this.manifests?.[0]?.sequence?.[0]?.id);
      }
    },

    onRouteQueryChange() {
      if (this.loaded) {
        return;
      }

      const { itemurl } = this.$route.query;

      if (!itemurl) {
        return;
      }

      this.$store.dispatch('contents/setItemUrl', decodeURIComponent(itemurl));
      this.$store.dispatch('config/setInitialized', { initialized: true });
    },
  },
};
</script>

<style scoped lang="scss">
.root {
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 16px;
  overflow: hidden;
}

.viewport {
  height: 100vh;
  @media (max-width: $breakpoint-sm-custom-md) {
    height: auto;
    overflow: scroll;
  }
}
</style>
