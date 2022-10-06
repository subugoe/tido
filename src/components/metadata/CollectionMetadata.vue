<template>
  <q-list v-if="Object.keys(collection).length" dense class="q-mb-lg">
    <q-item class="no-padding">
      <q-item-section dense>
        <h3>{{ $t('collection') }}</h3>
      </q-item-section>
    </q-item>

    <q-item
      v-for="(metadataItem, index) in metadata"
      :key="index"
      dense
      class="q-mb-sm no-padding"
    >
      <q-item-section v-if="Object.keys(metadataItem).length" class="q-mb-sm">
        <q-item-label overline class="text-uppercase">
          {{ $t(metadataItem.id) }}
        </q-item-label>

        <ContentUrls :content="metadataItem.data" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import ContentUrls from "components/ContentUrls.vue";

export default {
  name: 'CollectionMetadata',
  components: {
    ContentUrls
  },
  computed: {
    collection() {
      return this.$store.getters['contents/collection'];
    },
    metadata() {
      const mappings = {
        main: 'Title',
        sub: 'Subtitle',
      };

      return [
        ...this.collection.title
          .filter((collection) => collection)
          .map((collectionTitle) => ({
            id: mappings[collectionTitle.type] || 'Title',
            data: collectionTitle.title,
          })),
        { id: 'collector', data: this.collection?.collector?.name },
        { id: 'description', data: this.collection?.description },
      ].filter((collection) => collection.data);
    },
  }
};
</script>

<style scoped>

</style>
