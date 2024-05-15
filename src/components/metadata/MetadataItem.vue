<template>
  <div>
    <h4 v-if="!isLink()" class="t-font-semibold t-text-sm t-text-gray-400">
      {{ $t(label) }}
    </h4>
    <MetadataLink v-if="isLink()" :url="item.key" :text="item.value"/>
    <MetadataValue v-else :value="item.value" />
    <MetadataItem v-for="(childItem, idx) in childItems" :key="idx" :item="childItem" class="nested-metadata"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MetadataLink from '@/components/metadata/MetadataLink.vue';
import MetadataValue from '@/components/metadata/MetadataValue.vue';

const props = defineProps<{
  item: Metadata,
}>();

const label = computed<string>(() => props.item?.key || 'other');
const childItems = computed(<Metadata>() => props.item?.metadata || []);

function isLink(): boolean {
  const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
  const matches = (typeof props.item?.key === 'string') ? props.item?.key?.match(regex) : null;

  return matches !== null;
}

</script>

<style scoped>

.nested-metadata {
  margin-left: 8px;
  margin-top: 2.5px;
}

</style>
