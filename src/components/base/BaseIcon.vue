<script setup>
import { getIcon } from '@/utils/icons';

const props = defineProps(['name']);
</script>

<template>
  <i v-html="getIcon(name)"></i>
</template>
