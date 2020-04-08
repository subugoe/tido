<template>
  <div :class="[ css['metadata'], css['fixed'] ]">
    <ul>
      <li v-if="Object.keys(collection).length" :class="css.item">
        <div :class="[ 'heading-style--4', css.heading ]">
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
        <div :class="[ 'heading-style--4', css.heading ]">
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
import { cssmap } from '@/mixins/navigation';

export default {
  name: 'Metadata',
  props: {
    collection: Object,
    manifests: Array,
  },
  data() {
    return {
      css: cssmap,
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
