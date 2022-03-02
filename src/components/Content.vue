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
        :class="{ 'disabled-tab': contenturl === activeTab }"
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
      v-if="!hasError && !isLoading"
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
      <div :class="{ rtl: config.rtl }" v-html="content" :style="contentStyle"/>
    </div>
  </div>
</template>

<script>
import { fasSearchPlus, fasSearchMinus } from '@quasar/extras/fontawesome-v5';
import DomMixin from '@/mixins/dom';
import Loading from '@/components/Loading.vue';
import Notification from '@/components/Notification.vue';
import {
  loadFont, onlyIf, loadCss, domParser, getAnnotationContentIds, delay, addHighlighterAttributes,
} from '@/utils';

export default {
  name: 'Content',
  components: {
    Loading,
    Notification,
  },
  mixins: [DomMixin],
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
    contentStyle() {
      return {
        fontSize: `${this.fontsize}px`,
      };
    },
    hasError() {
      return this.errorText || this.errorTextMessage;
    },
    notificationMessage() {
      return this.$t(
        this.errorTextMessage || this.errorText.textErrorMessageNotExists,
      );
    },
    supportType() {
      const { support } = this.manifests[this.sequenceindex];

      return Object.keys(support).length && support.url !== '';
    },
  },

  watch: {
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
          this.$store.dispatch('annotations/updateContentLoading', true);
          const data = await this.request(url, 'text');
          this.isValidTextContent(data);

          if (this.supportType) {
            await this.getSupport(this.manifests[0].support);
          }

          const annotationPanelHidden = this.panels.find(
            (x) => x.panel_label === 'Annotations' && !x.show,
          );

          const dom = domParser(data);

          addHighlighterAttributes.call(this, dom);

          this.content = dom.documentElement.innerHTML;

          if (!annotationPanelHidden) {
            await delay(200);
            this.$store.dispatch('annotations/updateContentIds', getAnnotationContentIds.call(this, dom));
          }
        } catch (err) {
          this.errorTextMessage = err.message;
          this.$store.dispatch('annotations/updateContentIds', {});
        } finally {
          this.isLoading = false;
          this.$store.dispatch('annotations/updateContentLoading', false);
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
    decrease() {
      this.$store.dispatch('annotations/decreaseContentFontSize');
    },

    increase() {
      this.$store.dispatch('annotations/increaseContentFontSize');
    },

    isValidTextContent(text) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        // TODO : Handle json parsing more gracefully
      }

      if (parsed && parsed.status === 500) {
        throw new Error('textErrorMessageNotExists');
      }
    },

    async getSupport(support) {
      support.forEach((s) => {
        const hasElement = this.findDomElementById(s.url);
        onlyIf(s.type === 'font' && !hasElement, () => loadFont(s.url));
        onlyIf(s.type !== 'font' && !hasElement, () => loadCss(s.url));
      });
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
