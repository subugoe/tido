<template>
  <div class="item relative-position">
    <q-tabs
      :value="currentTab"
      active-color="$q.dark.isActive ? 'white' : 'accent'"
      align="justify"
      class="text-grey q-mb-sm"
      dense
      indicator-color="$q.dark.isActive ? 'white' : 'accent'"
    >
      <q-tab
        v-for="annotationTab in annotationTabs"
        :key="annotationTab.key"
        :class="{'disabled-tab': annotationTab.key === currentTab}"
        :label="$t(annotationTab.collectionTitle)"
        :name="annotationTab.key"
        @click="activeTab(annotationTab.key, annotationTab.type)"
      />
    </q-tabs>

    <AnnotationToggles />

    <Loading v-if="isLoading || isProcessing" />

    <AnnotationList
      v-else-if="filteredAnnotations.length && !isLoading && !isProcessing"
      class="custom-font"
      :active-annotation="activeAnnotation"
      :config="config"
      :configured-annotations="filteredAnnotations"
      :content-ids="contentIds"
      :get-icon="getIcon"
      :toggle="toggle"
    />

    <div
      v-else-if="!filteredAnnotations.length && !isLoading && !isProcessing"
      class="q-pa-sm"
    >
      <Notification
        :message="$t(isAnnotationTypeText ? messages.empty : messages.none)"
        :notification-colors="config.notificationColors"
        :title-key="isAnnotationTypeText ? 'commentsInfoTitle' : 'annotationInfoTitle'"
        type="info"
      />
    </div>

    <AnnotationOptions
      v-if="!isAnnotationTypeText"
      :selected-all="selectedAll"
      :selected-none="selectedNone"
      :on-highlight-all="onHighlightAll"
      :on-highlight-none="onHighlightNone"
    />
  </div>
</template>

<script>
import * as Icons from '@quasar/extras/fontawesome-v5';

import AnnotationToggles from '@/components/annotations/toggles.vue';
import AnnotationList from '@/components/annotations/list.vue';
import AnnotationOptions from '@/components/annotations/options.vue';

import Loading from '@/components/loading.vue';
import Notification from '@/components/notification.vue';

import * as AnnotationUtils from '@/utils';
import DomMixin from '@/mixins/dom';

export default {
  name: 'Annotations',
  components: {
    AnnotationToggles,
    AnnotationList,
    AnnotationOptions,
    Loading,
    Notification,
  },
  mixins: [DomMixin],
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    contentindex: {
      type: Number,
      default: () => 0,
    },
    contenttypes: {
      type: Array,
      default: () => [],
    },
    panels: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      messages: {
        none: 'noAnnotationMessage',
        empty: 'noCommentsMessage',
      },
    };
  },
  computed: {
    activeAnnotation() {
      return this.$store.getters['annotations/activeAnnotations'];
    },
    activeEntities() {
      return (Array.isArray(this.tabConfig[this.currentTab]) ? this.tabConfig[this.currentTab] : this.tabConfig[this.currentTab]?.type || []);
    },
    annotations() {
      return this.$store.getters['annotations/annotations'];
    },
    annotationTabs() {
      return AnnotationUtils.getAnnotationTabs(this.config);
    },
    annotationTypesMapping() {
      return this.config.annotations.types.reduce((prev, curr) => {
        prev[curr.contenttype] = {
          type: curr.annotationType || 'annotation',
          displayWhen: curr.displayWhen,
        };
        return prev;
      }, {});
    },
    contentIds() {
      return this.$store.getters['annotations/contentIds'];
    },
    currentTab() {
      return this.$store.getters['annotations/activeTab'];
    },
    filteredAnnotations() {
      if (!this.currentTab) {
        return [];
      }

      const output = this.annotations.filter(
        (x) => {
          const annotationContentType = this.annotationTypesMapping[x.body['x-content-type']];

          if (annotationContentType?.type === 'text' && annotationContentType?.displayWhen === this.contenttypes[this.contentindex]) {
            return this.activeEntities.includes(x.body['x-content-type']);
          }
          return this.activeEntities.includes(x.body['x-content-type']) && this.contentIds[x.targetId];
        },
      );

      return output;
    },
    isLoading() {
      return this.$store.getters['annotations/isLoading'];
    },
    isProcessing() {
      return this.$store.getters['annotations/isContentLoading'];
    },
    isAnnotationTypeText() {
      return this.activeEntities.some((x) => this.annotationTypesMapping[x]?.type === 'text');
    },
    selectedAll() {
      return this.$store.getters['annotations/isAllAnnotationSelected'](this.filteredAnnotations.length);
    },
    selectedNone() {
      return this.$store.getters['annotations/isNoAnnotationSelected'];
    },
    tabConfig() {
      return this.config.annotations.tabs;
    },
  },
  watch: {
    currentTab: {
      handler() {
        AnnotationUtils.highlightActiveContent(this.filteredAnnotations);
        this.handleTooltip();
      },
    },
    contentIds: 'onContentUpdate',
    filteredAnnotations: 'resetActiveAnnotations',
    panels: {
      handler(curr, prev) {
        const currentState = curr.find(
          (x) => x.panel_label === 'Annotations' && x.show,
        );
        const previousState = prev.find(
          (x) => x.panel_label === 'Annotations' && x.show,
        );

        if (currentState !== previousState) {
          this.resetActiveAnnotations();
          const annotations = this.findDomElements('[data-annotation-level]');

          if (currentState) {
            annotations.forEach((el) => el.setAttribute('data-annotation-level', 0));
          } else {
            annotations.forEach((el) => el.setAttribute('data-annotation-level', -1));
            this.findDomElements('[data-annotation-icon]').forEach((el) => el.remove());
          }
        }
      },
    },
  },
  mounted() {
    this.$store.dispatch('annotations/updateActiveTab', this.annotationTabs?.[0].key);
  },
  methods: {
    activeTab(key) {
      this.filteredAnnotations.forEach((x) => this.removeAnnotation(x, -1));
      this.$store.dispatch('annotations/updateActiveTab', key);
    },

    addAnnotation(annotation) {
      this.$store.dispatch('annotations/addActiveAnnotation', annotation);
      let selector = AnnotationUtils.stripTargetId(annotation, false);

      if (selector.startsWith('.')) {
        selector = selector.replace(/\./g, '');
      }

      const el = document.getElementById(selector) || document.querySelector(`.${selector}`);

      AnnotationUtils.updateHighlightState(selector, 'INC');
      if (el) {
        this.addIcon(el, annotation);
      }

      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },

    addIcon(element, annotation) {
      const contentType = annotation.body['x-content-type'];
      let foundSvg = false;

      [...element.children].forEach((el) => {
        if (el.nodeName === 'svg' && el.getAttribute('data-annotation-icon')) {
          foundSvg = true;
        }
      });

      if (foundSvg) {
        return;
      }
      try {
        const svg = AnnotationUtils.getAnnotationIcon(contentType, this.config.annotations.types);
        svg.setAttribute(
          'data-annotation-icon',
          AnnotationUtils.stripTargetId(annotation),
        );
        element.prepend(svg);
      } catch (err) {
        // error message
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

    handleTooltip() {
      const annotationIds = this.filteredAnnotations.reduce((prev, curr) => {
        let id = AnnotationUtils.stripTargetId(curr, false);
        if (id.startsWith('.')) {
          id = id.replace('.', '');
        }
        prev[id] = {
          value: curr.body.value,
          contentType: curr.body['x-content-type'],
        };
        return prev;
      }, {});

      document.querySelectorAll('[data-annotation]').forEach((el) => {
        const childOtherNodes = [...el.childNodes].filter((x) => x.nodeName !== '#text').length;

        if (!childOtherNodes) {
          const classNames = [];
          el = AnnotationUtils.backTrackNestedAnnotations(el, classNames);
          const annotationClasses = [];

          // checks for duplicate class names.
          classNames
            .join(' ')
            .split(' ')
            .map((x) => annotationIds[x])
            .filter((x) => x)
            .reduce((prev, curr) => {
              if (!prev[curr.value]) {
                prev[curr.value] = true;
                annotationClasses.push(curr);
              }

              return prev;
            }, {});

          if (annotationClasses.length) {
            el.addEventListener('mouseenter', () => this.onMouseHover(el, annotationClasses), false);
            el.addEventListener('mouseout', () => this.onMouseOut(), false);
          }
        }
      });
    },
    onContentUpdate(ids) {
      try {
        if (this.isLoading || this.isProcessing) {
          setTimeout(() => this.onContentUpdate(ids), 100);
          return;
        }

        AnnotationUtils.highlightActiveContent(this.filteredAnnotations);

        this.handleTooltip();
      } catch (err) {
        setTimeout(() => this.onContentUpdate(ids), 100);
      }
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

    onMouseHover(el, annotationClasses) {
      AnnotationUtils.onlyIf(
        AnnotationUtils.isAnnotationSelected(el),
        AnnotationUtils.createTooltip.bind(this, el, annotationClasses, this.config),
      );
    },

    onMouseOut() {
      this.findDomElements('.annotation-tooltip').forEach((el) => el.remove());
    },

    removeIcon(annotation) {
      const stripeId = AnnotationUtils.stripTargetId(annotation);
      const el = document
        .querySelector(`svg[data-annotation-icon='${stripeId}']`);

      if (el) {
        el.remove();
      }
    },

    removeAnnotation(annotation, level) {
      if (!this.contentIds[annotation.targetId]) {
        return;
      }
      this.$store.dispatch('annotations/removeActiveAnnotation', annotation);
      let selector = AnnotationUtils.stripTargetId(annotation, false);

      if (selector.startsWith('.')) {
        selector = selector.replace(/\./g, '');
      }

      AnnotationUtils.updateHighlightState(selector, 'DEC', level);
      this.removeIcon(annotation);
    },

    resetActiveAnnotations() {
      return this.$store.dispatch('annotations/resetActiveAnnotations');
    },

    toggle(annotation) {
      if (!this.contentIds[annotation.targetId]) {
        return;
      }
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

  @media (prefers-color-scheme: dark) {
    background-color: $grey-9;
  }
}

*[data-annotation-level='1'],
*[data-annotation-level='1'] * {
  background-color: $blue-1;
  border-bottom: 1px solid #000;

  @media (prefers-color-scheme: dark) {
    background-color: $blue-grey-7;
    border-bottom: 1px solid #fff;
    color: $light;
  }
}

*[data-annotation-level='2'],
*[data-annotation-level='2'] * {
  background-color: $blue-2;
  border-bottom: 1px solid #000;

  @media (prefers-color-scheme: dark) {
    background-color: $blue-grey-8;
    border-bottom: 1px solid #fff;
    color: $light;
  }
}

*[data-annotation-level='3'],
*[data-annotation-level='3'] * {
  background-color: $blue-3;
  border-bottom: 1px solid #000;

  @media (prefers-color-scheme: dark) {
    background-color: $blue-grey-9;
    border-bottom: 1px solid #fff;
    color: $light;
  }
}

*[data-annotation-level='4'],
*[data-annotation-level='4'] * {
  background-color: $blue-4;
  border-bottom: 1px solid #000;

  @media (prefers-color-scheme: dark) {
    background-color: $blue-grey-10;
    border-bottom: 1px solid #fff;
    color: $light;
  }
}

*[data-annotation-level='5'],
*[data-annotation-level='5'] * {
  background-color: $blue-5;
  border-bottom: 1px solid #000;

  @media (prefers-color-scheme: dark) {
    background-color: #1f2937;
    border-bottom: 1px solid #fff;
    color: $light;
  }
}

.annotation-tooltip {
  background-color: $grey-2 !important;
  box-shadow: $shadow-1;
  color: #000 !important;
  font-size: 14px;
  left: 0;
  opacity: 0;
  padding: 8px;
  position: absolute;
  text-decoration: none !important;
  top: 0;
  transition: opacity 0.5s;
  width: 240px;
  z-index: 10000;
}

.annotation-tooltip {
  -webkit-touch-callout: none;
}

.annotation-animated-tooltip {
  opacity: 1;
}

.referenced-annotation {
  display: block;
  margin-bottom: 4px;
}

.referenced-annotation:first-of-type {
  padding-top: 4px;
}

.referenced-annotation:last-of-type {
  margin-bottom: 0;
}

</style>

<style lang="scss" scoped>
.item {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.disabled-tab {
  pointer-events: none;
}
</style>
