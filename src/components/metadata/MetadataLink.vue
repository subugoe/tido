<template>
  <a
    :href="url"
    :title="text + '- open in a new tab or window'"
    rel="noopener noreferrer"
    target="_blank"
    class="content__link"
    :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
  >
    <span>{{ text }}</span>

    <q-icon
      :name="icon"
      size="12px"
      class="content__link-icon q-pl-xs"
    />
  </a>
</template>

<script>
export default {
  name: 'MetadataLink',
}
</script>

<script setup>
import { biBoxArrowUpRight } from '@quasar/extras/bootstrap-icons';

const props = defineProps({
  url: {
    type: String,
    default: () => '',
  },
  text: {
    type: String,
    default: () => '',
  },
});

const icon = biBoxArrowUpRight;
</script>

<style scoped>

</style>
