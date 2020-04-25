<template>
  <div class="">
    <h1 class="text-h5 text-bold text-uppercase">
      <span>{{ cut(collectiontitle) }}</span>
      <q-icon class="q-pb-sm" size="40px" :name="fasChevronRight" />
      <span>{{ cut(manifesttitle) }}</span>
      <q-icon class="q-pb-sm" size="40px" :name="fasChevronRight" />
      <span>Page {{ itemindex + 1 }}</span>
    </h1>
  </div>
</template>

<script>
import { fasChevronRight } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Infobar',
  props: {
    collection: Object,
    manifests: Array,
  },
  data() {
    return {
      itemindex: 0,
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
    this.$root.$on('update-sequence-index', (index) => {
      this.sequenceindex = index;
    });

    this.$root.$on('update-item', (url) => {
      this.manifests[this.sequenceindex].sequence.forEach((item, index) => {
        if (item.id === url) {
          this.itemindex = index;
        }
      });
    });
  },
};
</script>
