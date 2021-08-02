<template>
  <div class="item relative-position">
    <q-tabs
      v-model="currentTab"
      active-color="$q.dark.isActive ? 'white' : 'accent'"
      align="justify"
      class="text-grey q-mb-sm"
      dense
      indicator-color="$q.dark.isActive ? 'white' : 'accent'"
    >
      <q-tab
        v-for="annotationTab in annotationTabs"
        :key="annotationTab.key"
        :label="$t(annotationTab.collectionTitle)"
        :name="annotationTab.key"
        @click="activeTab(annotationTab.key, annotationTab.type)"
      />
    </q-tabs>

    <AnnotationToggles />

    <Loading v-if="!isloading || isProcessing" />

    <AnnotationList
      v-else-if="filteredAnnotations.length && isloading && !isProcessing"
      class="custom-font"
      :active-annotation="activeAnnotation"
      :configured-annotations="filteredAnnotations"
      :content-ids="contentIds"
      :get-icon="getIcon"
      :toggle="toggle"
    />

    <div
      v-else-if="!filteredAnnotations.length && isloading && !isProcessing"
      class="q-pa-sm"
    >
      <Notification
        :message="$t(messages.none)"
        :notification-colors="config.notificationColors"
        title-key="annotationInfoTitle"
        type="info"
      />
    </div>

    <AnnotationOptions
      :selected-all="selectedAll"
      :selected-none="selectedNone"
      :on-highlight-all="onHighlightAll"
      :on-highlight-none="onHighlightNone"
    />
  </div>
</template>

<script>
import * as Icons from '@quasar/extras/fontawesome-v5';

import Annotation from '@/mixins/annotation';
import AnnotationToggles from '@/components/annotations/toggles.vue';
import AnnotationList from '@/components/annotations/list.vue';
import AnnotationOptions from '@/components/annotations/options.vue';

import Loading from '@/components/loading.vue';
import Notification from '@/components/notification.vue';

export default {
  name: 'Annotations',
  components: {
    AnnotationToggles,
    AnnotationList,
    AnnotationOptions,
    Loading,
    Notification,
  },
  mixins: [Annotation],
  props: {
    annotations: {
      type: Array,
      default: () => [],
    },
    isloading: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default: () => {},
    },
    panels: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      configuredAnnotations: [],
      activeAnnotation: {},
      contentIds: {},
      currentTab: '',
      ids: [],
      isProcessing: false,
      messages: {
        none: 'noAnnotationMessage',
      },
    };
  },
  computed: {
    annotationTabs() {
      return Object.entries(this.tabConfig)
        .map(([key, type]) => ({
          key,
          collectionTitle: key,
          type,
        }))
        .filter((el) => this.annotations.find((x) => el.type.includes(x.body['x-content-type'])));
    },
    annotationTabConfig() {
      return this.config?.annotations?.tabs || {};
    },
    configuredTypes() {
      return this.config.annotations.types.map((type) => type.contenttype);
    },
    currentAnnotations() {
      const contentType = this.annotationTabs.find(
        (collection) => collection.key === this.currentTab,
      );

      if (!contentType) {
        return [];
      }

      const annotationType = this.configuredAnnotations.filter(
        (annotationCollection) => contentType.type.includes(annotationCollection.body['x-content-type']),
      );

      return this.sortAnnotation(annotationType);
    },
    filteredAnnotations() {
      if (!this.currentTab) {
        return [];
      }
      const output = this.annotations.filter(
        (x) => this.tabConfig[this.currentTab].includes(x.body['x-content-type'])
          && this.contentIds[x.targetId],
      );

      return this.sortAnnotation(output);
    },
    selectedAll() {
      return (
        Object.keys(this.activeAnnotation).length
        === this.filteredAnnotations.length
      );
    },
    selectedNone() {
      return !Object.keys(this.activeAnnotation).length;
    },
    tabConfig() {
      return this.config.annotations.tabs;
    },
  },
  watch: {
    filteredAnnotations: {
      handler() {
        this.activeAnnotation = {};
      },
      immediate: true,
    },
    panels: {
      handler(curr, prev) {
        const currentState = curr.find(
          (x) => x.panel_label === 'Annotations' && x.show,
        );
        const previousState = prev.find(
          (x) => x.panel_label === 'Annotations' && x.show,
        );

        if (currentState !== previousState) {
          this.activeAnnotation = {};

          if (currentState) {
            [
              ...document.querySelectorAll('[data-annotation-level]'),
            ].forEach((el) => el.setAttribute('data-annotation-level', 0));
          } else {
            [
              ...document.querySelectorAll('[data-annotation-level]'),
            ].forEach((el) => el.setAttribute('data-annotation-level', -1));

            [
              ...document.querySelectorAll('[data-annotation-icon]'),
            ].forEach((el) => el.remove());
          }
        }
      },
    },
  },
  mounted() {
    this.$root.$on('update-annotations', this.onContentUpdate);
    this.$root.$on('update-annotation-loading', (isProcessing) => {
      this.isProcessing = !!isProcessing;
    });
  },
  methods: {
    activeTab(key) {
      if (this.currentTab === key) {
        return;
      }

      this.filteredAnnotations.forEach((x) => this.removeAnnotation(x, -1));

      this.currentTab = key;

      this.highlightActiveContent(this.filteredAnnotations);
    },

    addAnnotation(annotation) {
      const updated = { ...this.activeAnnotation };
      let selector = this.stripTargetId(annotation, false);

      if (selector.startsWith('.')) {
        selector = selector.replace(/\./g, '');
      }

      this.updateHighlightState(selector, 'INC');
      this.addIcon(document.getElementById(selector) || document.querySelector(`.${selector}`), annotation);
      updated[annotation.targetId] = true;

      this.activeAnnotation = updated;
    },

    addIcon(element, annotation) {
      const contentType = annotation.body['x-content-type'];
      try {
        const svg = this.createSVG(this.getIconName(contentType));
        svg.setAttribute(
          'data-annotation-icon',
          this.stripTargetId(annotation),
        );
        element.prepend(svg);
      } catch (err) {
        // TODO : Handle Here
      }
    },

    createSVG(name) {
      const [path, viewBox] = Icons[name].split('|');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('class', 'q-icon q-mx-xs');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('role', 'presentation');
      svg.setAttribute('viewBox', viewBox);

      const newPath = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
      );

      newPath.setAttribute('d', path);
      svg.appendChild(newPath);

      return svg;
    },

    onContentUpdate(ids) {
      try {
        this.currentTab = this.annotationTabs[0].key;
        this.contentIds = ids;
        this.highlightActiveContent(this.filteredAnnotations);
      } catch (err) {
        setTimeout(() => this.onContentUpdate(ids), 100);
      }
    },

    getIcon(contentType) {
      return Icons[this.getIconName(contentType)];
    },

    getIconName(contentType) {
      return this.config.annotations.types.filter(
        (annotation) => annotation.contenttype === contentType,
      )[0].icon;
    },

    onHighlightAll() {
      this.filteredAnnotations.forEach(
        (annotation) => !this.activeAnnotation[annotation.targetId]
          && this.addAnnotation(annotation),
      );
    },

    onHighlightNone() {
      this.filteredAnnotations.forEach(
        (annotation) => this.activeAnnotation[annotation.targetId]
          && this.removeAnnotation(annotation),
      );
    },

    removeIcon(annotation) {
      const stripeId = this.stripTargetId(annotation);
      const el = document
        .querySelector(`svg[data-annotation-icon='${stripeId}']`);

      if (el) {
        el.remove();
      }
    },

    removeAnnotation(annotation, level) {
      const updated = { ...this.activeAnnotation };
      let selector = this.stripTargetId(annotation, false);

      if (selector.startsWith('.')) {
        selector = selector.replace(/\./g, '');
      }

      this.updateHighlightState(selector, 'DEC', level);
      this.removeIcon(annotation);
      delete updated[annotation.targetId];
      this.activeAnnotation = updated;
    },

    toggle(annotation) {
      const exists = !!this.activeAnnotation[annotation.targetId];
      if (exists) {
        this.removeAnnotation(annotation);
      } else {
        this.addAnnotation(annotation);
      }
    },
  },
};
</script>

<style lang="scss">
/* not in scope to style the text */
.annotation {
  background-color: $grey-4;
  border-bottom: 1px solid;
  /**
  * adding a linting exception here,
  * because 1px is invalid, but needed here
  * adding a global rule for this would introduce unnecessary error proneness
  */
  /* stylelint-disable */
  margin: 0 1px;
  padding: 1px 1px 2px 1px;
  /* stylelint-enable */
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    background-color: $grey-9;
  }
}

.annotation-disabled {
  border-bottom: 0;
  padding-bottom: inherit;
}

.annotation-disabled-overlap {
  border-bottom: 1px;
  border-bottom-style: dotted !important;
  padding-bottom: inherit;
}

.annotation-disabled > svg {
  display: none;
}

*[data-annotation-level='0'] {
  background-color: $grey-3;
}

*[data-annotation-level='1'],
*[data-annotation-level='1'] * {
  background-color: $blue-1;
  border-bottom: 1px solid #000;
}

*[data-annotation-level='2'],
*[data-annotation-level='2'] * {
  background-color: $blue-2;
  border-bottom: 1px solid #000;
}

*[data-annotation-level='3'],
*[data-annotation-level='3'] * {
  background-color: $blue-3;
  border-bottom: 1px solid #000;
}

*[data-annotation-level='4'],
*[data-annotation-level='4'] * {
  background-color: $blue-4;
  border-bottom: 1px solid #000;
}

*[data-annotation-level='5'],
*[data-annotation-level='5'] * {
  background-color: $blue-5;
  border-bottom: 1px solid #000;
}
</style>

<style lang="scss" scoped>
.item {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
