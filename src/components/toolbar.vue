<template>
  <q-toolbar
    :class="$q.dark.isActive ? 'bg-black' : 'bg-grey-2'"
    >
    <q-toolbar-title class="text-h6 absolute-center">
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
