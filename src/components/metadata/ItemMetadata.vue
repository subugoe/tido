<template>
  <div class="t-mb-6">
    <h3>{{ $t(labels.item) }} {{ number }} / {{ total }}</h3>
    <div v-for="(meta, idx) in metadata" :key="idx" class="q-mb-2 no-padding">
      <MetadataItem :item="meta"/>
    </div>
  </div>
</template>

<script setup>

import { computed } from 'vue';
import { useStore } from 'vuex';
import MetadataItem from '@/components/metadata/MetadataItem.vue';

const store = useStore();

const item = computed(() => store.getters['contents/item']);
const itemUrl = computed(() => store.getters['contents/itemUrl']);
const manifest = computed(() => store.getters['contents/manifest']);
const itemsCount = computed(() => manifest.value?.sequence.length);
const labels = computed(() => store.getters['config/config'].labels);
const number = computed(() => (manifest.value ? manifest.value.sequence.findIndex(({ id }) => id === itemUrl.value) + 1 : 1));
const total = computed(() => itemsCount.value ?? 1);
const metadata = computed(() => (
  [
    { key: 'label', value: item.value.n },
    { key: 'language', value: item.value?.lang?.join(',') },
    { key: 'image_license', value: item.value?.image?.license?.id },
    { key: 'image_notes', value: item.value?.image?.license?.notes },
  ].filter((item) => item.value)
));
</script>

<style scoped>

</style>
