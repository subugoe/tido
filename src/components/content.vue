<template>
  <div>
    <div class="row sticky">
      <div>
        <q-btn
          v-for="(button, index) in buttons"
          :key="index"
          class="q-mr-sm q-mb-sm cursor-pointer"
          flat
          round
          size="md"
          :title="button.title"
          @click="dynamicEvent(button.event)"
        >
          <q-icon
            :color="$q.dark.isActive ? 'white' : 'accent'"
            :name="button.icon"
            size="sm"
          />
        </q-btn>
      </div>
    </div>

    <div class="row">
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <div
        :class="['scroll-panel', config.rtl ? 'rtl' : '']"
        ref="contentsize"
        v-html="content"
      />
    </div>
  </div>
</template>

<script>
import { fasSearchPlus, fasSearchMinus } from '@quasar/extras/fontawesome-v5';
// import { mdiAccount, mdiMapMarker, mdiComment } from '@quasar/extras/mdi-v5';

export default {
  name: 'Content',
  props: {
    annotationids: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => {},
    },
    contenturls: {
      type: Array,
      default: () => [],
    },
    fontsize: {
      type: Number,
      default: () => 14,
    },
    manifests: {
      type: Array,
      default: () => [],
    },
    request: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      buttons: [
        { event: 'increase', icon: fasSearchPlus, title: 'Increase Textsize' },
        { event: 'decrease', icon: fasSearchMinus, title: 'Decrease Textsize' },
      ],
      content: '',
      sequenceindex: 0,
      types: [
        'Editorial Comment',
        'Person',
        'Place',
      ],
    };
  },
  computed: {
    supportType() {
      const { support } = this.manifests[this.sequenceindex];

      return Object.keys(support).length && support.url !== '';
    },
  },
  watch: {
    fontsize() {
      this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;
    },
  },
  async created() {
    this.content = await this.request(this.contenturls[0], 'text').then((data) => {
      if (this.supportType) {
        this.getSupport(this.manifests[0].support);
      }

      return data;
    });
  },
  mounted() {
    this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;

    if (this.config.annotationmode) {
      this.$root.$emit('toggle-highlight-mode', 1, this.types);
    }

    this.toggleAnnotationHighlighting();

    this.$root.$on('toggle-entity-highlighting', (id) => {
      const entity = document.getElementById(id);

      if (entity !== null) {
        entity.style.borderBottom = entity.style.borderBottom ? '' : 'solid';
      }
    });

    this.$root.$on('toggle-highlight-mode', (model, types) => {
      this.highlight(model, types);
    });

    this.$root.$on('update-sequence-index', (index) => {
      if (this.supportType) {
        this.getSupport(this.manifests[index].support);
      }
    });
  },
  methods: {
    dynamicEvent(event) {
      this[event]();
    },
    decrease() {
      const min = 8;
      let textsize = this.fontsize;

      textsize -= textsize > min ? 1 : 0;
      this.$root.$emit('update-fontsize', textsize);
    },
    increase() {
      const max = 32;
      let textsize = this.fontsize;

      textsize += textsize < max ? 1 : 0;
      this.$root.$emit('update-fontsize', textsize);
    },
    getSupport(support) {
      support.forEach((s) => {
        this.request(s.url, 'text')
          .then(() => {
            const supportUrl = document.createElement('link');

            if (s.type === 'css') supportUrl.setAttribute('rel', 'stylesheet');

            supportUrl.setAttribute('href', s.url);

            document.head.appendChild(supportUrl);
          });
      });
    },
    highlight(model, types) {
      this.types = types;

      if (this.annotationids.length && Array.isArray(this.types) && this.types.length) {
        this.types.forEach((type) => {
          const idsByType = this.annotationids.filter((entity) => entity.contenttype === type);

          idsByType.forEach((typeId) => {
            const e = document.getElementById(typeId.id);
            if (e !== null) {
              e.style.borderBottom = !model ? '' : 'solid';
            }
          });
        });
      }
    },
    test(id) {
      this.$root.$emit('toggle-annotation-highlighting', id);
    },
    toggleAnnotationHighlighting() {
      setTimeout(() => {
        if (this.annotationids.length) {
          // implicitly cast annotationids to type array to ease the iteration
          const entities = this.annotationids.filter((entity) => entity);

          entities.forEach((entity) => {
            const id = document.getElementById(entity.id);

            if (id !== null) {
              id.onclick = this.test(entity.id);
            }
          });
        }
      }, 1500);
    },
  },
};
</script>

<style lang="scss">
  .rtl {
    direction: rtl;
  }
</style>
