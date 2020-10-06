<template>
  <div>
    <h1 class="text-h5 text-bold text-uppercase">
      <span>{{ cut(collectiontitle) }}</span>
      <q-icon
        class="q-pb-xs"
        size="sm"
        :name="fasChevronRight"
        />
      <span>{{ cut(manifesttitle) }}</span>
      <q-icon
        class="q-pb-xs"
        size="sm"
        :name="fasChevronRight"
        />
      <span>{{ itemlabel }}</span>
    </h1>
  </div>
</template>

<script>
import { fasChevronRight } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Infobar',
  props: {
    collectiontitle: String,
    itemlabel: String,
    manifests: Array,
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
  methods: {
    cut(s) {
      return s.length > 30 ? `${s.substring(0, 26)} ...` : s;
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
