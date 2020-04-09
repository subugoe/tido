<template>
  <div class="sub-viewer-1__info">
    <div>
      {{ cutstring(collectiontitle) }}
      <img style="height: 32px; width: 32px;" src="statics/icons/angle-right--light.svg" />
      {{ cutstring(manifesttitle) }}
      <img style="height: 32px; width: 32px;" src="statics/icons/angle-right--light.svg" />
      {{ cutstring(itemurl) }}
    </div>
  </div>
</template>

<script>
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
