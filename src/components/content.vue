<template>
  <div class="item">
    <q-tabs
      v-model="activeTab"
      dense
      class="text-grey q-mb-sm"
      active-color="$q.dark.isActive ? 'white' : 'accent'"
      indicator-color="$q.dark.isActive ? 'white' : 'accent'"
      align="justify"
    >
      <q-tab
        v-for="(contenturl, i) in contenturls"
        :key="`content${i}`"
        :name="contenturl"
        :class="contenturls.length == 1 && 'default-cursor'"
        :disable="contenturls.length == 1"
        :label="$t(contenttypes[i])"
      />
    </q-tabs>

    <div class="q-px-sm">
      <q-btn
        class="cursor-pointer"
        flat
        round
        size="sm"
        :disable="fontsize >= fontSizeLimits.max"
        :title="$t('Increase')"
        @click="increase()"
      >
        <q-icon
          :name="fasSearchPlus"
          size="xs"
          :color="$q.dark.isActive ? 'white' : 'accent'"
        />
      </q-btn>

      <q-btn
        class="cursor-pointer"
        flat
        round
        size="sm"
        :disable="fontsize <= fontSizeLimits.min"
        :title="$t('Decrease')"
        :color="$q.dark.isActive ? 'white' : 'accent'"
        @click="decrease()"
      >
        <q-icon
          :name="fasSearchMinus"
          size="xs"
          :color="$q.dark.isActive ? 'white' : 'accent'"
        />
      </q-btn>
    </div>

    <div class="custom-font item-content text-content">
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <div :class="{ rtl: config.rtl }" ref="contentsize" v-html="content" />
    </div>
  </div>
</template>

<script>
import { fasSearchPlus, fasSearchMinus } from '@quasar/extras/fontawesome-v5';
import Annotation from '@/mixins/annotation';

export default {
  name: 'Content',
  mixins: [Annotation],
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    contenturls: {
      type: Array,
      default: () => [],
    },
    contenttypes: {
      type: Array,
      default: () => [],
    },
    fontsize: {
      type: Number,
      default: () => 16,
    },
    manifests: {
      type: Array,
      default: () => [],
    },
    request: {
      type: Function,
      default: null,
    },
    transcription: {
      type: String,
      default: () => '',
    },
    panels: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    activeTab: null,
    content: '',
    fontSizeLimits: {
      min: 14,
      max: 28,
    },
    sequenceindex: 0,
  }),
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
    async activeTab(url) {
      this.$root.$emit('update-annotation-loading', true);

      const data = await this.request(url, 'text');

      if (this.supportType) {
        await this.getSupport(this.manifests[0].support);
      }

      const annotationPanelHidden = this.panels.find(
        (x) => x.panel_label === 'Annotations' && !x.show,
      );

      const parser = new DOMParser();
      let dom = parser.parseFromString(data, 'text/html');
      if (!annotationPanelHidden) {
        const spans = [
          ...dom.querySelectorAll('span[data-target]:not([value=""])'),
        ];

        const spanIds = [
          ...new Set(
            spans.map((x) => x
              .getAttribute('data-target')
              .replace('_start', '')
              .replace('_end', '')),
          ),
        ];

        spanIds.forEach((selector) => {
          dom = this.replaceSelectorWithSpan(selector, dom);
        });

        const dataTargets = [...dom.querySelectorAll('[id]')].map((x) => x.getAttribute('id'));

        dataTargets.forEach((selector) => this.addHighlightToTargetIds(selector, dom));
      }
      this.content = dom.documentElement.innerHTML;

      const displayedAnnotations = [
        ...dom.querySelectorAll('[data-annotation]'),
      ]
        .map((x) => x.getAttribute('class'))
        .reduce((prev, curr) => {
          (curr || '').split(' ').forEach((c) => {
            prev[c.replace(/\./g, '')] = true;
          });
          return prev;
        }, {});

      await this.delay(200);

      this.$root.$emit('update-annotations', displayedAnnotations);
      this.$root.$emit('update-annotation-loading', false);
    },
  },
  async created() {
    this.fasSearchPlus = fasSearchPlus;
    this.fasSearchMinus = fasSearchMinus;

    const [contentUrl] = this.contenturls;

    this.activeTab = contentUrl;
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
    async delay(ms = 2500) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    decrease() {
      const { min } = this.fontSizeLimits;
      let textsize = this.fontsize;

      textsize -= textsize > min ? 2 : 0;
      if (textsize < min) textsize = min;

      this.$root.$emit('update-fontsize', textsize);
    },
    increase() {
      const { max } = this.fontSizeLimits;
      let textsize = this.fontsize;

      textsize += textsize < max ? 2 : 0;
      if (textsize > max) textsize = max;

      this.$root.$emit('update-fontsize', textsize);
    },
    async getSupport(support) {
      const promises = [];

      support.forEach((s) => {
        const hasElement = document.getElementById(s.url);

        if (!hasElement) {
          if (s.type === 'font') {
            promises.push(this.loadFont(s.url));
          } else {
            const supportUrl = document.createElement('link');

            supportUrl.setAttribute('rel', 'stylesheet');
            supportUrl.setAttribute('type', 'text/css');
            supportUrl.setAttribute('href', s.url);
            supportUrl.setAttribute('id', s.url);

            document.head.appendChild(supportUrl);
          }
        }
      });

      await Promise.all(promises);
    },
    async loadFont(url) {
      let style = 'normal';
      let weight = 'normal';

      if (url.endsWith('italic.woff')) {
        style = 'italic';
      }
      if (url.endsWith('bold.woff')) {
        weight = 700; // https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight
      }

      const fontFace = new FontFace('tido', `url(${url})`, { style, weight }); // 'tido' or any family name to represent fonts
      const loadedFont = await fontFace.load();

      document.fonts.add(loadedFont);
    },
  },
};
</script>

<style lang="scss" scoped>
.rtl {
  direction: rtl;
}

.default-cursor {
  cursor: default !important;
}

.item-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  padding: 8px;
}
</style>
