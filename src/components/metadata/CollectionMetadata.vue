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
import MetadataItem from '@/components/metadata/MetadataItem.vue';

export default {
  name: 'CollectionMetadata',
  components: {
    MetadataItem,
  },
  computed: {
    collection() {
      return this.$store.getters['contents/collection'];
    },
    metadata() {
      if (!this.collection) return [];

      const mappings = {
        main: 'title',
        sub: 'subtitle',
      };

      const collectorName = this.collection?.collector?.name;
      const description = this.collection?.description;

      return [
        ...this.collection.title
          .filter((collection) => collection)
          .map((collectionTitle) => ({
            key: mappings[collectionTitle.type] || 'title',
            value: collectionTitle.title,
          })),
        ...(collectorName ? [{ key: 'collector', value: collectorName }] : []),
        ...(description ? [{ key: 'description', value: description }] : []),
        ...(this.collection.metadata || []),
      ];
    },
  },
};
</script>

<style scoped>

</style>
