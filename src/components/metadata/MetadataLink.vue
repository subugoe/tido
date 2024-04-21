<template>
  <a
    :href="url"
    :title="text + '- open in a new tab or window'"
    rel="noopener noreferrer"
    target="_blank"
    class="content__link t-text-primary dark:t-text-gray-200"
  >
    <span>{{ text }}</span>

    <BaseIcon
      name="externalLink"
      class="content__link-icon t-pl-1 t-text-[12px]"
    />
  </a>
</template>

<script setup>
import BaseIcon from '@/components/base/BaseIcon.vue';

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

</script>
