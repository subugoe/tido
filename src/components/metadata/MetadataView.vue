<template>
  <div class="metadata-view t-overflow-auto t-break-all t-px-4 t-pt-4">
    <component v-for="(documentType,i) in orderDocumentsMetadata" :is="resolveComponent(documentType)" :key="i"> </component>
  </div>
</template>

<script setup>


import { useConfigStore } from '@/stores/config';
import { resolveComponent } from 'vue';

defineProps({
  options: Object,
});

const orderDocumentsMetadata = useConfigStore().config.panels[0].views[1].connector.options.orderDocumentsMetadata


</script>

