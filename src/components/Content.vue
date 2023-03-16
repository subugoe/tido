<template>
  <div class="content-container q-px-md q-pt-md">
    <div v-if="notificationMessage" class="q-pa-sm">
      <Notification
        :message="$t(notificationMessage)"
        :notification-colors="config.notificationColors"
        :title="$t('no_text_available')"
        type="warning"
      />
    </div>

    <div id="text-content" class="custom-font item-content">
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <div :class="{ rtl: config.rtl }" v-html="content" :style="contentStyle" />
    </div>
  </div>
</template>

<script>
import DomMixin from '@/mixins/dom';
import Notification from '@/components/Notification.vue';
import { request } from '@/utils/http';
import {
  loadFont,
  onlyIf,
  loadCss,
  domParser, delay,
} from '@/utils';

export default {
  name: 'Content',
  components: {
    Notification,
  },
  mixins: [DomMixin],
  props: {
    url: String,
    type: String,
    fontSize: Number,
  },
  data: () => ({
    content: '',
    errorTextMessage: null,
  }),
  computed: {
    manifest() {
      return this.$store.getters['contents/manifest'];
    },
    config() {
      return this.$store.getters['config/config'];
    },
    contentStyle() {
      return {
        fontSize: `${this.fontSize}px`,
      };
    },
    notificationMessage() {
      return this.errorTextMessage;
    },
    hasSupport() {
      if (!this.manifest) {
        return false;
      }
      const { support } = this.manifest;
      // return support && Object.keys(support).length && support.url !== '';
      return support && support.length > 0;
    },
  },
  watch: {
    url: {
      handler: 'loadContent',
      immediate: true,
    },
  },
  methods: {
    async loadContent(url) {
      this.content = '';
      try {
        if (!url) {
          return;
        }
        this.errorTextMessage = '';
        this.$emit('loading', true);
        await delay(300);
        const data = await request(url);
        this.isValidTextContent(data);

        if (this.hasSupport) {
          await this.getSupport(this.manifest.support);
        }

        const dom = domParser(data);
        this.content = dom.documentElement.innerHTML;
        setTimeout(async () => {
          this.$emit('loading', false);
          const root = document.getElementById('text-content');
          this.$store.dispatch('annotations/addHighlightAttributesToText', root);
          await this.$store.dispatch('annotations/addHighlightClickListeners');
          await this.$store.dispatch('annotations/addHighlightHoverListeners');
          this.$store.commit('contents/setActiveContentUrl', this.url);
        }, 100);
      } catch (err) {
        this.errorTextMessage = err.message;
      }
    },
    isValidTextContent(text) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        // TODO : Handle json parsing more gracefully
      }

      if (parsed && parsed.status === 500) {
        throw new Error('no_text_in_view');
      }
    },
    async getSupport(support) {
      support.forEach((s) => {
        const hasElement = document.getElementById(s.url);
        onlyIf(s.type === 'font' && !hasElement, () => loadFont(s.url));
        onlyIf(s.type !== 'font' && !hasElement, () => loadCss(s.url));
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content-container {
  position: relative;
  overflow: auto;
}
.default-cursor {
  cursor: default !important;
}

.disabled-tab {
  pointer-events: none;
}

.item-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
}

.rtl {
  direction: rtl;
}
</style>
