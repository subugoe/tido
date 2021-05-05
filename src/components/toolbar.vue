<template>
  <div class="text-body1 text-weight-medium text-center q-pb-xs q-pt-xs">
    {{ $t(heading) | capitalize }}
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
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
};
</script>

<style lang="scss" scoped>
.panel__title {
  color: var(--q-color-primary);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 2px;
}
</style>
