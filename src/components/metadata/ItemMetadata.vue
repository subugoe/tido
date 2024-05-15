<template>
  <div class="item-metadata t-mb-7">
    <h3 class="t-text-xl t-font-semibold t-mb-2">{{ $t(labels.item) }} {{ number }} / {{ total }}</h3>
    <div v-for="(meta, idx) in metadata" :key="idx" class="t-mb-4">
      <MetadataItem :item="meta"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { useStore } from 'vuex';
import MetadataItem from '@/components/metadata/MetadataItem.vue';

const store = useStore();

const item = computed <Item> (() => store.getters['contents/item']);
const itemUrl = computed <string> (() => store.getters['contents/itemUrl']);
const manifest = computed <Manifest> (() => store.getters['contents/manifest']);
const itemsCount = computed <number> (() => manifest.value?.sequence.length);
const labels = computed <Labels> (() => store.getters['config/config'].labels);
const number = computed <number> (() => (manifest.value ? manifest.value.sequence.findIndex(({ id }) => id === itemUrl.value) + 1 : 1));
const total = computed <number> (() => itemsCount.value ?? 1);
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
