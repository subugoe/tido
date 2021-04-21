<template>
  <q-inner-loading
    :showing="treeloadingprogress || loadingprogress"
  >
    <q-spinner
      size="3em"
      color="primary"
    />

    <Notification :message="message" />
  </q-inner-loading>
</template>

<script>
import Notification from '@/components/notification.vue';

export default {
  name: 'LoadingProgress',
  components: {
    Notification,
  },
  props: {
    loadingprogress: {
      type: Boolean,
    },
    textcontentprogress: {
      type: Boolean,
    },
  },
  data: () => ({
    message: 'Loading, please wait…',
  }),
};
</script>
