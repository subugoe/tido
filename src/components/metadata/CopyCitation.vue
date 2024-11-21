<template>
  <Button
    class="t-mt-[10px] t-ml-[20px]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <BaseIcon
      :name="getIconName()"
      :style="
        copiedCitation
          ? { color: 'green', fontSize: '20px' }
          : { color: 'grey' }
      "
      @click="copyContentToClipboard()"
    />
  </Button>
  <Message
    v-show="copiedCitation || isHovered"
    :pt="{
      root: 't-bg-zinc-700 t-text-white t-w-[150px] t-h-[25px] t-ml-[20px] t-rounded',
      wrapper: 't-flex t-flex-row t-relative',
      icon: 't-hidden',
      text: 't-pl-[5px]',
      closebutton: {
        class: 't-hidden',
      },
    }"
  >
    {{ messageText }}
  </Message>
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
