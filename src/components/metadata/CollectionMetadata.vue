<template>
  <div v-if="metadata.length > 0" class="collection-metadata t-mb-7">
    <h3 class="t-text-xl t-font-semibold t-mb-2">{{ $t('collection') }}</h3>
    <div v-for="(meta, idx) in metadata" :key="idx" class="t-mb-4">
      <MetadataItem :item="meta"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { useStore } from 'vuex';
import MetadataItem from '@/components/metadata/MetadataItem.vue';
import { getCollectorName } from '../../types.d.ts' 

const store = useStore();

const collection = computed<Collection>(() => store.getters['contents/collection']);

const metadata = computed(() => {
  if (!collection.value) return [];

  const mappings = {
    main: 'title',
    sub: 'subtitle',
  };

  const collectorName : string = getCollectorName(collection.value);
  const description : string | undefined = collection.value.description;
  const collectionTitle : Title[] = collection.value.title;

  return [
    ...collectionTitle
      .filter((collection) => collection)
      .map((collectionTitle) => ({
        key: mappings[collectionTitle.type] || 'title',
        value: collectionTitle.title,
      })),
    ...(collectorName ? [{ key: 'collector', value: collectorName }] : []),
    ...(description ? [{ key: 'description', value: description }] : []),
  ];
});
</script>

<style scoped>

</style>
