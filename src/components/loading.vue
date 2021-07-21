<template>
  <q-inner-loading
    :showing="loading"
  >
    <q-spinner
      size="3em"
      color="primary"
    />
  </q-inner-loading>
</template>

<script>

export default {
  name: 'Loading',
  props: {

  },
  data: () => ({
    loading: true,
  }),
};
</script>
