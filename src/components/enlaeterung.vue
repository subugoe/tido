<template>
  <div>
    <p class="text-h6">
      Erlaeuterung Data
    </p>

    <p>
      {{ annotation.body.value }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Erlaeuterung',
  props: {
    annotation: {
      type: Object,
      default: () => {},
    },
  },
  created() {

  },
};
</script>
