<template>
  <div class="item">
    <q-tabs
      v-model="activeTabContents"
      dense
      class="text-grey q-mb-sm"
      active-color="$q.dark.isActive ? 'white' : 'accent'"
      indicator-color="$q.dark.isActive ? 'white' : 'accent'"
      align="justify"
    >
      <q-tab
        v-for="(contenturl, i) in contenturls"
        :key="`content${i}`"
        :class="{'disabled-tab': contenturl === activeTab}"
        :label="$t(contenttypes[i])"
        :name="contenturl"
      />
    </q-tabs>

    <Loading v-if="isLoading" />

    <div
      v-if="hasError"
      class="q-pa-sm"
    >
      <Notification
        :message="notificationMessage"
        :notification-colors="config.notificationColors"
        title-key="textErrorTitle"
        type="warning"
      />
    </div>

    <div
      v-if="!hasError&& !isLoading"
      class="q-px-sm"
    >
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
import Loading from '@/components/loading.vue';
import Notification from '@/components/notification.vue';

export default {
  name: 'Content',
  components: {
    Loading,
    Notification,
  },
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
    contentindex: {
      type: Number,
      default: () => 0,
    },
    errorText: {
      type: Object,
      default: () => null,
    },
    fontsize: {
      type: Number,
      default: () => 16,
    },
    manifests: {
      type: Array,
      default: () => [],
    },
    oncontentindexchange: {
      type: Function,
      default: () => null,
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
    activeTabContents: '',
    content: '',
    errorTextMessage: null,
    fontSizeLimits: {
      min: 14,
      max: 28,
    },
    isLoading: false,
    sequenceindex: 0,
  }),
  computed: {
    activeTab() {
      return this.contenturls[this.contentindex];
    },
    hasError() {
      return this.errorText || this.errorTextMessage;
    },
    notificationMessage() {
      return this.$t(this.errorTextMessage || this.errorText.textErrorMessageNotExists);
    },
    supportType() {
      const { support } = this.manifests[this.sequenceindex];

      return Object.keys(support).length && support.url !== '';
    },
  },

  watch: {
    fontsize() {
      this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;
    },
    activeTabContents(url) {
      this.oncontentindexchange(this.contenturls.findIndex((x) => x === url));
    },
    activeTab: {
      async handler(url) {
        try {
          if (!url) {
            return;
          }
          this.errorTextMessage = '';
          this.isLoading = true;
          this.$root.$emit('update-annotation-loading', true);

          const data = await this.request(url, 'text');

          const { valid, status } = this.isValidTextContent(data);

          if (!valid) {
            if (status === 500) {
              throw new Error('textErrorMessageNotExists');
            }
          }

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
              ...dom.querySelectorAll('[data-target]:not([value=""])'),
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

          // to improve performance, here we are trying to get candidates of annotation that are
          // possibly be the annotation and try to match them with their respective annotations.
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
        } catch (err) {
          this.errorTextMessage = err.message;

          this.$root.$emit('update-annotations', {});
        } finally {
          this.isLoading = false;
          this.$root.$emit('update-annotation-loading', false);
        }
      },
      immediate: true,
    },
  },
  async created() {
    this.fasSearchPlus = fasSearchPlus;
    this.fasSearchMinus = fasSearchMinus;

    const activeTab = this.contenturls[this.contentindex];
    const [contenturls] = this.contenturls[0];

    this.activeTabContents = activeTab;

    if (!activeTab) {
      this.oncontentindexchange(0);
      this.activeTabContents = contenturls;
    }
  },

  mounted() {
    if (this.errorText !== null) {
      return;
    }

    this.$refs.contentsize.style.fontSize = `${this.fontsize}px`;

    this.$root.$on('update-sequence-index', (index) => {
      if (this.supportType) {
        this.getSupport(this.manifests[index].support);
      }
    });

    const [contenturls] = this.contenturls[0];

    this.$root.$on('manifest-changed', () => {
      this.activeTabContents = contenturls;
      this.oncontentindexchange(0);
    });
  },
  methods: {
    isValidTextContent(text) {
      try {
        const parsed = JSON.parse(text);
        if (!!parsed.status && !(parsed.status === 200 || parsed.status === 201)) {
          return {
            valid: false,
            status: parsed.status, // status value from backend.
          };
        }

        return {
          valid: true,
          status: 200,
        };
      } catch (err) {
        return {
          valid: true,
          status: 200,
        };
      }
    },
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
      let fontFamily;

      if (url.endsWith('italic.woff')) {
        fontFamily = 'SertoJerusalemItalic';
        style = 'italic';
      }
      if (url.endsWith('bold.woff')) {
        fontFamily = 'SertoJerusalemBold';
        weight = 700; // https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight
      }
      if (url.endsWith('syrcomedessa.woff')) {
        fontFamily = 'Estrangelo Edessa';
      }
      if (url.endsWith('syrcomjerusalem.woff')) {
        fontFamily = 'Serto Jerusalem';
      }

      const fontFace = new FontFace(fontFamily, `url(${url})`, { style, weight });

      const loadedFont = await fontFace.load();

      document.fonts.add(loadedFont);
    },
  },
};
</script>

<style lang="scss" scoped>
.default-cursor {
  cursor: default !important;
}

.disabled-tab {
  pointer-events: none;
}

.item {
  position: relative;
}

.item-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  padding: 8px;
}

.rtl {
  direction: rtl;
}
</style>
