<template>
  <div class="item">
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
        @click="activeTab(annotationTab.key)"
      />
    </q-tabs>

    <!-- <div
      v-if="currentAnnotations.length"
      class="q-ma-sm"
    > -->
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
    <!-- </div> -->

    <!-- <div
      v-else
      class="q-pa-sm"
    >
      <Notification :message="$t(messages.none)" />
    </div> -->
  </div>
</template>

<script>
import * as Icons from '@quasar/extras/fontawesome-v5';

import AnnotationToggles from '@/components/annotations/toggles.vue';
import AnnotationList from '@/components/annotations/list.vue';
import AnnotationOptions from '@/components/annotations/options.vue';

// import Notification from '@/components/notification.vue';

export default {
  name: 'Annotations',
  components: {
    AnnotationToggles,
    AnnotationList,
    AnnotationOptions,
    // Notification,
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
      currentTab: 'editorial',
    };
  },
  computed: {
    configuredTypes() {
      return this.config.annotations.types.map((type) => type.contenttype);
    },
    currentAnnotations() {
      const contentType = this.annotationTabs.find((collection) => collection.key === this.currentTab);

      return this.configuredAnnotations.filter((annotationCollection) => contentType.type.includes(annotationCollection.body['x-content-type']));
    },
    annotationTabs() {
      return [
        {
          collectionTitle: 'Editorial',
          key: 'editorial',
          type: ['Place', 'Person', 'Editorial Comment'],
        },
        {
          collectionTitle: 'Motifs',
          key: 'motifs',
          type: ['Motif'],
        },
      ];
    },
  },
  mounted() {
    this.$root.$on('update-annotations', (content) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      this.ids = [...doc.body.querySelectorAll('[id]')].map((el) => el.getAttribute('id'));

      const interval = setInterval(() => {
        if (this.annotationLoading) {
          this.configuredAnnotations = this.filterAnnotationTypes();
          this.highlightActiveTabContent('editorial');
          clearInterval(interval);
        }
      }, 500);

      this.currentTab = 'editorial';
    });
  },
  methods: {
    highlightActiveTabContent(key) {
      const contentTypes = this.annotationTabs.find((content) => content.key === key).type;

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
    activeTab(key) {
      this.currentTab = key;
      this.selectedAll = false;
      this.selectedNone = true;

      this.highlightActiveTabContent(key);
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
.item {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.item-content {
  height: 100vh;
  overflow: auto;
  padding: 8px;
}
</style>
