<template>
  <q-layout
    class="root viewport"
    view="hHh Lpr fFf"
  >
    <Header v-if="isConfigValid && config['header_section'].show" />

    <Header v-else :config-error-title="configErrorTitle" />

    <q-page-container
      v-if="isConfigValid"
      class="root"
    >
      <router-view />
    </q-page-container>

    <q-page-container v-else class="config-error-container">
      <Notification
        :message="$t(configErrorMessage)"
        :notification-colors="config.notificationColors"
        :title-key="$t(configErrorTitle)"
        class="q-ma-md-xl"
        type="warning"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import { setCssVar } from 'quasar';
import Header from '@/components/Header.vue';
import Navigation from '@/mixins/navigation';
import Notification from '@/components/Notification.vue';


export default {
  name: 'TIDO',
  components: {
    Header,
    Notification,
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
    configErrorTitle() {
      return this.$store.getters['config/configErrorTitle'];
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

    this.$q.dark.set('auto');

    if (!isValid) {
      return;
    }
    await this.init();

    await this.loadConfig();

    if (this.config?.colors?.primary) {
      setCssVar('primary', this.config.colors.primary);
    }

    if (this.config?.colors?.secondary) {
      setCssVar('secondary', this.config.colors.secondary);
    }

    if (this.config?.colors?.accent) {
      setCssVar('accent', this.config.colors.accent);
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
      await this.$store.dispatch('contents/initCollection', url);
    },
    async loadConfig() {
      return this.$store.dispatch('config/loadConfig');
    },
    async getManifest(url) {
      await this.$store.dispatch('contents/initManifest', url);
    },
    /**
     * decide whether to start with a collection or a single manifest
     * caller: *created-hook*
     *
     * @return function getCollection() | getManifest()
     */
    async init() {
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
.config-error-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  align-items: center;
}
</style>
