<template>
  <div class="tido">
    <div class="viewport column" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-3'">
      <GlobalHeader/>
      <div v-if="ready" class="root">
        <PanelsWrapper/>
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
export default {
  name: 'TIDO',
}
</script>

<script setup>
import { setCssVar } from 'quasar';
import { biBook } from '@quasar/extras/bootstrap-icons';
import GlobalHeader from '@/components/header/GlobalHeader.vue';
import { delay } from '@/utils';
import PanelsWrapper from '@/components/panels/PanelsWrapper.vue';
import Notification from '@/components/Notification.vue';
import Loading from '@/components/Loading.vue';

import { computed, inject, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { i18n } from '@/i18n';

const store = useStore();
const $q = useQuasar();
const { t, locale: i18nLocale } = useI18n();

const errorTitle = ref('');
const errorMessage = ref('');
const isLoading = ref(true);

const emptyIcon = biBook;

const ready = computed(() => {
  const { collection: collectionUrl, manifest: manifestUrl } = config.value;

  if (!item.value) {
    return false;
  }

  if (item.value.annotationCollection && annotations.value === null) {
    return false;
  }

  if (collectionUrl) {
    return manifests.value !== null && !!(collection.value) && !!(manifest.value);
  }

  if (manifestUrl) {
    return !!(manifest.value);
  }

  return true;
});
const annotations = computed(() => store.getters['annotations/annotations']);
const config = computed(() => store.getters['config/config']);
const collection = computed(() => store.getters['contents/collection']);
const item = computed(() => store.getters['contents/item']);
const manifest = computed(() => store.getters['contents/manifest']);
const manifests = computed(() => store.getters['contents/manifests']);

onMounted(async () => {
  isLoading.value = true;
  $q.dark.set('auto');

  await loadConfig();

  if (errorMessage.value) {
    isLoading.value = false;
    return;
  }

  i18nLocale.value = config.value.lang;

  const colorsForceMode = config.value.colors.forceMode;

  if (colorsForceMode && colorsForceMode !== 'none') {
    $q.dark.set(colorsForceMode === 'dark');
  }

  if (config.value?.colors?.primary) {
    setCssVar('primary', config.value.colors.primary);
  }

  if (config.value?.colors?.secondary) {
    setCssVar('secondary', config.value.colors.secondary);
  }

  if (config.value?.colors?.accent) {
    setCssVar('accent', config.value.colors.accent);
  }

  await init();
});

async function getCollection(url) {
  await store.dispatch('contents/initCollection', url);
}
async function loadConfig() {
  try {
    const config = inject('config');
    await store.dispatch('config/load', config);
  } catch ({ title, message }) {
    errorTitle.value = t('config_error');
    errorMessage.value = message;
  }
}
async function getManifest(url) {
  await store.dispatch('contents/initManifest', url);
}
async function getItem(url) {
  await store.dispatch('contents/initItem', url);
}
async function init() {
  const { collection, manifest, item } = config.value;
  try {
    // We want to preload all required data that the components need.
    // If a collection is given we ignore the manifest setting
    // and try to figure out the correct manifest by searching for the above item.
    // Otherwise, no collection is given but a single manifest instead, so we load that manifest.

    if (collection) {
      await getCollection(collection);
    } else if (manifest) {
      await getManifest(manifest);
    } else {
      // eslint-disable-next-line no-console
      throw new Error(i18n.global.t('no_entrypoint_available'));
    }
  } catch (e) {
    await delay(1000);
    errorTitle.value = e.title || 'unknown_error';
    errorMessage.value = e.message || 'please_try_again_later';
  } finally {
    isLoading.value = false;
  }
}
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
