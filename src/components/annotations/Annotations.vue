<template>
  <div class="item relative-position">
    <q-tabs
      :model-value="currentTab"
      active-color="$q.dark.isActive ? 'white' : 'accent'"
      align="justify"
      class="text-grey q-mb-sm"
      dense
      indicator-color="$q.dark.isActive ? 'white' : 'accent'"
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
        :title-key="isAnnotationTypeText ? 'commentsInfoTitle' : 'annotationInfoTitle'"
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
  name: 'Annotations',
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
        none: 'noAnnotationMessage',
        empty: 'noCommentsMessage',
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
    contentIndex() {
      return this.$store.getters['contents/contentIndex'];
    },
    contentTypes() {
      return this.$store.getters['contents/contentTypes'];
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
    // annotationQuery(){
    //   return this.$route.query.annotation;
    // }
  },
  watch: {
    // annotationQuery: {
    //   handler: 'onAnnotationQueryChange',
    //   immediate: true,
    // },
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
    // onAnnotationQueryChange(value){
    //   this.$store.dispatch('annotations/updateActiveTab', (this.annotationTabs[value||0] || {}).key || '');
    // },
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
      this.$store.dispatch('annotations/updateActiveTab', key);
      const query = { ...this.$route.query };
      if (index) {
        query.annotation = index;
      } else {
        delete query.annotation;
      }
      this.$router.push({ path: '/', query });
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

    onHighlightAll() {
      this.filteredAnnotations.forEach(({ id }) => !this.activeAnnotation[id] && this.addAnnotation(id));
    },

    onHighlightNone() {
      this.filteredAnnotations.forEach(({ id }) => this.activeAnnotation[id] && this.removeAnnotation(id));
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

[data-annotation-level]:not([data-annotation-level ='-1']) {
  cursor: pointer;
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
