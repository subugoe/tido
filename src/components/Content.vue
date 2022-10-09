<template>
  <div class="item">
    <Loading v-if="isLoading" />

    <div v-if="notificationMessage" class="q-pa-sm">
      <Notification
        :message="$t(notificationMessage)"
        :notification-colors="config.notificationColors"
        :title="$t('no_text_available')"
        type="warning"
      />
    </div>

    <div v-if="!notificationMessage" class="q-px-sm">
      <q-btn
        class="cursor-pointer"
        flat
        round
        size="sm"
        :disable="fontsize >= fontSizeLimits.max"
        :title="$t('increase')"
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
        :title="$t('decrease')"
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

    <div id="text-content" class="custom-font item-content">
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <div :class="{ rtl: config.rtl }" v-html="content" :style="contentStyle" />
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
  domParser, delay,
} from '@/utils';

export default {
  name: 'Content',
  components: {
    Loading,
    Notification,
  },
  mixins: [DomMixin],
  props: {
    url: String,
    type: String
  },
  data: () => ({
    content: '',
    errorTextMessage: null,
    fontSize: 16,
    fontSizeLimits: {
      min: 14,
      max: 28,
    },
    isLoading: false,
  }),
  computed: {
    errorText() {
      return this.$store.getters['contents/errorText'];
    },
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
      immediate: true
    }
  },
  async created() {
    this.fasSearchPlus = fasSearchPlus;
    this.fasSearchMinus = fasSearchMinus;
  },
  methods: {
    decrease() {
      this.fontSize -= 2;
    },
    async loadContent(url) {
      this.content = '';
      console.log('loadContent')
      try {
        if (!url) {
          return;
        }
        this.errorTextMessage = '';
        this.isLoading = true;
        await delay(400);
        this.$store.dispatch('annotations/updateContentLoading', true);
        const data = await cachableRequest(url, 'text');
        this.isValidTextContent(data);

        if (this.hasSupport) {
          await this.getSupport(this.manifest.support);
        }

        const dom = domParser(data);
        this.content = dom.documentElement.innerHTML;
        setTimeout(async () => {
          this.isLoading = false;
          this.$store.dispatch('annotations/updateContentLoading', false);
          this.$store.commit('contents/setActiveContentUrl', this.url);
          const root = document.getElementById('text-content');
          this.$store.dispatch('annotations/addHighlightAttributesToText', root);
          await this.$store.dispatch('annotations/addHighlightClickListeners');
        }, 100);
      } catch (err) {
        this.errorTextMessage = err.message;
      }
    },
    increase() {
      this.fontSize += 2;
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
