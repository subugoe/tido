<template>
  <div>
    <q-btn
      v-if="manifest"
      :disable="!hasPrev"
      unelevated
      color="primary"
      class="q-px-sm q-mr-sm previous-item"
      :icon="prevIcon"
      :label="prevButtonLabel"
      @click="prev"
      no-caps
      dense
    />

    <q-btn
      v-if="manifest"
      unelevated
      color="primary"
      :disable="!hasNext"
      class="q-px-sm next-item"
      :icon-right="nextIcon"
      :label="nextButtonLabel"
      @click="next"
      no-caps
      dense
    />
  </div>
</template>

<script setup>
import { biArrowLeft, biArrowRight } from '@quasar/extras/bootstrap-icons';
import { computed, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const store = useStore();
const { t } = useI18n();

const prevIcon = ref(null);
const nextIcon = ref(null);

const manifest = computed(() => store.getters['contents/manifest']);
const manifests = computed(() => store.getters['contents/manifests']);
const itemUrl = computed(() => store.getters['contents/itemUrl']);
const itemIndex = computed(() => (manifest.value ? manifest.value.sequence.findIndex(({ id }) => id === itemUrl.value) : -1));
const hasPrev = computed(() => {
  const prevIndex = itemIndex.value - 1;
  if (prevIndex < 0) {
    if (manifests.value === null) return false;
    const prevManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) - 1;
    if (prevManifestIndex < 0) return false;
  }

  return true;
});
const hasNext = computed(() => {
  const nextIndex = itemIndex.value + 1;
  if (nextIndex > manifest.value.sequence.length - 1) {
    if (manifests.value === null) return false;
    const nextManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) + 1;
    if (nextManifestIndex > manifests.value.length - 1) return false;
  }
  return true;
});
const nextButtonLabel = computed(() => (itemIndex.value === manifest.value.sequence.length - 1
  ? `${t('next')} ${t(labels.value.manifest)}`
  : `${t('next')} ${t(labels.value.item)}`));

const prevButtonLabel = computed(() => (itemIndex.value === 0
  ? `${t('prev')} ${t(labels.value.manifest)}`
  : `${t('prev')} ${t(labels.value.item)}`));

const labels = computed(() => store.getters['config/config'].labels || {
  manifest: 'manifest',
  item: 'item',
});

onBeforeMount(() => {
  prevIcon.value = biArrowLeft;
  nextIcon.value = biArrowRight;
});

function prev() {
  const prevIndex = itemIndex.value - 1;
  let prevItemUrl = '';

  if (prevIndex < 0) {
    // If the index is lower than 0, we will load the prev manifest's last item
    const prevManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) - 1;
    if (prevManifestIndex < 0) return;

    const prevManifest = manifests.value[prevManifestIndex];
    store.commit('contents/setManifest', prevManifest);
    store.dispatch('config/setDefaultActiveViews');
    prevItemUrl = prevManifest.sequence[prevManifest.sequence.length - 1].id;
  } else {
    // We load the previous item
    prevItemUrl = manifest.value.sequence[prevIndex].id;
  }
  store.dispatch('contents/initItem', prevItemUrl);
}
function next() {
  const nextIndex = itemIndex.value + 1;
  let nextTtemUrl = '';

  if (nextIndex > manifest.value.sequence.length - 1) {
    const nextManifestIndex = manifests.value.findIndex(({ id }) => id === manifest.value.id) + 1;
    if (nextManifestIndex > manifests.value.length - 1) return;

    const nextManifest = manifests.value[nextManifestIndex];
    store.commit('contents/setManifest', nextManifest);
    store.dispatch('config/setDefaultActiveViews');
    nextTtemUrl = nextManifest.sequence[0].id;
  } else {
    nextTtemUrl = manifest.value.sequence[nextIndex].id;
  }
  store.dispatch('contents/initItem', nextTtemUrl);
}
</script>

<style lang="scss" scoped>
button {
  font-size: 12px !important;
}

.q-input {
  width: 100%;
  @media (min-width: 600px) {
    margin-right: 8px;
    width: 160px;
  }
}
</style>
