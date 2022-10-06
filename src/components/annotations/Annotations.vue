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
    activeAnnotations() {
      return this.$store.getters['annotations/activeAnnotations'];
    },
    filteredAnnotations() {
      return this.$store.getters['annotations/filteredAnnotations'];
    },
  },
  async mounted() {
    console.log('annotations mounted');
    const root = document.getElementById('text-content');

    await this.$store.dispatch('annotations/setFilteredAnnotations', this.types);

    this.unsubscribe = this.$store.subscribeAction(async (action) => {
      if (action.type === 'contents/updateContentDOM') {
        console.log('updateDOM');
        await this.$store.dispatch('annotations/addHighlightAttributesToText', root);
        await this.$store.dispatch('annotations/addHighlightClickListeners');
        await this.$store.dispatch('annotations/setFilteredAnnotations', this.types);
      }
    });
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
  }
}
</script>

<style scoped>

</style>
