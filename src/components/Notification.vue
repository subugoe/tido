<template>
  <div>
    <div class="text-center">
      <q-icon
        :color="color"
        :name="icon"
        class="q-pr-sm text-xs"
      />
      <span class="text-bold vertical-middle">{{ title || message }}</span>
    </div>

    <div class="text-body2 text-center q-mt-sm" v-if="title">
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <span v-html="message" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Notification',
};
</script>

<script setup>
import { biInfoCircleFill, biExclamationTriangleFill } from '@quasar/extras/bootstrap-icons';
import { computed } from 'vue';
import { useStore } from 'vuex';

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
const icon = computed(() => {
  switch (props.type) {
    case 'info':
      return biInfoCircleFill;
    case 'warning':
      return biExclamationTriangleFill;
    default:
      return '';
  }
});
</script>
