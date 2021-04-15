<template>
  <div class="text-body1 text-weight-medium text-center q-pb-xs q-pt-xs">
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
