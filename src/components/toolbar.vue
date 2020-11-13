<template>
  <q-toolbar>
    <q-toolbar-title class="text-h6 absolute-center">
      {{ $t(heading) | capitalize }}
    </q-toolbar-title>
  </q-toolbar>
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
