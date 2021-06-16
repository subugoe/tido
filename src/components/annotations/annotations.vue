<template>
  <div class="annotations">
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
        @click="activeTab(annotationTab.key,annotationTab.type)"
      />
    </q-tabs>

    <div
      v-if="currentAnnotations.length"
      class="q-ma-sm"
    >
      <AnnotationToggles />

      <AnnotationList
        :configured-annotations="currentAnnotations"
        :get-icon="getIcon"
        :status-check="statusCheck"
        :toggle="toggle"
      />

      <AnnotationOptions
        :selected-all="selectedAll"
        :selected-none="selectedNone"
        :on-highlight-all="onHighlightAll"
        :on-highlight-none="onHighlightNone"
      />
    </div>

    <div
      v-else
      class="q-pa-sm"
    >
      <Notification :message="$t(messages.none)" />
    </div>
  </div>
</template>

<script>
import * as Icons from '@quasar/extras/fontawesome-v5';

import AnnotationToggles from '@/components/annotations/toggles.vue';
import AnnotationList from '@/components/annotations/list.vue';
import AnnotationOptions from '@/components/annotations/options.vue';

import Notification from '@/components/notification.vue';

export default {
  name: 'Annotations',
  components: {
    AnnotationToggles,
    AnnotationList,
    AnnotationOptions,
    Notification,
  },
  props: {
    annotations: {
      type: Array,
      default: () => [],
    },
    annotationLoading: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      configuredAnnotations: [],
      ids: [],
      messages: {
        none: 'noAnnotationMessage',
      },
      selectedAll: false,
      selectedNone: true,
      currentTab: '',
    };
  },
  computed: {
    configuredTypes() {
      return this.config.annotations.types.map((type) => type.contenttype);
    },
    currentAnnotations() {
      const contentType = this.annotationTabs.find((collection) => collection.key === this.currentTab);

      if (!contentType) {
        return [];
      }

      return this.configuredAnnotations.filter((annotationCollection) => contentType.type.includes(annotationCollection.body['x-content-type']));
    },
    annotationTabConfig() {
      return this.config?.annotations?.tabs || {};
    },
    annotationTabs() {
      const contentTypes = {};
      const annotationTab = {};

      Object.entries(this.annotationTabConfig).forEach(([key, types]) => {
        types.forEach((type) => {
          contentTypes[type] = key;
        });

        annotationTab[key] = {
          key,
          collectionTitle: key,
          type: [],
        };
      });

      this.annotations.forEach((curr) => {
        const contentType = curr.body.['x-content-type'];
        if (contentTypes[contentType]) {
          annotationTab[contentTypes[contentType]].type.push(contentType);
        }
      });

      return Object.values(annotationTab).filter((x) => x.type.length);
    },
  },
  mounted() {
    this.$root.$on('update-annotations', (content) => {
      // reset selected
      this.selectedAll = undefined;
      this.selectedNone = undefined;

      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      this.ids = [...doc.body.querySelectorAll('[id]')].map((el) => el.getAttribute('id'));

      const interval = setInterval(() => {
        if (this.annotationLoading) {
          const firstTab = this.annotationTabs.find((x) => x.type.length)?.key || '';

          this.configuredAnnotations = this.filterAnnotationTypes();
          this.highlightActiveTabContent(this.annotationTabConfig[firstTab] || []);
          this.currentTab = firstTab;
          clearInterval(interval);
        }
      }, 500);
    });
  },
  methods: {
    highlightActiveTabContent(contentTypes) {
      this.annotations.forEach((annotation) => {
        const id = this.stripAnnotationId(annotation.target.id);
        const textElement = document.getElementById(id);

        if (contentTypes.includes(annotation.body['x-content-type'])) {
          textElement.classList.add('annotation');
          textElement.classList.add('annotation-disabled');
        } else {
          textElement.classList.remove('annotation');
          textElement.classList.add('annotation-disabled');
        }
      });
    },
    activeTab(key, types) {
      this.currentTab = key;
      this.selectedAll = false;
      this.selectedNone = true;

      this.highlightActiveTabContent(types);
    },
    createSVG(name) {
      const [path, viewBox] = Icons[name].split('|');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('class', 'q-icon q-mx-xs');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('role', 'presentation');
      svg.setAttribute('viewBox', viewBox);

      const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      newPath.setAttribute('d', path);
      svg.appendChild(newPath);

      return svg;
    },

    /**
    * filter for configured annotation types (index.html)
    *
    * @return array of annotations excluding unconfigured ones
    */
    filterAnnotationTypes() {
      return this.annotations.filter((annotation) => {
        this.$set(annotation, 'status', this.config.annotations.show);

        annotation.strippedId = this.stripAnnotationId(annotation.target.id);
        const annotationIds = this.ids.includes(annotation.strippedId);

        if (this.configuredTypes.find((type) => type === annotation.body['x-content-type']) && annotationIds) {
          this.setText(annotation);

          return true;
        }
        return false;
      });
    },

    getIcon(contentType) {
      return Icons[this.getIconName(contentType)];
    },

    getIconName(contentType) {
      return this.config.annotations.types.filter((annotation) => annotation.contenttype === contentType)[0].icon;
    },

    onHighlightAll() {
      this.currentAnnotations.forEach((annotation) => this.updateToggleState(annotation, 'remove', 'add'));

      this.selectedAll = true;
      this.selectedNone = false;
    },

    onHighlightNone() {
      this.currentAnnotations.forEach((annotation) => this.updateToggleState(annotation, 'add', 'remove'));

      this.selectedAll = false;
      this.selectedNone = true;
    },

    setText(annotation) {
      const contentType = annotation.body['x-content-type'];
      const id = this.stripAnnotationId(annotation.target.id);
      const textElement = document.getElementById(id);
      let svg = null;

      try {
        svg = this.createSVG(this.getIconName(contentType));

        svg.setAttribute('id', `annotation-icon-${id}`);
      } catch (err) {
        svg = null;
      }

      if (svg) {
        textElement.prepend(svg);
      }
    },

    statusCheck() {
      const num = this.configuredAnnotations.length;
      const active = this.configuredAnnotations.filter((annotation) => annotation.status === true).length;

      if (num === active) {
        this.selectedAll = false;
        this.selectedNone = true;
      } else if (active === 0) {
        this.selectedAll = true;
        this.selectedNone = false;
      } else {
        this.selectedAll = false;
        this.selectedNone = false;
      }
    },

    /**
    * get the annotation id of the current item
    *
    * @param string url
    * @return string
    */
    stripAnnotationId(url) {
      return url.split('/').pop();
    },

    toggle(annotation) {
      annotation.status = !annotation.status;

      this.updateToggleState(annotation, 'toggle', 'toggle');
    },

    updateToggleState(annotation, text = 'toggle', list = 'toggle') {
      const id = this.stripAnnotationId(annotation.target.id);

      document.getElementById(id).classList.[text]('annotation-disabled');
      document.getElementById(`list${id}`).classList.[list]('bg-grey-2');
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

.annotation-disabled > svg {
  display: none;
}
</style>

<style lang="scss" scoped>
.q-item {
  min-height: unset;
}

.q-item__section--avatar {
  min-width: 24px;
}

.q-item__section--side {
  padding-right: unset;
}
</style>
