<template>
  <div class="content-view q-px-md q-pt-md">
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

<script setup>
import Notification from '@/components/Notification.vue';

import { computed, readonly, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { request } from '@/utils/http';
import { domParser, delay } from '@/utils';

const props = defineProps({
  url: String,
  type: String,
  fontSize: Number,
});
const emit = defineEmits(['loading']);

const store = useStore();

const content = ref('');
const errorTextMessage = ref(null);
const notificationMessage = readonly(errorTextMessage);

const manifest = computed(() => store.getters['contents/manifest']);
const config = computed(() => store.getters['config/config']);
const contentStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
}));

watch(
  () => props.url,
  loadContent,
  { immediate: true },
);
async function loadContent(url) {
  content.value = '';
  try {
    if (!url) {
      return;
    }
    errorTextMessage.value = '';
    emit('loading', true);
    await delay(300);
    const data = await request(url);
    isValidTextContent(data);

    const dom = domParser(data);
    content.value = dom.documentElement.innerHTML;
    setTimeout(async () => {
      emit('loading', false);
      const root = document.getElementById('text-content');
      store.dispatch('annotations/addHighlightAttributesToText', root);
      await store.dispatch('annotations/addHighlightClickListeners');

      // TODO: Enable Hover + Tooltip feature when reqs are clarified
      // await store.dispatch('annotations/addHighlightHoverListeners');

      store.commit('contents/setActiveContentUrl', props.url);
    }, 100);
  } catch (err) {
    errorTextMessage.value = err.message;
  }
}

function isValidTextContent(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    // TODO : Handle json parsing more gracefully
  }

  if (parsed && parsed.status === 500) {
    throw new Error('no_text_in_view');
  }
}
</script>

<style lang="scss" scoped>
.content-view {
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
