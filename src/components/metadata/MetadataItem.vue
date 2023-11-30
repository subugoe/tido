<template>
  <div>
    <q-item-label v-if="!isLink()" overline class="text-uppercase">
      {{ $t(label) }}
    </q-item-label>
    <MetadataLink v-if="isLink()" :url="item.key" :text="item.value"/>
    <MetadataValue v-else :value="item.value" />
    <MetadataItem v-for="(childItem, idx) in childItems" :key="idx" :item="childItem"/>
  </div>
</template>

<script setup>
import MetadataLink from '@/components/metadata/MetadataLink.vue';
import MetadataValue from '@/components/metadata/MetadataValue.vue';

import { computed } from 'vue';

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
