<template>
  <div class="metadata-view overflow-auto q-px-md q-pt-md">
    <CollectionMetadata v-if="options.collection?.all" />
    <ManifestMetadata v-if="options.manifest?.all" />
    <ItemMetadata v-if="options.manifest?.all" />
  </div>
</template>

<script setup>
import CollectionMetadata from '@/components/metadata/CollectionMetadata.vue';
import ManifestMetadata from '@/components/metadata/ManifestMetadata.vue';
import ItemMetadata from '@/components/metadata/ItemMetadata.vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  options: Object,
});

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
