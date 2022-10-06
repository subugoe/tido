<template>
  <q-list dense class="q-mb-lg">
    <q-item class="no-padding">
      <q-item-section>
        <h3>{{ $t(labels.item) }} {{ number }} / {{ itemsCount }}</h3>
      </q-item-section>
    </q-item>

    <q-item
      v-for="(metadataItem, index) in metadata"
      :key="index"
      class="q-mb-xs no-padding"
    >
      <q-item-section
        v-if="Object.keys(metadataItem).length"
        class="q-mb-sm"
      >
        <q-item-label
          overline
          class="text-uppercase"
        >
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
  name: 'ItemMetadata',
  components: {
    ContentUrls
  },
  computed: {
    item() {
      return this.$store.getters['contents/item'];
    },
    manifest() {
      return this.$store.getters['contents/manifest'];
    },
    itemsCount() {
      return this.manifest?.sequence.length;
    },
    labels() {
      return this.$store.getters['config/config'].labels;
    },
    number() {
      return this.manifest ? this.manifest.sequence.findIndex(({ id }) => id === this.item.id) + 1 : 0;
    },
    metadata() {
      return [
        { id: 'label', data: this.item.n },
        { id: 'language', data: this.item.lang?.join(',') },
        { id: 'image_license', data: this.item.image?.license?.id },
        { id: 'image_notes', data: this.item.image?.license?.notes },
      ].filter((item) => item.data);
    },
  }
};
</script>

<style scoped>

</style>
