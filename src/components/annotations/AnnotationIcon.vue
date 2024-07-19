<template>
  <BaseIcon
    v-if="name"
    class="dark:text-gray-300 t-text-primary"
    :name="name"
  />
</template>

<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';

interface Props {
  name: string
}

defineProps<Props>();

</script>
