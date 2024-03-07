<!-- eslint-disable vue/valid-v-for -->
<template>
  <div v-for="actorItem in data" :key="name" class="q-mb-md">
    <q-item-label overline class="text-uppercase">
      {{ $t(getRole(actorItem)) }}
    </q-item-label>
    <MetadataValue :value="actorItem.name"></MetadataValue>
  </div>
</template>

<script setup>
import MetadataValue from '@/components/metadata/MetadataValue.vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

function getRole(actorItem) {
  const { role } = actorItem;
  if (!role) return 'undefined_role';
  if (!Array.isArray(role)) return role;
  if (role.length > 0) return role[0];
  return 'undefined_role';
}
</script>

<style scoped>

</style>
