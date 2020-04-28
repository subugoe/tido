<template>
  <div class="">
    <h1 class="text-h5 text-bold text-uppercase">
      <language
        class="q-pr-md" />
      <span>{{ cut(collectiontitle) }}</span>
      <q-icon class="q-pb-sm" size="40px" :name="fasChevronRight" />
      <span>{{ cut(manifesttitle) }}</span>
      <q-icon class="q-pb-sm" size="40px" :name="fasChevronRight" />
      <span>{{ pagelabel }}</span>
    </h1>
  </div>
</template>

<script>
import { fasChevronRight } from '@quasar/extras/fontawesome-v5';
import Language from '@/components/language.vue';

export default {
  name: 'Infobar',
  components: {
    Language,
  },
  props: {
    collectiontitle: String,
    manifests: Array,
    pagelabel: String,
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

<style>
.language {
  display: inline;
}
</style>
