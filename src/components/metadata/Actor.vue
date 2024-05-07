<template>
  <div v-for="actorItem in data" :key="actorItem.name" class="t-mb-4">
    <h4 class="t-font-semibold t-text-sm t-text-gray-400">
      {{ $t(getRole(actorItem)) }}
    </h4>
    <MetadataValue :value="actorItem.name"></MetadataValue>
  </div>
</template>

<script setup lang="ts">
import MetadataValue from '@/components/metadata/MetadataValue.vue';
import { type Actor } from '../../types'
import { i18n } from '@/i18n';


export interface Props {
  data: Actor []
}

const props = withDefaults(defineProps<Props>(), {
  data : () => [],
})

function getRole(actorItem: Actor) : string {
  const { role } = actorItem;
  if (!role) throw new Error(i18n.global.t('error_undefined_role'));
  return role[0];
}
</script>

<style scoped>

</style>
