<template>
  <q-card
    bordered
    flat
  >
    <q-card-section class="text-center">
      <q-icon
        :name="fasInfoCircle"
        class="q-pr-sm"
        color="red-9"
        size="sm"
      />
      <span class="text-body1 text-uppercase vertical-middle">{{ $t('notificationTitle') }}</span>
    </q-card-section>

    <q-separator inset />

    <q-card-section class="text-body2 text-center">
      {{ message }}
    </q-card-section>
  </q-card>
</template>

<script>
import { fasInfoCircle } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {

    };
  },
  created() {
    this.fasInfoCircle = fasInfoCircle;
  },
};
</script>
