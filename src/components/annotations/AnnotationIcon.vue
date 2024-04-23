<template>
  <BaseIcon
    v-if="name"
    class="dark:text-gray-300 t-text-primary"
    :name="name"
  />
</template>

<script setup>
import BaseIcon from '@/components/base/BaseIcon.vue';

const props = defineProps({
  name: String,
});
</script>

<style scoped>

</style>
