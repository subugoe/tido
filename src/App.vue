<template>
  <div class="tido t-h-full t-flex t-flex-col t-bg-gray-200 dark:t-bg-gray-900 t-text-gray-800 dark:t-text-gray-200">
      <GlobalHeader/>
      <PanelsWrapper v-if="ready"/>
      <div v-else class="t-flex t-relative t-flex-1 t-justify-center t-items-center t-p-4 lg:t-p-6">
        <div class="t-h-full t-w-full t-flex t-items-center t-justify-center t-border-dashed t-border-[3px] t-border-gray-400 dark:t-border-dashed dark:t-border-gray-600 t-rounded-md">
          <template v-if="isLoading">
            <Loading class="t-text-6xl"></Loading>
          </template>
          <template v-else>
            <Notification
              v-if="errorMessage"
              :message="errorMessage"
              :title="errorTitle"
              type="warning"
            />
            <template v-else>
              <div class="t-flex t-flex-col t-items-center">
                <BaseIcon name="book" class="t-w-16 t-h-16" />
                <span  class="t-font-bold t-mt-4 dark:t-text-gray-400">{{ $t('no_entrypoint_available') }}</span>
              </div>
            </template>
          </template>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'TIDO',
};
</script>

<script setup lang="ts">
import {
  computed, inject, onMounted, ref,
} from 'vue';
import { useStore } from 'vuex';
import { useConfigStore } from '@/stores/config';
import { useAnnotationsStore } from './stores/annotations';

import { useI18n } from 'vue-i18n';
import GlobalHeader from '@/components/header/GlobalHeader.vue';
import { delay } from '@/utils';
import PanelsWrapper from '@/components/panels/PanelsWrapper.vue';
import Notification from '@/components/Notification.vue';
import Loading from '@/components/Loading.vue';
import BaseIcon from '@/components/base/BaseIcon.vue';
import { initUseDark } from '@/utils/is-dark';

const store = useStore();
const configStore = useConfigStore()
const annotationStore = useAnnotationsStore()
const { t, locale: i18nLocale } = useI18n();

const errorTitle = ref('');
const errorMessage = ref('');
const isLoading = ref(true);

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
const annotations = computed<Annotation[]>(() => annotationStore.annotations);
const config = computed(() => configStore.config);
const collection = computed<Collection>(() => store.getters['contents/collection']);
const item = computed<Item>(() => store.getters['contents/item']);
const manifest = computed<Manifest>(() => store.getters['contents/manifest']);
const manifests = computed<Manifest[]>(() => store.getters['contents/manifests']);
initUseDark(config.value.container);

onMounted(async () => {
  isLoading.value = true;

  await loadConfig();

  if (errorMessage.value) {
    isLoading.value = false;
    return;
  }

  i18nLocale.value = config.value.lang;

  setColorMode(config.value.colors.forceMode);

  await init();
});

async function getCollection(url: string) {
  await store.dispatch('contents/initCollection', url);
}
async function loadConfig() {
  try {
    const config = inject('config');
    await configStore.load(config)
  } catch ({ title, message }) {
    errorTitle.value = t('config_error');
    errorMessage.value = t(message);
  }
}
async function getManifest(url: string) {
  await store.dispatch('contents/initManifest', url);
}
async function getItem(url: string) {
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
      throw new Error(t('no_entrypoint_available'));
    }
  } catch (e) {
    await delay(1000);
    errorTitle.value = e.title || t('unknown_error');
    errorMessage.value = e.message || t('please_try_again_later');
  } finally {
    isLoading.value = false;
  }
}

function setColorMode(configValue: string) {
  if (configValue) {
    if (!configValue.match(/^[0-9a-zA-Z]{1,16}$/)) return;
    document.querySelector(config.value.container).setAttribute('color-scheme', configValue);
  }
}

</script>