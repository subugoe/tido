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
import { biInfoCircleFill, biExclamationTriangleFill } from '@quasar/extras/bootstrap-icons';

export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      default: () => '',
    },
    title: String,
    type: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {

    };
  },
  computed: {
    config() {
      return this.$store.getters['config/config'];
    },
    notificationColors() {
      return this.config.notificationColors;
    },
    color() {
      switch (this.type) {
        case 'info':
          return this.notificationColors?.info ? this.notificationColors.info : '';
        case 'warning':
          return this.notificationColors?.warning ? this.notificationColors.warning : '';
        default:
          return '';
      }
    },
    icon() {
      switch (this.type) {
        case 'info':
          return biInfoCircleFill;
        case 'warning':
          return biExclamationTriangleFill;
        default:
          return '';
      }
    },
  },
};
</script>
