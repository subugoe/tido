<template>
  <BaseButton
    display="flat"
    icon="dropdown"
    icon-position="right"
    :text="buttonText"
    @click="emit('update:modelValue', !modelValue)"
  >
  </BaseButton>
  <div
    v-if="modelValue"
    class="t-absolute t-top-[110%] t-right-0 t-z-[1000] t-shadow-md t-rounded-md t-p-2 dark:t-bg-gray-800 t-bg-gray-50"
  >
    <slot/>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '@/components/base/BaseButton.vue';

const props = defineProps(['modelValue', 'buttonText']);
const emit = defineEmits(['update:modelValue']);
const store = useStore();
const container = computed(() => store.getters['config/config'].container);

watch(
  () => props.modelValue,
  (value) => {
    const tido = document.querySelector(container.value);
    let backdrop = tido.querySelector('#tido-backdrop');

    if (value) {
      if (!backdrop) {
        const el = document.createElement('div');
        el.id = 'tido-backdrop';
        el.classList.add('t-fixed', 't-top-0', 't-left-0', 't-z-[999]', 't-w-screen', 't-h-screen', 't-bg-gray-400/30');

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
