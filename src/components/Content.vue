<template>
  <div class="item">
    <q-tabs
      :model-value="activeContentUrl"
      dense
      class="text-grey q-mb-sm"
      active-color="$q.dark.isActive ? 'white' : 'accent'"
      indicator-color="$q.dark.isActive ? 'white' : 'accent'"
      align="justify"
    >
      <q-tab
        v-for="(contenturl, i) in contentUrls"
        :key="`content${i}`"
        :class="{ 'disabled-tab': contenturl === activeContentUrl }"
        :label="$t(contentTypes[i])"
        :name="contenturl"
        @click="switchActiveContentUrl(contenturl)"
      />
    </q-tabs>

    <Loading v-if="isLoading" />

    <div
      v-if="hasError && notificationMessage"
      class="q-pa-sm"
    >
      <Notification
        :message="$t(notificationMessage)"
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

    <div
      id="text-content"
      class="custom-font item-content"
    >
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <div
        :class="{ rtl: config.rtl }"
        v-html="content"
        :style="contentStyle"
      />
    </div>
  </div>
</template>

<script>
import { fasSearchPlus, fasSearchMinus } from '@quasar/extras/fontawesome-v5';

import DomMixin from '@/mixins/dom';
import Loading from '@/components/Loading.vue';
import Notification from '@/components/Notification.vue';
import { cachableRequest } from '@/utils/http';
import {
  loadFont,
  onlyIf,
  loadCss,
  domParser,
} from '@/utils';

export default {
  name: 'Content',
  components: {
    Loading,
    Notification,
  },
  mixins: [DomMixin],
  props: {
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
    content: '',
    errorTextMessage: null,
    fontSizeLimits: {
      min: 14,
      max: 28,
    },
    isLoading: false,
  }),
  computed: {
    activeContentUrl() {
      return this.contentUrls[this.contentIndex];
    },
    itemUrl() {
      return this.$store.getters['contents/itemUrl'];
    },
    contentIndex() {
      return this.$store.getters['contents/contentIndex'];
    },
    contentUrls() {
      return this.$store.getters['contents/contentUrls'];
    },
    contentTypes() {
      return this.$store.getters['contents/contentTypes'];
    },
    errorText() {
      return this.$store.getters['contents/errorText'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    fontsize() {
      return this.$store.getters['annotations/contentFontSize'];
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
      return this.errorTextMessage || this.errorText
        ? this.errorText.textErrorMessageNotExists
        : '';
    },
    sequenceIndex() {
      return this.$store.getters['contents/sequenceIndex'];
    },
    supportType() {
      const { support } = this.manifests[this.sequenceIndex];

      return Object.keys(support).length && support.url !== '';
    },
  },
  watch: {
    itemUrl: {
      handler: 'onItemUrlChange',
      immediate: true,
    },
  },
  async created() {
    this.fasSearchPlus = fasSearchPlus;
    this.fasSearchMinus = fasSearchMinus;
  },
  methods: {
    decrease() {
      this.$store.dispatch('annotations/decreaseContentFontSize');
    },
    switchActiveContentUrl(contentUrl) {
      this.$store.dispatch(
        'contents/setContentIndex',
        this.contentUrls.findIndex((x) => x === contentUrl),
      );
      this.handleActiveContentUrl();
    },
    async getContentsItemData(url) {
      await this.$store.dispatch(
        'contents/initContentItem',
        url,
      );

      await this.handleActiveContentUrl();
    },
    async onItemUrlChange(itemUrl) {
      await this.getContentsItemData(itemUrl);
    },
    async handleActiveContentUrl() {
      const url = this.activeContentUrl;
      try {
        if (!url) {
          return;
        }
        this.errorTextMessage = '';
        this.isLoading = true;
        this.$store.dispatch('annotations/updateContentLoading', true);
        const data = await cachableRequest(url, 'text');
        this.isValidTextContent(data);

        if (this.supportType) {
          await this.getSupport(this.manifests[0].support);
        }

        const dom = domParser(data);
        this.content = dom.documentElement.innerHTML;
        setTimeout(() => {
          this.isLoading = false;
          this.$store.dispatch('annotations/updateContentLoading', false);
          this.$store.dispatch('contents/updateContentDOM');
        }, 100);
      } catch (err) {
        this.errorTextMessage = err.message;
      }
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
  overflow: auto;
  padding: 8px;
}

.rtl {
  direction: rtl;
}
</style>
