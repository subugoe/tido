<template>
  <q-list v-if="Object.keys(collection).length" dense class="q-mb-lg">
    <q-item class="no-padding">
      <q-item-section dense>
        <h3>{{ $t('Collection') }}</h3>
      </q-item-section>
    </q-item>

    <q-item
      v-for="(mCollection, index) in metadata"
      :key="index"
      dense
      class="q-mb-sm no-padding"
    >
      <q-item-section v-if="Object.keys(mCollection).length" class="q-mb-sm">
        <q-item-label overline class="text-uppercase">
          {{ $t(mCollection.id) }}
        </q-item-label>

        <ContentUrls :content="mCollection.data" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'CollectionMetadata',
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
        { id: 'Collector', data: this.collection?.collector?.name },
        { id: 'Description', data: this.collection?.description },
      ].filter((collection) => collection.data);
    },
  }
};
</script>

<style scoped>

</style>
