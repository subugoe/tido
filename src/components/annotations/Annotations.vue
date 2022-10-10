<template>
  <div>
    <AnnotationsList
      v-if="filteredAnnotations.length"
      class="custom-font"
      :active-annotation="activeAnnotations"
      :config="config"
      :configured-annotations="filteredAnnotations"
      :toggle="toggle"
      :types="types"
    />
  </div>
</template>

<script>
import AnnotationsToggles from "components/annotations/AnnotationsToggles";
import AnnotationsList from "components/annotations/AnnotationsList";
import AnnotationsOptions from "components/annotations/AnnotationsOptions";
import Loading from "components/Loading";
import Notification from "components/Notification";
import * as AnnotationUtils from 'src/utils/annotations';

export default {
  name: "Annotations",
  components: {
    AnnotationsToggles,
    AnnotationsList,
    AnnotationsOptions,
    Loading,
    Notification,
  },
  data: () => ({
  }),
  props: {
    url: String,
    types: Array
  },
  computed: {
    config() {
      return this.$store.getters ['config/config'];
    },
    annotations() {
      return this.$store.getters['annotations/annotations'];
    },
    item() {
      return this.$store.getters['contents/item'];
    },
    activeAnnotations() {
      return this.$store.getters['annotations/activeAnnotations'];
    },
    filteredAnnotations() {
      return this.$store.getters['annotations/filteredAnnotations'];
    },
    activeContentUrl() {
      return this.$store.getters['contents/activeContentUrl'];
    },
    updateTextHighlighting() {
      // We need to make sure that annotations are loaded (this.annotations),
      // the text HTML is present in DOM (this.activeContentUrl is set after DOM update)
      // and the annotation are filtered by type (this.filteredAnnotations).
      return (this.annotations !== null) + '|' + this.activeContentUrl;
    }
  },
  watch: {
    annotations: {
     async handler(value) {
      },
      immediate: true
    },
    updateTextHighlighting: {
      handler(value) {
        if (value) {
          const [hasAnnotations, activeContentUrl] = value.split('|');
          console.log('activeContentUrl', activeContentUrl);
          if (hasAnnotations !== 'true' && activeContentUrl === 'null') return;
          this.$store.dispatch('annotations/setFilteredAnnotations', this.types);
          this.highlightTargetsLevel0();
        }
      },
      immediate: true
    }
  },
  async mounted() {
    console.log('anno mounted');
  },
  beforeUnmount() {
    return this.$store.dispatch('annotations/resetAnnotations');
  },
  methods: {
    addAnnotation(id) {
      this.$store.dispatch('annotations/addActiveAnnotation', id);
    },
    removeAnnotation(id) {
      this.$store.dispatch('annotations/removeActiveAnnotation', id);
    },
    toggle({ id }) {
      const exists = !!this.activeAnnotations[id];
      if (exists) {
        this.removeAnnotation(id);
      } else {
        this.addAnnotation(id);
      }
    },
    highlightTargetsLevel0() {
      const mergedSelector = this.filteredAnnotations
        .reduce((acc, cur) => {
          const selector = AnnotationUtils.generateTargetSelector(cur);
          if (acc !== '') {
            acc += ',';
          }
          acc += selector;
          return acc;
        }, '');

      if (mergedSelector) {
        AnnotationUtils.highlightTargets(mergedSelector, { level: 0 });
      }
    },
  }
}
</script>

<style scoped>

</style>
