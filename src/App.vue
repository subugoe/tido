<template>
  <q-layout class="root viewport" view="hHh Lpr fFf" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'">
    <Header/>
    <q-page-container v-if="ready" class="root">
      <router-view/>
    </q-page-container>

    <q-page-container v-else class="error-container q-pa-lg q-pt-xl">
      <div class="full-height full-width flex items-center justify-center column" style="border: dashed 3px #ccc; border-radius: 6px">
        <q-icon name="bi-book" size="64px" color="grey-5"></q-icon>
        <span class="text-grey-6 text-bold q-mt-md">{{ $t('no_config_available') }}</span>
        <Notification
          :message="errorMessage"
          :title="errorTitle"
          class="q-ma-md-xl"
          type="warning"
        />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { setCssVar } from 'quasar';
import Header from 'components/header/Header.vue';
import Notification from '@/components/Notification.vue';
import BookmarkService from './services/bookmark';
import Loading from '@/components/Loading.vue';
import { delay } from 'src/utils';

export default {
  name: 'TIDO',
  components: {
    Header,
    Notification,
    Loading,
  },
  data() {
    return {
      errorTitle: '',
      errorMessage: '',
      isLoading: true,
    };
  },
  computed: {
    ready() {
      const { collection: collectionUrl, manifest: manifestUrl } = this.config;
      console.log('check ready', !!(collectionUrl), !!(manifestUrl), !!(this.item), !!(this.collection), !!(this.manifest), this.manifests.length);

      if (!this.item) {
        return false;
      }

      if (collectionUrl) {
        return this.manifests.length > 0 && !!(this.collection) && !!(this.manifest);
      }

      if (manifestUrl) {
        return !!(this.manifest);
      }

      return true;
    },
    annotations() {
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

    BookmarkService.initRouter(this.$router);

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
      await this.$store.dispatch('contents/initManifest', url);
    },
    async getItem(url) {
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
        // Otherwise, no collection is given but a single manifest instead, so we load that manifest.
        if (collection) {
          await this.getCollection(collection);
        } else if (manifest) {
          await this.getManifest(manifest);
        }
      } catch (e) {
        await delay(1000);
        this.isLoading = false;
        this.errorTitle = e.title || 'unknown_error';
        this.errorMessage = e.message || 'please_try_again_later';
      }
    },
    isReady() {
      return this.item && this.manifests;
    },

    async onItemUrlChange(val) {
      if (val) {
        console.log('on item change');
        await delay(5000);
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

.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  align-items: center;
}
</style>
