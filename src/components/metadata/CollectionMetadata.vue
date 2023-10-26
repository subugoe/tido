<template>
  <q-list v-if="metadata.length > 0" dense class="q-mb-lg">
    <q-item class="no-padding">
      <q-item-section dense>
        <h3>{{ $t('collection') }}</h3>
      </q-item-section>
    </q-item>

    <q-item v-for="(meta, idx) in metadata" :key="idx" class="q-mb-sm no-padding">
      <q-item-section class="q-mb-sm no-padding">
        <MetadataItem :item="meta"/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'CollectionMetadata',
}
</script>

<script setup>
import MetadataItem from '@/components/metadata/MetadataItem.vue';

import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const collection = computed(() => store.getters['contents/collection']);
const metadata = computed(() => {
  if (!collection.value) return [];

  const mappings = {
    main: 'title',
    sub: 'subtitle',
  };

  const collectorName = collection.value.collector?.name;
  const description = collection.value.description;

  return [
    ...collection.value.title
      .filter((collection) => collection)
      .map((collectionTitle) => ({
        key: mappings[collectionTitle.type] || 'title',
        value: collectionTitle.title,
      })),
    ...(collectorName ? [{ key: 'collector', value: collectorName }] : []),
    ...(description ? [{ key: 'description', value: description }] : []),
    ...(collection.value.metadata || []),
  ];
});
</script>

<style scoped>

</style>
