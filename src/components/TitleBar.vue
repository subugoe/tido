<template>
  <div class="flex">
    <h1
      v-if="collectionTitle"
      class="text-h3 text-bold q-mb-none"
      :class="$q.dark.isActive ? 'text-light' : 'text-dark'"
    >
      {{ collectionTitle }}
    </h1>
  </div>
</template>

<script>
import { fasChevronRight } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Titlebar',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    collectionTitle() {
      return this.$store.getters['contents/collectionTitle'];
    },
  },
  created() {
    this.fasChevronRight = fasChevronRight;
  },
};
</script>
