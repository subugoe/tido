<template>
  <q-card
    bordered
    flat
  >
    <q-card-section class="text-center">
      <q-icon
        :color="color"
        :name="icon"
        class="q-pr-sm"
        size="sm"
      />
      <span class="text-body1 text-uppercase vertical-middle">{{ $t(titleKey) }}</span>
    </q-card-section>

    <q-separator inset />

    <q-card-section class="text-body2 text-center">
      {{ message }}
    </q-card-section>
  </q-card>
</template>

<script>
import {
  fasInfoCircle,
  fasExclamationTriangle,
} from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      default: () => '',
    },
    notificationColors: {
      type: Object,
      default: () => {},
    },
    titleKey: {
      type: String,
      default: () => '',
    },
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
          return fasInfoCircle;
        case 'warning':
          return fasExclamationTriangle;
        default:
          return '';
      }
    },
  },
};
</script>
