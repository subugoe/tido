<template>
  <div v-for="actorItem in data" :key="name" class="q-mb-md">
    <q-item-label overline class="text-uppercase">
      {{ $t(getRole(actorItem)) }}
    </q-item-label>
    <MetadataValue :value="actorItem.name"></MetadataValue>
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
  methods: {
    getRole(actorItem) {
      const { role } = actorItem;
      if (!role) return 'undefined_role';
      if (!Array.isArray(role)) return role;
      if (role.length > 0) return role[0];
      return 'undefined_role';
    },
  },
};
</script>

<style scoped>

</style>
