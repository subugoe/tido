<template>
  <div :class="[ css.metadata, css.fixed ]">
    <ul>
      <li v-if="Object.keys(collection).length" :class="css.item">
        <div :class="[ css.headingstyle, css.heading ]">
          Collection
        </div>
        <div :class="css.label">
          Title:
        </div>
        <div :class="css.description">
          {{ collection.title ? collection.title[0].title : '' }}
        </div>
        <div :class="css.label">
          Collector:
        </div>
        <div :class="css.description">
          {{ collection.collector ? collection.collector.name : '' }}
        </div>
        <div :class="css.label">
          Description:
        </div>
        <div :class="css.description">
          {{ collection.description }}
        </div>
      </li>

      <li :class="css.item">
        <div :class="[ css.headingstyle, css.heading ]">
          Manifest {{ sequenceindex + 1 }} / {{ manifests.length }}
        </div>
        <div :class="css.label">
          Label:
        </div>
        <div :class="css.description">
          {{ manifesttitle }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Metadata',
  props: {
    collection: Object,
    manifests: Array,
  },
  data() {
    return {
      css: {
        description: 'objectlist-1__descr',
        fixed: 'objectlist-1--fixed',
        heading: 'objectlist-1__heading',
        headingstyle: 'heading-style--4',
        item: 'objectlist-1__item',
        label: 'objectlist-1__label',
        metadata: 'objectlist-1',
      },
      sequenceindex: 0,
    };
  },
  computed: {
    manifesttitle() {
      return this.manifests[this.sequenceindex].label;
    },
  },
  mounted() {
    this.$root.$on('update-metadata', (index) => {
      this.sequenceindex = index;
    });
  },
};
</script>
