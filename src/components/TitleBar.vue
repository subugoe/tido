<template>
  <div>
    <h1
      v-if="collectionTitle"
      class="text-h3 text-bold q-mb-none"
      :class="$q.dark.isActive ? 'text-light' : 'text-dark'"
    >
      {{ collectionTitle }}
    </h1>

    <h2 class="text-h4 text-bold q-mt-none q-mb-none" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
      <span>{{ manifestTitle }}</span>
      <q-icon
        class="q-pl-sm q-pr-sm"
        size="xs"
        :color="$q.dark.isActive ? 'white' : 'accent'"
        :name="fasChevronRight"
      />
      <span>{{ $t('Sheet') }} {{ item.n }}</span>
    </h2>
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
    manifestTitle() {
      return this.$store.getters['contents/manifest']?.label;
    },
  },
  created() {
    this.fasChevronRight = fasChevronRight;
  },
};
</script>
