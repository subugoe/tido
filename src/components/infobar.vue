<template>
  <div class="sub-viewer-1__info">
    <div v-html="breadcrumbs"></div>
  </div>
</template>

<script>
export default {
  name: 'Infobar',
  props: {
    collection: Object,
    itemurl: String,
    manifests: Array,
    vectors: Object,
  },
  data() {
    return {
      sequenceindex: 0,
    };
  },
  computed: {
    breadcrumbs() {
      return this.cutstring(this.collectiontitle)
        + this.vectors['angle-right']
        + this.cutstring(this.manifesttitle)
        + this.vectors['angle-right']
        + this.cutstring(this.itemlabel);
    },
    collectiontitle() {
      return this.collection.title ? this.collection.title[0].title : 'Manifest';
    },
    manifesttitle() {
      return this.manifests[this.sequenceindex].label;
    },
    itemlabel() {
      return this.itemurl.replace(/.*(\d)+\/(\d)+.*/, 'Item $1-$2');
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
