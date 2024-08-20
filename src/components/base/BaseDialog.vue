<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { useConfigStore } from '@/stores/config';

withDefaults(defineProps<{
  modelValue: boolean,
  title?: string,
  closable?: boolean
}>(), {
  closable: true,
});
const configStore = useConfigStore();

const emit = defineEmits<{(event: 'update:modelValue', payload: boolean): void;
}>();
</script>
<template>
  <Dialog
    :visible="modelValue"
    modal
    unstyled
    :closable="closable"
    :dismissable-mask="closable"
    :append-to="configStore.config.container + ' .tido > *'"
    :pt="{
      root: {
        class: 't-relative t-bg-white dark:t-bg-gray-800 t-p-4 t-rounded-lg lg:t-min-w-[33%] t-max-h-[80%] t-shadow-lg dark:t-border dark:t-border-gray-700'
      },
      header: {
        class: 't-flex t-mb-4'
      },
      headerIcons: {
        class: 't-ml-auto'
      },
      closeButton: {
        class: 't-absolute t-right-4 hover:t-bg-gray-100 dark:hover:t-bg-gray-700 t-w-8 t-h-8 t-rounded-full t-flex t-items-center t-justify-center'
      },
      mask: {
        class: 't-bg-gray-900 t-bg-opacity-50 dark:t-bg-opacity-75',
      }
    }"
    @update:visible="emit('update:modelValue', $event)"
  >
    <template #header>
      <h3 class="t-text-lg t-font-medium t-leading-6 t-text-gray-900 dark:t-text-gray-400">
        {{ title }}
      </h3>
    </template>
    <div ref="containerRef">
      <slot />
    </div>
  </Dialog>
</template>
