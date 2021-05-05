<template>
  <div class="panel__title text-center q-pb-sm q-pt-sm">
    {{ heading | capitalize }}
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
