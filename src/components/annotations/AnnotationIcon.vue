<template>
  <BaseIcon
    v-if="name"
    class="dark:text-gray-300 text-primary"
    :name="name"
    size="16px"
  />
</template>

<script setup>
import BaseIcon from '@/components/base/BaseIcon.vue';

const props = defineProps({
  name: String,
});

// const iconName = computed(() => (
//   isUrl(props.name) ? `img:${props.name}` : getIcon(props.name)
// ));
</script>

<style scoped>

</style>
