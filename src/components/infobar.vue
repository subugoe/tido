<template>
  <h1 class="text-h3 q-px-sm q-mb-md">
    <span>{{ cutstring(collectiontitle) }}</span>
    <q-icon
      :name="fasChevronRight"
      size="40px"
      class="q-pb-sm"
    />
    <span>{{ cutstring(manifesttitle) }}</span>
    <q-icon
      :name="fasChevronRight"
      size="40px"
      class="q-pb-sm"
    />
    <span>{{ cutstring(itemurl) }}</span>
  </h1>
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
  created() {
    this.fasChevronRight = fasChevronRight;
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
    cutstring(s) {
      return s.length > 30 ? `${s.substring(0, 26)} ...` : s;
    },
  },
  mounted() {
    this.$root.$on('update-metadata', (index) => {
      this.sequenceindex = index;
    });
  },
};
</script>
