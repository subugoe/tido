<template>
  <q-layout class="root viewport" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'">
    <Header/>
    <q-page-container v-if="ready" class="root">
      <MainView/>
    </q-page-container>

    <q-page-container v-else class="error-container q-pa-lg q-pt-xl">
      <div class="full-height full-width flex items-center justify-center column" style="border: dashed 3px #ccc; border-radius: 6px">
        <Notification
          v-if="errorMessage"
          :message="errorMessage"
          :title="errorTitle"
          class="q-ma-md-xl"
          type="warning"
        />
        <template v-else>
          <q-icon name="bi-book" size="64px" color="grey-5"></q-icon>
          <span  class="text-grey-6 text-bold q-mt-md">{{ $t('no_entrypoint_available') }}</span>
        </template>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { setCssVar } from 'quasar';
import Header from 'components/header/Header.vue';
import { delay } from 'src/utils';
import MainView from 'src/views/MainView';
import Notification from '@/components/Notification.vue';

export default {
  name: 'TIDO',
  components: {
    MainView,
    Header,
    Notification,
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

      if (!this.item) {
        return false;
      }

      if (collectionUrl) {
        return this.manifests !== null && !!(this.collection) && !!(this.manifest);
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
    this.$q.dark.set('auto');
    this.$i18n.locale = this.config.lang;

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
        await this.$store.dispatch('config/load', this.$root.config);
      } catch ({ title, message }) {
        this.errorTitle = this.$t('config_error');
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
