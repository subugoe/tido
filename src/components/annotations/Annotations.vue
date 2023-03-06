<template>
  <div class="q-px-md q-pt-md">
    <AnnotationsList
      v-if="filteredAnnotations.length"
      class="custom-font"
      :active-annotation="activeAnnotations"
      :config="config"
      :configured-annotations="filteredAnnotations"
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
import * as AnnotationUtils from '@/utils/annotations';

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
      return `${this.annotations !== null}|${this.annotations !== null ? this.annotations.length : 0}|${this.activeContentUrl}`;
    },
  },
  watch: {
    updateTextHighlighting: {
      async handler(contentData, oldContentData = '') {
        if (!contentData) return;

        const [hasAnnotations, amount, activeContentUrl] = contentData.split('|');
        const [oldHasAnnotations, oldAmount, oldActiveContentUrl] = oldContentData.split('|');

        const root = document.getElementById('text-content');

        // We need to run setFilteredAnnotations when the annotations have been loaded
        // and when the text content has changed.
        if (hasAnnotations !== 'true' && amount === 0 && activeContentUrl === 'null') return;
        this.$store.dispatch('annotations/setFilteredAnnotations', this.types);

        if (!root) return;
        this.$store.dispatch('annotations/addHighlightAttributesToText', root);

        if (oldActiveContentUrl !== activeContentUrl) {
          await this.$store.dispatch('annotations/addHighlightClickListeners');
          await this.$store.dispatch('annotations/addHighlightHoverListeners');
        }

        this.highlightTargetsLevel0();

      },
      immediate: true,
    },
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
  },
};
</script>

<style scoped>

</style>
