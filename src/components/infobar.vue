<template>
  <div class="info-bar">
    <h1 class="info-bar__title text-h5 text-bold text-uppercase">
      <span>{{ cut(collectiontitle) }}</span>
      <!-- FIXME: Size is best set with Quasar'xs-xl -->
      <q-icon class="info-bar__icon q-pb-sm" size="40px" :name="fasChevronRight" />
      <span>{{ cut(manifesttitle) }}</span>
      <!-- FIXME: Size is best set with Quasar'xs-xl -->
      <q-icon class="info-bar__icon q-pb-sm" size="40px" :name="fasChevronRight" />
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

<style lang="scss" scoped>
.info-bar {
  background-color: $color-info-bar__background;
  @media (prefers-color-scheme: dark) {
    background-color: $color-info-bar__background--dark;
  }
}

.info-bar__title {
  color: $color-info-bar__title;
  @media (prefers-color-scheme: dark) {
    color: $color-info-bar__title--dark;
  }
}

.info-bar__icon {
  fill: $color-info-bar__icon;
  @media (prefers-color-scheme: dark) {
    fill: $color-info-bar__icon--dark;
  }
}
</style>
