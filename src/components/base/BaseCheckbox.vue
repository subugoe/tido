<script setup lang="ts">
import Checkbox from 'primevue/checkbox'

const props = withDefaults(defineProps<{
  id: string,
  label?: string,
  modelValue?: boolean,
  triState?: boolean
}>(), {
  id: 'default-id',
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>()
</script>
<template>
  <div class="t-flex t-items-center">
    <Checkbox
      v-if="!triState"
      :model-value="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :binary="true"
      :inputId="id"
      :pt="{
        root: ({ context }) => ({
          class: [
            't-border-2 dark:t-border-zinc-600 hover:t-border-primary hover:dark:t-border-primary t-rounded-md t-w-[22px] t-h-[22px] t-transition-colors t-cursor-pointer',
            {'t-outline-none t-border-primary t-ring t-ring-opacity-25 t-ring-primary': context.focused },
            {
              't-bg-zinc-50 dark:t-bg-zinc-700 hover:t-border-primary': !context.checked,
              't-bg-primary text-white hover:t-bg-primary-700 t-border-primary dark:t-border-primary': context.checked,
            }
          ]
        }),
        input: {
          class: 't-w-full t-h-full t-flex t-items-center t-justify-center'
        }
      }">
      <template v-slot:icon="{ checked }">
          <BaseIcon name="ic:round-check" :class="[
            { '!t-hidden': !checked },
            { 't-text-white dark:t-text-zinc-300': checked }
          ]"/>
      </template>
    </Checkbox>
    <TriStateCheckbox v-else unstyled />
    <label
      v-if="label"
      :for="id"
      class="t-ml-2 t-text-sm t-font-medium t-text-gray-900 dark:t-text-zinc-300">
    {{ label }}
    </label>
  </div>
</template>
