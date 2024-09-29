<template>
    <BaseButton
        display="mono"
        icon="biCopy"
        icon-position="right"
        text="Copy citation"
        @click="copyContentToClipboard()"
        class="t-mt-[10px] t-ml-[20px]"
  />
    
</template>

<script setup lang="ts">

import BaseButton from '@/components/base/BaseButton.vue' 

const props = defineProps<{
  value: string,
}>();

async function copyContentToClipboard() {
  try {
    await navigator.clipboard.writeText(props.value);
  } catch (err) {
    console.error('Citation could not be copied in the keyboard')
  }
}

</script>

<style scoped>
</style>