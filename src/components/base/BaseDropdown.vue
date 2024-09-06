<template>
  <div class="t-relative">
    <BaseButton
      display="mono"
      icon="dropdown"
      icon-position="right"
      :size="size"
      :text="buttonText"
      @click="emit('update:modelValue', !modelValue)"
    />
    <div
      v-if="modelValue"
      class="t-absolute t-top-[110%] t-z-[1000] t-min-w-full t-shadow-md t-rounded-md t-p-3 t-border dark:t-border-gray-600 dark:t-bg-gray-800 t-bg-gray-50"
      :class="{
        't-right-0': props.openRight,
        't-left-0': props.openLeft
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useConfigStore } from '@/stores/config';

import BaseButton from '@/components/base/BaseButton.vue';

export interface Props {
  modelValue: boolean
  buttonText: string
  openLeft: boolean
  openRight: boolean
  size: 'small' | 'normal' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  openLeft: true,
  openRight: false,
  size: 'normal'
});

const emit = defineEmits(['update:modelValue']);
const configStore = useConfigStore();
const container = computed(() => configStore.config.container);

watch(
  () => props.modelValue,
  (value) => {
    const tido = document.querySelector(container.value + ' .tido');
    let backdrop = tido.querySelector('#tido-backdrop');

    if (value) {
      if (!backdrop) {
        const el = document.createElement('div');
        el.id = 'tido-backdrop';
        el.classList.add('t-fixed', 't-top-0', 't-left-0', 't-z-[999]', 't-w-screen', 't-h-screen', 't-bg-gray-200/30');

        tido.appendChild(el);
        backdrop = tido.querySelector('#tido-backdrop');
        backdrop.clickOutsideEvent = () => {
          emit('update:modelValue', false);
        };
        backdrop.addEventListener('click', backdrop.clickOutsideEvent);
      }
    } else if (backdrop) backdrop.remove();
  },
);
</script>
