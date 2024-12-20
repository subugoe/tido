<template>
  <span class="t-ml-1 t-mb-2 t-relative">
    <Button
    class="t-h-7"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
   >
    <BaseIcon
      :name="getIconName()"
      :class="{ 't-text-green-500': copiedCitation, 't-text-gray-400': !copiedCitation}"
      class="t-text-xl t-align-middle"
      @click="copyContentToClipboard()"
    />
  </Button>
  <Message
    v-show="copiedCitation || isHovered"
    :pt="{
      root: 't-bg-zinc-700 t-text-white t-text-sm t-absolute -t-left-4 t-w-fit t-whitespace-nowrap t-rounded',
      wrapper: 't-flex t-flex-row t-pr-1',
      icon: 't-hidden',
      text: 't-pl-1',
      closebutton: {
        class: 't-hidden',
      },
    }"
  >
    {{ messageText }}
  </Message>
  </span>
  
</template>

<script setup lang="ts">
import Message from "primevue/message";
import Button from "primevue/button";
import BaseIcon from "@/components//base/BaseIcon.vue";
import { ref } from "vue";

const props = defineProps<{
  value: string;
}>();

let copiedCitation = ref(false);
let messageText = ref("Copy citation value");
const isHovered = ref(false);

async function copyContentToClipboard() {
  try {
    await navigator.clipboard.writeText(props.value);
    copiedCitation.value = true;
    messageText.value = "Copied!";
    setTimeout(() => {
      this.copiedCitation = false;
      messageText.value = "Copy citation value";
    }, 1200);
  } catch (err) {
    console.error("Citation could not be copied in the keyboard");
  }
}

function getIconName() {
  if (copiedCitation.value === true) {
    return "check";
  }
  return "copy";
}
</script>
