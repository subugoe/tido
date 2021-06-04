<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm annotations"
  >
    <AnnotationToggles
      :config="config"
      :configured-types="configuredTypes"
    />

    <AnnotationList
      :hot-annotations="hotAnnotations"
      :get-icon="getIcon"
      :status-check="statusCheck"
      :toggle="toggle"
    />

    <AnnotationOptions
      :selected-all="selectedAll"
      :selected-none="selectedNone"
      :toggle-to="toggleTo"
    />
  </div>

  <div
    v-else
    class="q-pa-sm"
  >
    <Notification :message="$t(messages.none)" />
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
      hotAnnotations: [],
      ids: [],
      messages: {
        none: 'noAnnotationMessage',
      },
      selectedAll: undefined,
      selectedNone: undefined,
    };
  },
  computed: {
    configuredTypes() {
      return this.config.annotations.types.map((type) => type.contenttype);
    },
  },
  mounted() {
    this.$root.$on('update-annotations', (content) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      this.ids = [...doc.body.querySelectorAll('[id]')].map((el) => el.getAttribute('id'));

      const interval = setInterval(() => {
        if (this.annotationLoading) {
          this.hotAnnotations = this.filterAnnotationTypes();
          clearInterval(interval);
        }
      }, 500);
    });
  },
  methods: {
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

    setText(annotation) {
      const contentType = annotation.body['x-content-type'];
      const svg = this.createSVG(this.getIconName(contentType));

      const id = this.stripAnnotationId(annotation.target.id);
      const textElement = document.getElementById(id);

      textElement.prepend(svg);
      textElement.classList.toggle('annotation');
      textElement.classList.toggle('annotation-disabled');
    },

    statusCheck() {
      const num = this.hotAnnotations.length;
      const active = this.hotAnnotations.filter((annotation) => annotation.status === true).length;

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

      const id = annotation.strippedId;

      document.getElementById(id).classList.toggle('annotation-disabled');
      document.getElementById(`list${id}`).classList.toggle('bg-grey-2');
    },

    toggleTo(bool) {
      this.hotAnnotations.filter((annotation) => annotation.status === bool).map((annotation) => this.toggle(annotation));
      this.selectedAll = bool;
      this.selectedNone = !bool;
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
