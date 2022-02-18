<template>
  <span
    :style="{color: color}"
    @click="onClick"
  >{{ text }}</span>
</template>
<script>
export default {
  name: 'TextHighlight',
  props: {
    text: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      color: 'inherit',
    };
  },
  methods: {
    onClick() {
      this.color = 'red';
    },
  },
};
</script>

<style scoped>

</style>
