<template>
  <div class="text-body1 text-weight-medium text-center t-pb-1 t-pt-1">
    {{ capitalizeHeading }}
  </div>
</template>

<script>
export default {
  name: 'ToolBar',
  filters: {
    capitalize(s) {
      return s.toUpperCase();
    },
  },
  props: {
    heading: {
      type: String,
      required: true,
    },
  },
  computed: {
    capitalizeHeading() {
      return this.$t(this.heading).toUpperCase();
    },
  },
};
</script>

<style lang="scss" scoped>
.panel__title {
  color: var(--q-primary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
}
</style>
