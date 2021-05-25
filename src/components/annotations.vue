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
        clickable
        padding="xs"
        class="q-pa-sm q-pl-xs q-mb-xs"
        @click="toggle(stripAnnotationId(annotation.target.id))"
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
      svg.setAttribute('class', 'q-icon q-ml-xs');
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

    toggle(id) {
      document.getElementById(id).classList.toggle('annotation-disabled');
      document.getElementById(`list${id}`).classList.toggle('bg-grey-2');
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
