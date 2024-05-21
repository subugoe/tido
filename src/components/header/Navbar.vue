<template>
  <div class="t-flex t-space-x-2">
    <BaseButton
      v-if="manifest"
      :disabled="!hasPrev"
      :text="prevButtonLabel"
      size="small"
      icon="arrowLeft"
      @click="prev"
      class="prev-button"
    />

    <BaseButton
      v-if="manifest"
      :disabled="!hasNext"
      :text="nextButtonLabel"
      size="small"
      icon="arrowRight"
      icon-position="right"
      @click="next"
      class="next-button"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import BaseButton from '@/components/base/BaseButton.vue';

const store = useStore();
const { t } = useI18n();

const manifest = computed<Manifest>(() => store.getters['contents/manifest']);
const manifests = computed<Manifest[]>(() => store.getters['contents/manifests']);
const itemUrl = computed<string>(() => store.getters['contents/itemUrl']);
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
const hasNext = computed<boolean>(() => {
  const nextIndex = itemIndex.value + 1;
  if (nextIndex > manifest.value.sequence.length - 1) {
    if (manifests.value === null) return false;
    const nextManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) + 1;
    if (nextManifestIndex > manifests.value.length - 1) return false;
  }
  return true;
});
const labels = computed<Labels>(() => store.getters['config/config'].labels || {
  manifest: 'manifest',
  item: 'item',
});
const nextButtonLabel = computed<string>(() => (itemIndex.value === manifest.value.sequence.length - 1
  ? `${t('next')} ${t(labels.value.manifest ? labels.value.manifest: 'Manuscript')}`
  : `${t('next')} ${t(labels.value.item)}`));
const prevButtonLabel = computed<string>(() => (itemIndex.value === 0
  ? `${t('prev')} ${t(labels.value.manifest ? labels.value.manifest: 'Manuscript')}`
  : `${t('prev')} ${t(labels.value.item)}`));


function prev() {
  const prevIndex = itemIndex.value - 1;
  let itemUrl = '';

  if (prevIndex < 0) {
    // If the index is lower than 0, we will load the prev manifest's last item
    const prevManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) - 1;
    if (prevManifestIndex < 0) return;

    const prevManifest = manifests.value[prevManifestIndex];
    store.commit('contents/setManifest', prevManifest);
    store.dispatch('config/setDefaultActiveViews');
    itemUrl = prevManifest.sequence[prevManifest.sequence.length - 1].id;
  } else {
    // We load the previous item
    itemUrl = manifest.value.sequence[prevIndex].id;
  }
  store.dispatch('contents/initItem', itemUrl);
}

function next() {
  const nextIndex = itemIndex.value + 1;
  let itemUrl = '';

  if (nextIndex > manifest.value.sequence.length - 1) {
    const nextManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) + 1;
    if (nextManifestIndex > manifests.value.length - 1) return;

    const nextManifest = manifests.value[nextManifestIndex];
    store.commit('contents/setManifest', nextManifest);
    store.dispatch('config/setDefaultActiveViews');
    itemUrl = nextManifest.sequence[0].id;
  } else {
    itemUrl = manifest.value.sequence[nextIndex].id;
  }
  store.dispatch('contents/initItem', itemUrl);
}
</script>
