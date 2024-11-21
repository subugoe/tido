<template>
  <BaseButton
    display="mono"
    icon="copy"
    icon-position="right"
    text="Copy citation"
    class="t-mt-[10px] t-ml-[20px]"
    @click="copyContentToClipboard()"
  />
  <Message
    v-if="copiedCitation"
    :pt="{
      root: 't-bg-green-100 t-text-green-500 t-w-[200px] t-h-[25px] t-mt-[10px] t-ml-[20px] t-rounded',
      wrapper: 't-flex t-flex-row t-relative',
      icon: 't-hidden',
      text: 't-pl-[10px]',
      closebutton: {
        class: 't-absolute t-right-[10px]',
        onclick: onCloseClick,
      },
    }"
  >
    Copied successfully!
  </Message>
</template>

<script setup lang="ts">
import Message from "primevue/message";
import BaseButton from "@/components/base/BaseButton.vue";
import { ref } from "vue";

const props = defineProps<{
  value: string;
}>();

let copiedCitation = ref(false);

async function copyContentToClipboard() {
  try {
    await navigator.clipboard.writeText(props.value);
    copiedCitation.value = true;
    setTimeout(() => (this.copiedCitation = false), 1500);
  } catch (err) {
    console.error("Citation could not be copied in the keyboard");
  }
}

function onCloseClick() {
  copiedCitation.value = false;
}
</script>
