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

<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';

export interface Props {
  url: string,
  text: string
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  text: ''
})

</script>
