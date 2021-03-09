<template>
  <div>
    <div class="row sticky">
      <div>
        <q-btn
          class="q-mr-sm q-mb-sm cursor-pointer"
          flat
          round
          size="md"
          title="Increase Textsize"
          @click="increase()"
        >
          <q-icon
            :name="fasSearchPlus"
            size="sm"
            :color="$q.dark.isActive ? 'white' : 'accent'"
          />
        </q-btn>

        <q-btn
          class="q-mr-sm q-mb-sm cursor-pointer"
          flat
          round
          size="md"
          title="Decrease Textsize"
          :color="$q.dark.isActive ? 'white' : 'accent'"
          @click="decrease()"
        >
          <q-icon
            :name="fasSearchMinus"
            size="sm"
            :color="$q.dark.isActive ? 'white' : 'accent'"
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
      content: '',
      sequenceindex: 0,
      typeMap: {
        Place: 'placeName',
        Person: 'persName',
        Comment: 'comment',
      },
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
    this.fasSearchPlus = fasSearchPlus;
    this.fasSearchMinus = fasSearchMinus;

    this.content = await this.request(this.contenturls[0], 'text').then((data) => {
      if (this.supportType) {
        this.getSupport(this.manifests[0].support);
      }

      return data;
    });
  },
  mounted() {
    this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;

    this.$root.$on('update-sequence-index', (index) => {
      if (this.supportType) {
        this.getSupport(this.manifests[index].support);
      }
    });

    this.$root.$on('update-entity-id', (id, contentType) => {
      const entityColors = {
        Comment: 'grey',
        Person: 'blue',
        Place: 'cyan',
      };

      const entity = document.getElementById(id);
      const color = entityColors[contentType];

      if (entity !== null) {
        entity.style.backgroundColor = entity.style.backgroundColor !== '' ? '' : color;
        // entity.innerHTML += '<span class="fas fasSearchMinus"></span>';
      }
    });

    this.$root.$on('update-highlighting', (model, type) => {
      const entities = document.getElementsByClassName(this.typeMap[type]);
      // eslint-disable-next-line no-console
      console.log('__ENTITIES__', entities);

      Object.values(entities).forEach((e) => {
        e.classList.toggle(this.typeMap[type], true);
      });
    });
  },
  methods: {
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
            const styleElement = document.createElement('link');

            styleElement.setAttribute('rel', 'stylesheet');
            styleElement.setAttribute('href', s.url);

            document.head.appendChild(styleElement);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .rtl {
    direction: rtl;
  }
</style>
