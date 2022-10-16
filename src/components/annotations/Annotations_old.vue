<template>
  <div class="item relative-position">
    <q-tabs
      :model-value="currentTab"
      active-color="$q.dark.isActive ? 'white' : 'primary'"
      align="justify"
      class="text-grey q-mb-sm"
      dense
      indicator-color="$q.dark.isActive ? 'white' : 'primary'"
    >
      <q-tab
        v-for="annotationTab,index in annotationTabs"
        :key="annotationTab.key"
        :class="{'disabled-tab': annotationTab.key === currentTab}"
        :label="$t(annotationTab.collectionTitle)"
        :name="annotationTab.key"
        @click="switchActiveTab(annotationTab.key, index)"
      />
    </q-tabs>

    <AnnotationsToggles />

    <Loading v-if="isLoading || isProcessing" />

    <AnnotationsList
      v-else-if="filteredAnnotations.length && !isLoading && !isProcessing"
      class="custom-font"
      :active-annotation="activeAnnotation"
      :config="config"
      :configured-annotations="filteredAnnotations"
      :toggle="toggle"
    />

    <div
      v-else-if="!filteredAnnotations.length && !isLoading && !isProcessing"
      class="q-pa-sm"
    >
      <Notification
        :message="$t(isAnnotationTypeText ? messages.empty : messages.none)"
        :notification-colors="config.notificationColors"
        :title-key="isAnnotationTypeText ? 'no_comments_available' : 'no_annotations_available'"
        type="info"
      />
    </div>

    <AnnotationsOptions
      v-if="!isAnnotationTypeText"
      :selected-all="selectedAll"
      :selected-none="selectedNone"
      :on-highlight-all="onHighlightAll"
      :on-highlight-none="onHighlightNone"
    />
  </div>
</template>

<script>
import { onlyIf } from 'src/utils';
import AnnotationsToggles from '@/components/annotations/AnnotationsToggles.vue';
import AnnotationsList from '@/components/annotations/AnnotationsList.vue';
import AnnotationsOptions from '@/components/annotations/AnnotationsOptions.vue';

import Loading from '@/components/Loading.vue';
import Notification from '@/components/Notification.vue';

import * as AnnotationUtils from '@/utils/annotations';
import DomMixin from '@/mixins/dom';

export default {
  components: {
    AnnotationsToggles,
    AnnotationsList,
    AnnotationsOptions,
    Loading,
    Notification,
  },
  mixins: [DomMixin],
  props: {
    panels: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      messages: {
        none: 'no_annotations_in_view',
        empty: 'no_comments_in_view',
      },
      contentQueue: [],
    };
  },
  computed: {
    item() {
      return this.$store.getters['contents/item'];
    },
    filteredAnnotations() {
      return this.$store.getters['annotations/filteredAnnotations'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
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
      return this.$store.getters['config/annotationTypesMapping'];
    },
    currentTab() {
      return this.$store.getters['annotations/activeTab'];
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
    contentQueue: 'processContentQueue',
    isLoading: 'processContentQueue',
    item: {
      handler: 'onItemChange',
      immediate: true,
    },
    currentTab: {
      handler() {
        this.$store.dispatch('annotations/setFilteredAnnotations');
        this.handleTooltip();
      },
    },
    filteredAnnotations: {
      handler() {
        this.resetActiveAnnotations();
        this.highlightTargetsLevel0();
      },
    },
    panels: {
      handler(curr, prev) {
        const currentState = curr.find(
          (x) => x.panel_label === 'annotations' && x.show,
        );
        const previousState = prev.find(
          (x) => x.panel_label === 'annotations' && x.show,
        );

        if (currentState !== previousState) {
          this.resetActiveAnnotations();
          const annotations = this.findDomElements('[data-annotation-level]');

          if (currentState) {
            annotations.forEach((el) => el.setAttribute('data-annotation-level', 0));
          } else {
            annotations.forEach((el) => el.setAttribute('data-annotation-level', -1));
            this.findDomElements('[data-annotation-icon]')
              .forEach((el) => el.remove());
          }
        }
      },
    },
  },
  mounted() {
    this.$store.subscribeAction(async (action) => {
      if (action.type === 'contents/updateContentDOM') {
        this.contentQueue = [...this.contentQueue, this.updateAnnotations];
      }
    });
  },
  methods: {
    async processContentQueue() {
      while (this.contentQueue.length && !this.isLoading) {
        this.contentQueue.pop()();
      }
    },
    async updateAnnotations() {
      const root = document.getElementById('text-content');

      await this.$store.dispatch('annotations/addHighlightAttributesToText', root);
      await this.$store.dispatch('annotations/addHighlightClickListeners');

      this.$store.dispatch('annotations/setFilteredAnnotations');
      this.handleTooltip();
    },
    async onItemChange(item) {
      if (item.annotationCollection) {
        await this.$store.dispatch('annotations/initAnnotations', item.annotationCollection, {
          root: true,
        });
      }
    },
    switchActiveTab(key, index) {
      this.resetActiveAnnotations();
      this.filteredAnnotations.forEach((annotation) => {
        const selector = AnnotationUtils.generateTargetSelector(annotation);
        if (selector) {
          AnnotationUtils.highlightTargets(selector, { level: -1 });
        }
      });
      this.$store.dispatch('annotations/updateActiveTab', { tab: key, index });
    },

    addAnnotation(id) {
      this.$store.dispatch('annotations/addActiveAnnotation', id);
    },

    getIconName(type) {
      return this.$store.getters['config/getAnnotationIcon'](type);
    },

    handleTooltip() {
      const annotationIds = this.filteredAnnotations.reduce((acc, curr) => {
        const { id } = curr;
        acc[AnnotationUtils.stripAnnotationId(id)] = {
          value: curr.body.value,
          name: this.getIconName(curr.body['x-content-type']),
        };
        return acc;
      }, {});

      document.querySelectorAll('[data-annotation]')
        .forEach((el) => {
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
              .reduce((acc, curr) => {
                if (!acc[curr.value]) {
                  acc[curr.value] = true;
                  annotationClasses.push(curr);
                }
                return acc;
              }, {});

            if (annotationClasses.length) {
              el.addEventListener('mouseenter', () => this.onMouseHover(el, annotationClasses), false);
              el.addEventListener('mouseout', () => this.onMouseOut(), false);
            }
          }
        });
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

    onMouseHover(el, data) {
      onlyIf(
        AnnotationUtils.isAnnotationSelected(el),
        AnnotationUtils.createTooltip.bind(this, el, data),
      );
    },

    onMouseOut() {
      this.findDomElements('.annotation-tooltip').forEach((el) => el.remove());
    },

    removeAnnotation(id) {
      this.$store.dispatch('annotations/removeActiveAnnotation', id);
    },

    resetActiveAnnotations() {
      return this.$store.dispatch('annotations/resetActiveAnnotations');
    },

    toggle({ id }) {
      const exists = !!this.activeAnnotation[id];
      if (exists) {
        this.removeAnnotation(id);
      } else {
        this.addAnnotation(id);
      }
    },
  },
};
</script>


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
