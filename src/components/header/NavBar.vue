<template>
  <div class="t-flex t-space-x-2">
    <BaseButton
      v-if="manifest"
      :disabled="!hasPrev"
      :text="prevButtonLabel"
      size="small"
      icon="arrowLeft"
      class="prev-button"
      @click="prev"
    />

    <BaseButton
      v-if="manifest"
      :disabled="!hasNext"
      :text="nextButtonLabel"
      size="small"
      icon="arrowRight"
      icon-position="right"
      class="next-button"
      @click="next"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfigStore } from '@/stores/config';
import { useContentsStore } from '@/stores/contents';
import BaseButton from '@/components/base/BaseButton.vue';
import { isAhiqarWebsite } from '@/utils/translations'

const configStore = useConfigStore();
const contentStore = useContentsStore();
const { t } = useI18n();

const manifest = computed<Manifest>(() => contentStore.manifest);
const manifests = computed<Manifest[]>(() => contentStore.manifests);
const itemUrl = computed<string>(() => contentStore.itemUrl);
const itemIndex = computed<number>(() => (manifest.value ? manifest.value.sequence.findIndex(({ id }) => id === itemUrl.value) : -1));
const hasPrev = computed<boolean>(() => {
  const prevIndex = itemIndex.value - 1;
  if (prevIndex < 0) {
    if (manifests.value === null) return false;
    const prevManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) - 1;
    if (prevManifestIndex < 0) return false;
  }

  return true;
});

function getNavButtonsLabels(config): string[] {
    if (isAhiqarWebsite(config)) {
      return [t('next_sheet'), t('previous_sheet'), t('next_manuscript'), t('previous_manuscript')] 
    }
    else {
      return [t('next_item'), t('previous_item'), t('next_manifest'), t('previous_manifest')]
    }
}

const hasNext = computed<boolean>(() => {
  const nextIndex = itemIndex.value + 1;
  if (nextIndex > manifest.value.sequence.length - 1) {
    if (manifests.value === null) return false;
    const nextManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) + 1;
    if (nextManifestIndex > manifests.value.length - 1) return false;
  }
  return true;
});

// variables are named according to the general concept of ie (page = sheet, item);  (document = manuscript)
const [nextPageLabel, previousPageLabel, nextDocumentLabel, previousDocumentLabel]: string[] = getNavButtonsLabels(configStore.config)

const nextButtonLabel = computed<string>(() => ( 
itemIndex.value === manifest.value.sequence.length - 1
  ? `${nextDocumentLabel}`
  : `${nextPageLabel}`));


const prevButtonLabel = computed<string>(() => (itemIndex.value === 0
  ? `${previousDocumentLabel}`
  : `${previousPageLabel}`));

function prev() {
  const prevIndex = itemIndex.value - 1;
  let newItemUrl = '';

  if (prevIndex < 0) {
    // If the index is lower than 0, we will load the prev manifest's last item
    const prevManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) - 1;
    if (prevManifestIndex < 0) return;

    const prevManifest = manifests.value[prevManifestIndex];
    contentStore.setManifest(prevManifest);
    configStore.setDefaultActiveViews();
    newItemUrl = prevManifest.sequence[prevManifest.sequence.length - 1].id;
  } else {
    // We load the previous item
    newItemUrl = manifest.value.sequence[prevIndex].id;
  }
  contentStore.initItem(newItemUrl);
}

function next() {
  const nextIndex = itemIndex.value + 1;
  let newItemUrl = '';

  if (nextIndex > manifest.value.sequence.length - 1) {
    const nextManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) + 1;
    if (nextManifestIndex > manifests.value.length - 1) return;

    const nextManifest = manifests.value[nextManifestIndex];
    contentStore.setManifest(nextManifest);
    configStore.setDefaultActiveViews();
    newItemUrl = nextManifest.sequence[0].id;
  } else {
    newItemUrl = manifest.value.sequence[nextIndex].id;
  }
  contentStore.initItem(newItemUrl);
}
</script>
