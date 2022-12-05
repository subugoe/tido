<template>
  <q-list dense class="q-mb-lg">
    <q-item class="no-padding">
      <q-item-section>
        <h3>{{ $t(labels.item) }} {{ number }} / {{ total }}</h3>
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
  name: 'ItemMetadata',
  components: {
    MetadataItem,
  },
  computed: {
    item() {
      return this.$store.getters['contents/item'];
    },
    itemUrl() {
      return this.$store.getters['contents/itemUrl'];
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
      return this.manifest ? this.manifest.sequence.findIndex(({ id }) => id === this.itemUrl) + 1 : 1;
    },
    total() {
      return this.itemsCount ?? 1;
    },
    metadata() {
      return [
        { key: 'label', value: this.item.n },
        { key: 'language', value: this.item.lang?.join(',') },
        { key: 'image_license', value: this.item.image?.license?.id },
        { key: 'image_notes', value: this.item.image?.license?.notes },
      ].filter((item) => item.value);
    },
  },
};
</script>

<style scoped>

</style>
