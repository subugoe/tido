<template>
  <div class="tido">
    <div class="viewport column" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'">
      <Header/>
      <div v-if="ready" class="root">
        <MainView/>
      </div>
      <div v-else class="error-container q-pa-md q-pa-lg-lg q-pt-xl">
        <div class="full-height full-width flex items-center justify-center column" style="border: dashed 3px #ccc; border-radius: 6px">
          <template v-if="isLoading">
            <Loading background="none"></Loading>
          </template>
          <template v-else>
            <Notification
              v-if="errorMessage"
              :message="errorMessage"
              :title="errorTitle"
              class="q-ma-md-xl"
              type="warning"
            />
            <template v-else>
              <q-icon :name="emptyIcon" size="64px" color="grey-5"></q-icon>
              <span  class="text-grey-6 text-bold q-mt-md">{{ $t('no_entrypoint_available') }}</span>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setCssVar } from 'quasar';
import { biBook } from '@quasar/extras/bootstrap-icons';
import Header from '@/components/header/Header.vue';
import { delay } from '@/utils';
import MainView from '@/views/MainView.vue';
import Notification from '@/components/Notification.vue';
import Loading from '@/components/Loading.vue';

export default {
  name: 'TIDO',
  components: {
    Loading,
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
  created() {
    this.emptyIcon = biBook;
  },
  async mounted() {
    this.isLoading = true;
    this.$q.dark.set('auto');

    await this.loadConfig();
    await this.init();

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
        this.errorTitle = e.title || 'unknown_error';
        this.errorMessage = e.message || 'please_try_again_later';
      } finally {
        this.isLoading = false;
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

  @media (max-width: $breakpoint-sm-max) {
    flex-direction: column;
    height: auto;
    overflow: auto;
  }
}

.viewport {
  flex: 1;
  @media (max-width: $breakpoint-sm-max) {
    height: auto;
    overflow: auto;
  }
}

.error-container {
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  align-items: center;
  height: 100%;
}
</style>
