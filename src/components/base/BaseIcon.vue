<script setup lang="ts">
import { getIcon } from '@/utils/icons';

export interface Props {
  name: string
}

defineProps<Props>();
</script>

<template>
  <i v-html="getIcon(name)"></i>
</template>

<style lang="scss">
i {
  svg {
    display: inherit;
  }
}
</style>
