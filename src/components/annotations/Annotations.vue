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
    unsubscribe: null
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
    activeAnnotations() {
      return this.$store.getters['annotations/activeAnnotations'];
    },
    filteredAnnotations() {
      return this.$store.getters['annotations/filteredAnnotations'];
    },
    activeContentUrl() {
      return this.$store.getters['contents/activeContentUrl'];
    },
    update() {
      return this.annotations !== null && this.activeContentUrl !== null && this.filteredAnnotations.length > 0;
    }
  },
  watch: {
    annotations: {
     async handler(value) {
        if (value)
          // this.$store.dispatch('annotations/setFilteredAnnotations', this.types); {
          console.log('fitleriiiiiing')
          await this.$store.dispatch('annotations/setFilteredAnnotations', this.types);
      },
      immediate: true
    },
    update: {
      handler(value) {
        if (value)
        // this.$store.dispatch('annotations/setFilteredAnnotations', this.types);
        this.highlightTargetsLevel0();
      }
    }
  },
  async mounted() {
    console.log(this.types);
    // await this.$store.dispatch('annotations/setFilteredAnnotations', this.types);
    //
    // this.unsubscribe = this.$store.subscribeAction(async (action) => {
    //   if (action.type === 'contents/updateContentDOM') {
    //     console.log('updateDOM');
    //     await this.$store.dispatch('annotations/addHighlightClickListeners');
    //
    //   }
    // });
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
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
      console.log(this.filteredAnnotations);
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
