<template>
  <BaseButton
    display="flat"
    rounded
    size="normal"
    class="dark:t-text-yellow-400 t-text-gray-400 hover:t-text-gray-500"
    :icon="isDark ? 'moon' : 'sun'"
    @click="toggleDark()"
  />
</template>
<script setup>
import { useToggle } from '@vueuse/core/index';
import { isDark } from '@/utils/is-dark';
import BaseButton from '@/components/base/BaseButton.vue';

const toggleDark = useToggle(isDark);
</script>
