<template>
  <div class="tido">
    <div class="t-h-full t-flex t-flex-col t-bg-gray-200 dark:t-bg-gray-900 t-text-gray-800 dark:t-text-gray-200">
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
          </template>
        </div>
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
import { useI18n } from 'vue-i18n';
import { useConfigStore } from '@/stores/config';
import { useAnnotationsStore } from '@/stores/annotations';
import { useContentsStore } from '@/stores/contents';

import GlobalHeader from '@/components/header/GlobalHeader.vue';
import { delay } from '@/utils';
import PanelsWrapper from '@/components/panels/PanelsWrapper.vue';
import Notification from '@/components/Notification.vue';
import Loading from '@/components/Loading.vue';
import { initUseDark } from '@/utils/is-dark';

const configStore = useConfigStore();
const annotationStore = useAnnotationsStore();
const contentStore = useContentsStore();
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
const collection = computed<Collection>(() => contentStore.collection);
const item = computed<Item>(() => contentStore.item);
const manifest = computed<Manifest>(() => contentStore.manifest);
const manifests = computed<Manifest[]>(() => contentStore.manifests);
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
  const contentStore = useContentsStore();
  await contentStore.initCollection(url);
}
async function loadConfig() {
  try {
    const config = inject('config');
    await configStore.load(config);
  } catch ({ title, message }) {
    errorTitle.value = t('config_error');
    errorMessage.value = t(message);
  }
}
async function getManifest(url: string) {
  const contentStore = useContentsStore();
  await contentStore.initManifest(url);
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
<style>
.tido {
  width: 100%;
  height: 100%;
}
</style>
