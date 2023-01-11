<template>
  <q-inner-loading
    class="position-absolute"
    :class="getBackground()"
    style="z-index: 1000"
    :showing="true"
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
    background: String,
  },
  data: () => ({
    loading: true,
  }),
  methods: {
    getBackground() {
      if (!this.background) return this.$q.dark.isActive ? 'bg-grey-9' : 'bg-white';
      if (this.background === 'none') return 'bg-transparent';
      return this.background;
    },
  },
};
</script>
