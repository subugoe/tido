<template>
  <BaseIcon
    v-if="name"
    :color="isDarkMode ? 'grey-1 text-grey-1' : 'primary'"
    :name="name"
    size="16px"
  />
</template>

<script setup>
import { computed } from 'vue';
import { Dark } from 'quasar';
import { isUrl } from '@/utils';
import { getIcon } from '@/utils/icons';
import BaseIcon from '@/components/base/BaseIcon.vue';

const props = defineProps({
  name: String,
});

const isDarkMode = computed(() => Dark.isActive);
// const iconName = computed(() => (
//   isUrl(props.name) ? `img:${props.name}` : getIcon(props.name)
// ));
</script>

<style scoped>

</style>
