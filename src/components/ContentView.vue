<template>
  <div class="content-view t-px-4 t-pt-4">
    <div
      v-if="errorTextMessage !== ''"
      class="t-p-2"
    >
      <MessageBox
        :message="$t(errorTextMessage)"
        :notification-colors="config.notificationColors"
        :title="$t('no_text_available')"
        type="warning"
      />
    </div>

    <div
      v-else
      id="text-content"
      ref="textContainer"
      class="custom-font item-content t-flex t-flex-col t-flex-1 t-overflow-auto"
    >
      <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
      <div :class="{ rtl: config.rtl }" v-html="content" :style="contentStyle" />
    </div>
  </div>
</template>

<script setup>

import {
  computed, ref, useTemplateRef, watch,
} from 'vue';
import { useConfigStore } from '@/stores/config';
import { useAnnotationsStore } from '@/stores/annotations';
import { useContentsStore } from '@/stores/contents';
import MessageBox from '@/components/MessageBox.vue';
import { request } from '@/utils/http';
import { domParser, delay } from '@/utils';

const props = defineProps({
  url: String,
  type: String,
  fontSize: Number,
  panelIndex: Number
});
const emit = defineEmits(['loading']);
const textContainer = useTemplateRef('textContainer');

const configStore = useConfigStore();
const contentStore = useContentsStore();

const content = ref('');
const errorTextMessage = ref(null);

const config = computed(() => configStore.config);
const contentStyle = computed(() => ({
  fontSize: `${props.fontSize}px`,
}));

let clickListener = null

watch(
  () => props.url,
  loadContent,
  { immediate: true },
);

async function loadContent(url) {
  console.log(url)
  content.value = '';
  if (!url) {
    errorTextMessage.value = 'no_text_in_view';
    return;
  }
  const annotationStore = useAnnotationsStore();

  try {
    errorTextMessage.value = '';
    emit('loading', true);
    await delay(300);
    const data = await request(url);
    isValidTextContent(data);

    const dom = domParser(data);
    content.value = dom.documentElement.innerHTML;

    setTimeout(async () => {
      emit('loading', false);

      const root = textContainer.value;
      annotationStore.addHighlightAttributesToText(root);

      if (clickListener) root.removeEventListener('click', clickListener);
      clickListener = annotationStore.addHighlightClickListeners(root);

      // In case of multiple text panels, we need to pass the panel index to track changes on the content in the annotation panel.
      contentStore.setActiveContentMap(props.url, props.panelIndex);
    }, 100);
  } catch (err) {
    console.error(err)
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
