<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm annotations"
  >
    <q-list>
      <q-item
        v-for="annotation in filterAnnotationTypes(annotations)"
        :id="'list' + annotation.strippedId"
        :key="annotation.strippedId"
        clickable
        padding="xs"
        class="q-pa-sm q-pl-xs q-mb-xs"
        @click="toggle(annotation)"
      >
        <q-item-section
          avatar
          class="q-mr-none"
        >
          <q-icon
            :name="getIcon(annotation.body['x-content-type'])"
            size="16px"
          />
        </q-item-section>

        <q-item-section>
          {{ annotation.body.value }}
        </q-item-section>
      </q-item>
    </q-list>
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-fab
        color="primary"
        direction="up"
        vertical-actions-align="right"
        :icon="icons.fasCog"
        :active-icon="icons.fasChevronDown"
      >
        <q-fab-action
          color="primary"
          label="highlight all annotations in text"
          label-position="left"
          :icon="icons.fasEye"
          @click="highlight(true)"
        />
        <q-fab-action
          color="primary"
          label="remove all annotation highlights in text"
          label-position="left"
          :icon="icons.fasEyeSlash"
          @click="highlight(false)"
        />
      </q-fab>
    </q-page-sticky>
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
    return {
      ids: [],
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
  mounted() {
    this.$root.$on('update-content', async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const ids = [...document.querySelectorAll('.ab')].map((x) => x.id);

      this.ids = ids;
    });
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
        let id = annotation.target.id.split('/');

        id = id[id.length - 1];

        if (this.configuredTypes.filter((type) => type === annotation.body['x-content-type']).length > 0 && this.ids.some((x) => id.startsWith(x))) {
          types.push(annotation);
          // function is triggered on list rendering, so we use it as init call to set up the text
          this.setText(annotation);
          annotation.status = this.config.annotations.show;
          annotation.strippedId = this.stripAnnotationId(annotation.target.id);
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

    setStatus(annotation) {
      annotation.status = true;
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
      // toggle the boolean status value
      annotation.status = annotation.status !== true;
      document.getElementById(annotation.strippedId).classList.toggle('annotation-disabled');
      document.getElementById(`list${annotation.strippedId}`).classList.toggle('bg-grey-2');
    },

    toggleAll() {
      // filter for annotations with a status to omit toggling hidden annotations
      this.annotations.filter((a) => a.status).map((annotation) => this.toggle(annotation));
    },

    highlight(bool) {
      this.annotations.filter((a) => a.status === bool).map((annotation) => this.toggle(annotation));
    },

    toggleStatus(annotation) {
      annotation.status = annotation.status !== true;
    },
  },
};
</script>

<style>
/* not in scope to style the text */
.q-item__section--avatar {
  min-width: 24px;
}

.q-item__section--side {
  padding-right: unset;
}

.q-item {
  min-height: unset;
}

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
