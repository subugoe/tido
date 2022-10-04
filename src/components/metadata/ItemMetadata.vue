<template>
  <q-list dense class="q-mb-lg">
    <q-item class="no-padding">
      <q-item-section>
        <h3>{{ $t(labels.item) }} {{ itemIndex + 1 }} / {{ itemcount }}</h3>
      </q-item-section>
    </q-item>

    <q-item
      v-for="(mItem, index) in metadataItem"
      :key="index"
      class="q-mb-xs no-padding"
    >
      <q-item-section
        v-if="Object.keys(mItem).length"
        class="q-mb-sm"
      >
        <q-item-label
          overline
          class="text-uppercase"
        >
          {{ $t(mItem.id) }}
        </q-item-label>

        <ContentUrls :content="mItem.data" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'ItemMetadata',
  computed: {
    item() {
      return this.$store.getters['contents/item'];
    },
    labels() {
      return this.$store.getters['config/config'].labels;
    },
    getNumber() {
      return this.manifest.sequence.findIndex(({ id }) => id === this.item.id) + 1;
    },
    metadata() {
      return [
        { id: 'Label', data: this.item.n },
        { id: 'Language', data: this.item.lang?.join(',') },
        { id: 'imageLicense', data: this.item.image?.license?.id },
        { id: 'imageNotes', data: this.item.image?.license?.notes },
      ].filter((item) => item.data);
    },
  }
};
</script>

<style scoped>

</style>
