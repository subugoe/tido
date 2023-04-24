<template>
  <div v-for="{ role, name } in data" :key="name" class="q-mb-md">
    <q-item-label overline class="text-uppercase">
      {{ $t(role) }}
    </q-item-label>
    <MetadataValue :value="name"></MetadataValue>
  </div>
</template>

<script>
import MetadataValue from '@/components/metadata/MetadataValue.vue';

export default {
  name: 'Actor',
  components: { MetadataValue },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>

</style>
