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
      buttons: [
        { event: 'increase', icon: fasSearchPlus, title: 'Increase Textsize' },
        { event: 'decrease', icon: fasSearchMinus, title: 'Decrease Textsize' },
      ],
      content: '',
      sequenceindex: 0,
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
    activeTab(url) {
      this.request(url, 'text').then((data) => {
        if (this.supportType) {
          this.getSupport(this.manifests[0].support);
        }

        this.content = data;
      });
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
  },
};
</script>

<style lang="scss">
.rtl {
  direction: rtl;
}
</style>
