<template>
  <div v-for="actorItem in data" :key="actorItem.name" class="t-mb-4">
    <h4 class="t-font-semibold t-text-sm t-text-gray-400">
      {{ $t(getRole(actorItem)) }}
    </h4>
    <MetadataValue :value="actorItem.name"></MetadataValue>
  </div>
</template>

<script setup>
import MetadataValue from '@/components/metadata/MetadataValue.vue';

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
