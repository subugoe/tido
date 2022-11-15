<template>
  <div class="metadata-container">
    <CollectionMetadata v-if="options.collection?.all" />
    <ManifestMetadata v-if="options.manifest?.all" />
    <ItemMetadata v-if="options.manifest?.all" />
  </div>
</template>

<script>
import CollectionMetadata from 'components/metadata/CollectionMetadata';
import ManifestMetadata from 'components/metadata/ManifestMetadata';
import ItemMetadata from 'components/metadata/ItemMetadata';

export default {
  name: 'Metadata',
  props: {
    options: Object,
  },
  components: {
    ItemMetadata,
    ManifestMetadata,
    CollectionMetadata,
  },
  computed: {
    config() {
      return this.$store.getters['config/config'];
    },
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
