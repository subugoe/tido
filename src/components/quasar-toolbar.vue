<template>
  <q-toolbar class="bg-grey-3">
    <q-toolbar-title class="text-bold">
      {{ heading | capitalize }}
    </q-toolbar-title>
  </q-toolbar>
</template>

<script>
export default {
  name: 'Toolbar',
  props: {
    heading: {
      type: String,
      required: true,
    },
  },
  filters: {
    capitalize(s) {
      return s.toUpperCase();
    },
  },
};
</script>
