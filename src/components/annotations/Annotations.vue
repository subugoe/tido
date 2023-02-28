<template>
  <div class="q-px-md q-pt-md">
    <AnnotationsList
      v-if="items.length"
      class="custom-font"
      :active-annotation="activeAnnotations"
      :config="config"
      :configured-annotations="items"
      :toggle="toggle"
      :types="types"
    />
    <div v-else class="q-pa-md">
      <Notification
        :message="$t(message)"
        :notification-colors="config.notificationColors"
        :title="$t('no_annotations_available')"
        type="info"
      />
    </div>
  </div>
</template>

<script>
import AnnotationsList from '@/components/annotations/AnnotationsList.vue';
import Notification from '@/components/Notification.vue';

export default {
  name: 'Annotations',
  components: {
    AnnotationsList,
    Notification,
  },
  data: () => ({
    message: 'no_annotations_in_view',
  }),
  props: {
    url: String,
    items: Array,
    types: Array,
  },
  computed: {
    config() {
      return this.$store.getters['config/config'];
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
    // filteredAnnotations() {
    //   return this.$store.getters['annotations/filteredAnnotations'];
    // },
    activeContentUrl() {
      return this.$store.getters['contents/activeContentUrl'];
    },
    // updateTextHighlighting() {
    //   // We need to make sure that annotations are loaded (this.annotations),
    //   // the text HTML is present in DOM (this.activeContentUrl is set after DOM update)
    //   // and the annotation are filtered by type (this.filteredAnnotations).
    //   return `${this.annotations !== null}|${this.activeContentUrl}`;
    // },
  },
  // watch: {
  //   updateTextHighlighting: {
  //     handler(contentData) {
  //       if (contentData) {
  //         // const [hasAnnotations, activeContentUrl] = contentData.split('|');
  //         // console.log(hasAnnotations, activeContentUrl)
  //         // if (hasAnnotations === 'false' || activeContentUrl === 'null') return;
  //         // this.$store.dispatch('annotations/setFilteredAnnotations', this.types);
  //         // this.highlightTargetsLevel0();
  //       }
  //     },
  //     immediate: true,
  //   },
  // },
  mounted() {
    console.log('mounted', this.items)
    this.$store.dispatch('annotations/setFilteredAnnotations', this.items);
    // this.$store.dispatch('annotations/addHighlightAttributesToText');
    this.$store.dispatch('annotations/addInitialHighlighting');
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
  },
};
</script>

<style scoped>

</style>
