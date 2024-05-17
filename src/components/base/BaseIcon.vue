<script setup lang="ts">
import { getIcon } from '@/utils/icons';

//const props = defineProps(['name']);
export interface Props {
  name: string
}

const props = defineProps<Props>()
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
