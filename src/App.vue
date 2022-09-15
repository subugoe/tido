<template>
  <q-layout
    class="root viewport"
    view="hHh Lpr fFf"
  >
    <Header v-if="itemLoaded && config['header_section'].show" />

<!--    <Header v-else :config-error-title="configErrorTitle" />-->

    <q-page-container
      v-if="itemLoaded"
      class="root"
    >
      <router-view />
    </q-page-container>

    <q-page-container v-else class="config-error-container">
      yo
<!--      <Notification-->
<!--        :message="$t(configErrorMessage)"-->
<!--        :notification-colors="config.notificationColors"-->
<!--        :title-key="$t(configErrorTitle)"-->
<!--        class="q-ma-md-xl"-->
<!--        type="warning"-->
<!--      />-->
    </q-page-container>
  </q-layout>
</template>

<script>
import { setCssVar } from 'quasar';
import Header from '@/components/Header.vue';
import Navigation from '@/mixins/navigation';
import Notification from '@/components/Notification.vue';
import BookmarkService from './services/bookmark';

export default {
  name: 'TIDO',
  components: {
    Header,
    Notification,
  },
  mixins: [Navigation],
  data() {
    return {
      loaded: false
    }
  },
  computed: {
    itemLoaded() {
      return this.$store.getters['contents/item'];
    },
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
    manifest() {
      return this.$store.getters['contents/manifest'];
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
    manifest: {
      handler: 'onManifestChange',
    },
  },
  async mounted() {
    await this.$router.isReady();
    BookmarkService.initRouter(this.$router, this.$route);
    BookmarkService.initStore(this.$store);

    await this.loadConfig();
    await this.init();


    this.$q.dark.set('auto');
    this.$i18n.locale = this.config.lang;

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
      console.log('getCollection')
      await this.$store.dispatch('contents/initCollection', url);
    },
    async loadConfig() {
      return this.$store.dispatch('config/load');
    },
    async getManifest(url) {
      console.log('getManifest')
      await this.$store.dispatch('contents/initManifest', url);
    },
    async getItem(url) {
      console.log('getItem')
      await this.$store.dispatch('contents/initItem', url);
    },
    /**
     * decide whether to start with a collection or a single manifest
     * caller: *created-hook*
     *
     * @return function getCollection() | getManifest()
     */
    async init() {
      const { collection, manifest, item } = this.config;
      if (collection) {
        this.getCollection(collection);
      } else if (manifest) {
        this.getManifest(manifest)
      } else if (item) {
        this.getItem(item);
      }
    },

    onItemUrlChange(val) {
      // if (!this.itemUrl) {
      //   return;
      // }
      // const treeDom = document.getElementById(val);
      //
      // if (treeDom) {
      //   treeDom.scrollIntoView({ block: 'center' });
      // }
    },
    onManifestChange() {
      console.log('onManifestsChange');
      const { item } = this.config;

      let sequenceIndex = 0;
      if (item) {
        const index = this.manifest.sequence.findIndex(sequenceItem => sequenceItem.id === item);
        if (index > -1) {
          sequenceIndex = index;
        }
      }

      console.log('sequenceIndex', sequenceIndex);

      this.getItem(this.manifest.sequence[sequenceIndex].id);
    },

    onRouteQueryChange() {
      console.log('onRouteQueryChange')
      BookmarkService.syncQuery(this.$route.query);

      // if (this.loaded) {
      //   return;
      // }
      //
      // const { itemurl } = this.$route.query;
      //
      // if (!itemurl) {
      //   return;
      // }
      //
      // this.$store.dispatch('contents/setItemUrl', decodeURIComponent(itemurl));
      // this.loaded = true;
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
