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
    }
  },
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
