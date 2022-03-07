<template>
  <q-layout
    id="q-app"
    class="root viewport"
    view="hHh Lpr fFf"
  >
    <Header
      v-if="config['header_section'].show"
      :panels="panels"
    />

    <q-page-container class="root">
      <router-view
        :contentindex="contentindex"
        :oncontentindexchange="oncontentindexchange"
        :panels="panels"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import { colors } from 'quasar';
import Header from '@/components/Header.vue';
import Panels from '@/mixins/panels';
import Navigation from '@/mixins/navigation';

export default {
  name: 'TIDO',
  components: {
    Header,
  },
  mixins: [Panels, Navigation],
  data() {
    return {
      contentindex: 0,
    };
  },
  computed: {
    annotations() {
      return this.$store.getters['annotations/annotations'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    collectionTitle() {
      return this.$store.getters['contents/collectionTitle'];
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
  },
  watch: {
    '$route.query': {
      handler: 'onQueryChange',
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
  created() {
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
    this.$root.$on('panels-position', (newPanels) => {
      this.panels = newPanels;
    });
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
    loadConfig() {
      this.$store.dispatch('config/loadConfig');
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
        this.$root.$emit('manifest-changed');
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
      this.loadConfig();
      return this.config.entrypoint.match(/collection.json\s?$/)
        ? this.getCollection(this.config.entrypoint)
        : this.getManifest(this.config.entrypoint);
    },

    oncontentindexchange(index) {
      this.contentindex = index;
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

    onQueryChange() {
      if (this.loaded) {
        return;
      }

      const { itemurl } = this.$route.query;

      if (!itemurl) {
        return;
      }

      this.itemurl = decodeURIComponent(itemurl);

      this.$store.dispatch(
        'contents/updateItemUrl',
        decodeURIComponent(itemurl),
      );
      this.$store.dispatch('config/updateInitialized', { initialized: true });
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
