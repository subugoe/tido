<template>
  <q-icon
    v-if="name"
    :color="isDarkMode ? 'grey-1 text-grey-1' : 'primary'"
    :name="iconName"
    size="16px"
  />
</template>

<script setup>
import { computed } from 'vue';
import { Dark } from 'quasar';
import { isUrl } from '@/utils';
import { icon } from '@/utils/icon';

const props = defineProps({
  name: String,
});

const isDarkMode = computed(() => Dark.isActive);
const iconName = computed(() => (
  isUrl(props.name) ? `img:${props.name}` : getIcon(props.name)
));

function getIcon() {
  return icon(props.name);
}
</script>

<style scoped>

</style>
