<template>
  <div class="row justify-center">
    <h1 class="col-12 col-auto q-px-sm text-h5 text-bold text-uppercase">
      <span>{{ cut(collectiontitle) }}</span>
      <q-icon class="q-pb-sm" size="40px" :name="fasChevronRight" />
      <span>{{ cut(manifesttitle) }}</span>
      <q-icon class="q-pb-sm" size="40px" :name="fasChevronRight" />
      <span>{{ cut(itemurl) }}</span>
    </h1>
  </div>
</template>

<script>
import { fasChevronRight } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Infobar',
  props: {
    collection: Object,
    itemurl: String,
    manifests: Array,
  },
  data() {
    return {
      sequenceindex: 0,
    };
  },
  computed: {
    collectiontitle() {
      return this.collection.title ? this.collection.title[0].title : 'Manifest';
    },
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
    this.$root.$on('update-metadata', (index) => {
      this.sequenceindex = index;
    });
  },
};
</script>
