<template>
  <div class="metadata-view overflow-auto q-px-md q-pt-md">
    <CollectionMetadata v-if="options.collection?.all" />
    <ManifestMetadata v-if="options.manifest?.all" />
    <ItemMetadata v-if="options.manifest?.all" />
  </div>
</template>

<script>
export default {
  name: 'MetadataView',
}
</script>

<script setup>
import CollectionMetadata from '@/components/metadata/CollectionMetadata.vue';
import ManifestMetadata from '@/components/metadata/ManifestMetadata.vue';
import ItemMetadata from '@/components/metadata/ItemMetadata.vue';

import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  options: Object,
});

const store = useStore();

const config = computed(() => store.getters['config/config'] );
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
