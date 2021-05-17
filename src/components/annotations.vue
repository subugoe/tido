<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm annotations"
  >
    <q-list>
      <q-item
        v-for="annotation in filterAnnotationTypes(annotations)"
        :id="'list' + stripAnnotationId(annotation.target.id)"
        :key="stripAnnotationId(annotation.id)"
        class="bg-grey-2"
        clickable
        @click="toggle(stripAnnotationId(annotation.target.id))"
      >
        <q-item-section avatar>
          <q-icon :name="getIcon(annotation.body['x-content-type'])" />
        </q-item-section>

        <q-item-section>
          {{ annotation.body.value }}
        </q-item-section>
      </q-item>
    </q-list>
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
import Notification from '@/components/notification.vue';

export default {
  name: 'Annotations',
  components: {
    Notification,
  },
  props: {
    annotations: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      messages: {
        none: 'noAnnotationMessage',
      },
    };
  },
  computed: {
    configuredTypes() {
      const types = [];
      this.config.annotations.types.forEach((type) => types.push(type.contenttype));

      return types;
    },
  },
  created() {
    this.icons = Icons;
  },
  methods: {
    createSVG(name) {
      const [path, viewBox] = Icons[name].split('|');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('class', 'q-icon q-ml-sm');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('role', 'presentation');
      svg.setAttribute('viewBox', viewBox);

      const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      newPath.setAttribute('d', path);
      svg.appendChild(newPath);

      return svg;
    },

    /**
    * filter the configured annotation types (index.html)
    *
    * @return array of annotations excluding unconfigured ones
    */
    filterAnnotationTypes() {
      const types = [];
      this.annotations.forEach((annotation) => {
        if (this.configuredTypes.filter((type) => type === annotation.body['x-content-type']).length > 0) {
          types.push(annotation);
          // function is triggered on list rendering, so we use it as init call to set up the text
          this.setText(annotation);
        }
      });
      return types;
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

    toggle(id) {
      document.getElementById(id).classList.toggle('annotation-disabled');
      document.getElementById(`list${id}`).classList.toggle('bg-grey-2');
    },
  },
};
</script>

<style>
/* not in scope to style the text */
.annotation {
  border-bottom: 2px solid;
  padding-bottom: 2px;
  white-space: nowrap;
}

.annotation-disabled {
  border-bottom: 0;
  padding-bottom: inherit;
}

.annotation-disabled > svg {
  display: none;
}
</style>
