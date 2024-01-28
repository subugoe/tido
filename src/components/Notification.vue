<template>
  <div>
    <div class="t-text-center">
      <BaseIcon
        :class="`t-text-${color}`"
        :name="type"
        class="t-pr-2"
      />
      <span class="t-font-bold t-align-middle">{{ title || message }}</span>
    </div>

    <div class="text-body2 text-center t-mt-2" v-if="title">
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <span v-html="message" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
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
const store = useStore();

const config = computed(() => store.getters['config/config']);
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
