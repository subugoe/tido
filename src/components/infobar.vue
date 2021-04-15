<template>
  <div>
    <h1 class="text-h5 text-bold text-uppercase q-mb-none q-mt-xs">
      {{ collectiontitle }}
    </h1>
    <h2 class="text-h6 text-bold text-uppercase q-mt-none q-mb-none">
      <span>{{ manifesttitle }}</span>
      <q-icon
        class="q-pb-xs q-pl-sm q-pr-sm"
        size="xs"
        :color="$q.dark.isActive ? 'white' : 'accent'"
        :name="fasChevronRight"
      />
      <span>Sheet {{ item.n }}</span>
    </h2>
  </div>
</template>

<script>
import { fasChevronRight } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Infobar',
  props: {
    collectiontitle: {
      type: String,
      default: () => '',
    },
    item: {
      type: Object,
      default: () => {},
    },
    manifests: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      sequenceindex: 0,
    };
  },
  computed: {
    manifesttitle() {
      return this.manifests[this.sequenceindex].label;
    },
  },
  created() {
    this.fasChevronRight = fasChevronRight;
  },
  mounted() {
    this.$root.$on('update-sequence-index', (index) => {
      this.sequenceindex = index;
    });
  },
};
</script>
