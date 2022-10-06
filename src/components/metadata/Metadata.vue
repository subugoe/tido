<template>
  <div class="metadata-container q-pa-md q-pt-md">
    <CollectionMetadata v-if="options.collection?.all" />
    <ManifestMetadata v-if="options.manifest?.all" />
    <ItemMetadata v-if="options.manifest?.all" />
  </div>
</template>

<script>
import ContentUrls from 'components/ContentUrls.vue';
import MetadataItem from 'components/metadata/MetadataItem';
import CollectionMetadata from 'components/metadata/CollectionMetadata';
import ManifestMetadata from 'components/metadata/ManifestMetadata';
import ItemMetadata from 'components/metadata/ItemMetadata';

export default {
  name: 'Metadata',
  props: {
    options: Object
  },
  components: {
    ItemMetadata,
    ManifestMetadata,
    CollectionMetadata,
    MetadataItem,
    ContentUrls,
  },
  computed: {
    config() {
      return this.$store.getters['config/config'];
    },
    item() {
      return this.$store.getters['contents/item'];
    },

    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    sequenceIndex() {
      return this.$store.getters['contents/selectedSequenceIndex'];
    },
    itemIndex() {
      return this.$store.getters['contents/selectedItemIndex'];
    },

    metadataItem() {
      return [
        { id: 'label', data: this.item.n },
        { id: 'language', data: this.item.lang?.join(',') },
        { id: 'image_license', data: this.item.image?.license?.id },
        { id: 'image_notes', data: this.item.image?.license?.notes },
      ].filter((item) => item.data);
    },
    getManifestNumber() {
      return this.manifests.findIndex(({ id }) => id === this.manifest.id);
    }
  },
  mounted() {
    console.log(this.options)
  }
};
</script>

<style lang="scss" scoped>
.q-list {
  .q-item__label {
    color: $dark;
  }

  &--dark {
    .q-item__label {
      color: $light;
    }
  }
}
</style>
