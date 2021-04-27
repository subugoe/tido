<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm annotations"
  >
    <q-list>
      <q-item
        v-for="annotation in filterAnnotations(annotations)"
        :id="'list' + stripAnnotationId(annotation.target.id)"
        :key="stripAnnotationId(annotation.id)"
        class="aktiv"
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
  <div v-else>
    <p>One does not simply show annotations.</p>
  </div>
</template>

<script>
import * as Icons from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Annotations',
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
    return {};
  },
  created() {
    this.icons = Icons;
  },
  mounted() {},
  methods: {
    availableTypes() {
      const array = [];
      this.config.annotations.types.forEach((item) => array.push(item.contenttype));
      return array;
    },

    getIconName(contenttype) {
      return this.config.annotations.types.filter((item) => item.contenttype === contenttype).[0].icon;
    },

    getIcon(contenttype) {
      return Icons.[this.getIconName(contenttype)];
    },

    /**
    * filter the annotation for configured ones
    * TODO: move to computed?
    * @param array annotations
    * @return array annotations without unconfigured ones.
    */
    filterAnnotations(annotations) {
      const arr = [];
      annotations.forEach((annotation) => {
        if (this.availableTypes().filter((item) => item === annotation.body['x-content-type']).length > 0) {
          arr.push(annotation);
          // function is triggered on list rendering, so we use it as init call to set up the text
          this.setText(annotation);
        }
      });
      return arr;
    },

    /**
    * get the annotation id/s of the current item
    * @param object annotation
    * @return string
    */
    stripAnnotationId(string) {
      const split = string.split('/');
      return split[split.length - 1];
    },

    toggle(id) {
      document.getElementById(id).classList.toggle('annotation-disabled');
      document.getElementById(`list${id}`).classList.toggle('aktiv');
    },

    setText(annotation) {
      const id = this.stripAnnotationId(annotation.target.id);
      const contenttype = annotation.body['x-content-type'];
      const textElement = document.getElementById(id);
      const newSvg = this.createSVG(this.getIconName(contenttype));

      textElement.prepend(newSvg);
      textElement.classList.toggle('annotation');
    },

    createSVG(name) {
      const [path, viewbox] = Icons[name].split('|');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('class', 'q-icon q-ml-sm');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('role', 'presentation');
      svg.setAttribute('viewBox', viewbox);

      const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      newPath.setAttribute('d', path);
      svg.appendChild(newPath);

      return svg;
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

.aktiv {
  background-color: whitesmoke;
}
</style>
