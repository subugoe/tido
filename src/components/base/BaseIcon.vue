<script setup>
import { getIcon } from '@/utils/icons';

const props = defineProps(['name']);
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
