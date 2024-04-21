<template>
  <div>
    <h4 v-if="!isLink()" class="t-font-semibold t-text-sm t-text-gray-400">
      {{ $t(label) }}
    </h4>
    <MetadataLink v-if="isLink()" :url="item.key" :text="item.value"/>
    <MetadataValue v-else :value="item.value" />
    <MetadataItem v-for="(childItem, idx) in childItems" :key="idx" :item="childItem"/>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import MetadataLink from '@/components/metadata/MetadataLink.vue';
import MetadataValue from '@/components/metadata/MetadataValue.vue';

const props = defineProps({
  item: Object,
});

const label = computed(() => props.item?.key || 'other');
const childItems = computed(() => props.item?.metadata || []);

function isLink() {
  const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
  const matches = props.item?.key?.match(regex) || null;

  return matches !== null;
}
</script>

<style scoped>

</style>
