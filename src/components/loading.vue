<template>
  <q-inner-loading
    :showing="loadingprogress"
  >
    <q-spinner
      size="3em"
      color="primary"
    />
  </q-inner-loading>
</template>

<script>

export default {
  name: 'LoadingProgress',
  props: {
    loadingprogress: {
      type: Boolean,
    },
    textcontentprogress: {
      type: Boolean,
    },
  },
  data: () => ({

  }),
};
</script>
