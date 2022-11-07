<template>
  <q-inner-loading
    class="position-absolute"
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'"
    style="z-index: 1000"
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
