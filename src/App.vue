<template>
  <q-layout class="root viewport" view="hHh Lpr fFf">
    <Header v-if="!isLoading && item && config['header_section'].show" />
    <Header v-else />
    <q-page-container v-if="ready" class="root">
      <router-view />
    </q-page-container>

    <q-page-container v-else class="error-container">
      <Loading v-if="isLoading" />
      <Notification
        v-else
        :message="errorMessage"
        :title="errorTitle"
        class="q-ma-md-xl"
        type="warning"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
import {setCssVar} from 'quasar';
import Header from '@/components/Header.vue';
import Notification from '@/components/Notification.vue';
import BookmarkService from './services/bookmark';
import Loading from '@/components/Loading.vue';

export default {
  name: 'TIDO',
  components: {
    Header,
    Notification,
    Loading
  },
  data() {
    return {
      errorTitle: '',
      errorMessage: '',
      isLoading: false
    }
  },
  computed: {
    ready() {
      const { collection: collectionUrl, manifest: manifestUrl } = this.config;

      if (!this.item) {
        return false;
      }

      if (collectionUrl) {
        return this.manifests.length > 0 && !!(this.collection) && !!(this.manifest);
      }

      if (manifestUrl) {
        return !!(this.manifest);
      }
    },
    annotations() {
      console.log(this.$store.getters['annotations/annotations']);
      return this.$store.getters['annotations/annotations'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    collection() {
      return this.$store.getters['contents/collection'];
    },
    item() {
      return this.$store.getters['contents/item'];
    },
    manifest() {
      return this.$store.getters['contents/manifest'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
  },
  async mounted() {
    this.isLoading = true;
    await this.$router.isReady();

    this.$q.dark.set('auto');
    this.$i18n.locale = this.config.lang;

    BookmarkService.initRouter(this.$router, this.$route);

    await this.loadConfig();
    await this.init();


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
    async getCollection(url) {
      console.log('getCollection')
      await this.$store.dispatch('contents/initCollection', url);
    },
    async loadConfig() {
      try {
        await this.$store.dispatch('config/load');
      } catch ({ title, message }) {
        this.errorTitle = title;
        this.errorMessage = message;
      }
    },
    async getManifest(url) {
      console.log('getManifest')
      await this.$store.dispatch('contents/initManifest', url);
    },
    async getItem(url) {
      console.log('getItem')
      await this.$store.dispatch('contents/initItem', url);
    },
    async init() {
      const { collection, manifest, item } = this.config;

      try {
        // We want to preload all required data that the components need.
        // Initialize priority:
        // We always load the item first as here is the main data that we want to display.
        if (item) {
          await this.getItem(item);
        }

        // After that we load additionally the parent objects.
        // If a collection is given we ignore the manifest setting
        // and try to figure out the correct manifest by searching for the above item.
        // Otherwise no collection is given but a single manifest instead, so we load that manifest.
        if (collection) {
          await this.getCollection(collection);
        } else if (manifest) {
          await this.getManifest(manifest)
        }
      } catch (e) {
        this.isLoading = false;
        this.errorTitle = 'title';
        this.errorMessage = 'message';
      }

    },
    isReady() {
      return this.item && this.manifests;
    },

    onItemUrlChange(val) {
      if (val) {
        this.isLoading = false;
      }
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
.error-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  align-items: center;
}
</style>
