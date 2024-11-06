<template>
  <div data-cy="message-box">
    <div class="t-flex t-items-center t-justify-center">
      <BaseIcon
        :class="`t-text-${color}`"
        :name="type"
        class="t-pr-2"
      />
      <span class="t-font-bold t-align-middle">{{ title || message }}</span>
    </div>
    <div
      v-if="title"
      class="t-text-center t-mt-2 t-text-sm dark:t-text-gray-400"
    >
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <span v-html="message" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import BaseIcon from '@/components/base/BaseIcon.vue';

const props = defineProps({
  message: {
    type: String,
    default: () => '',
  },
  title: String,
  type: {
    type: String,
    default: () => '',
  },
});
const configStore = useConfigStore();

const config = computed(() => configStore.config);
const notificationColors = computed(() => config.value.notificationColors);
const color = computed(() => {
  switch (props.type) {
    case 'info':
      return notificationColors.value?.info ? notificationColors.value.info : '';
    case 'warning':
      return notificationColors.value?.warning ? notificationColors.value.warning : '';
    default:
      return '';
  }
});
</script>
