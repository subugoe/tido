<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import TriStateCheckbox from 'primevue/tristatecheckbox'

const props = withDefaults(defineProps<{
  id: string,
  label?: string,
  modelValue?: boolean,
  triState?: boolean,
  round?: boolean
}>(), {
  id: 'default-id',
  round: false
})

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
}>()

const pdt = {
  root: ({ context }) => ({
    class: [
      't-relative t-inline-flex t-w-[20px] t-h-[20px] t-overflow-hidden',
      't-border t-border-gray-300 dark:t-border-gray-600 hover:dark:t-border-primary t-transition-colors t-cursor-pointer',
      { 't-rounded-md': !props.round },
      { 't-rounded-full': props.round },
      'focus:t-ring focus:t-ring-opacity-25 focus:t-ring-primary',
      {
        't-bg-gray-50 dark:t-bg-gray-700 hover:t-border-gray-400': !context.checked,
        't-bg-primary text-white hover:t-bg-primary t-border-primary dark:t-border-primary': context.checked,
      }
    ]
  }),
  input: {
    class: 't-absolute t-top-0 t-left-0 t-w-full t-h-full t-m-0 t-p-0 t-opacity-0 t-outline-none t-appearance-none t-z-1'
  },
  box: ({ context }) => ({
    class: [
      't-w-full t-h-full t-flex t-justify-center t-items-center',
      {
        't-bg-gray-50 dark:t-bg-gray-700': !context.checked,
        't-bg-primary t-text-white hover:t-bg-primary': context.checked,
      }
    ]
  })
};

const pt = {
  root: {
    class: ["t-relative", "t-inline-flex", "t-align-bottom", "t-w-5", "t-h-5", "t-cursor-pointer", "t-select-none"]
  },
  box: ({ props: e, context: r }) => ({
    class:[
      "t-flex","t-items-center","t-justify-center","t-w-5","t-h-5","t-border",
      { 't-rounded-md': !props.round },
      { 't-rounded-full': props.round },
      {
        "t-border-gray-300": !r.checked,
        "t-border-primary t-bg-primary dark:t-border-primary dark:t-bg-primary": r.checked
      },
      {
        "t-bg-gray-50 dark:t-bg-gray-800 t-border-gray-300 dark:t-border-gray-600 peer-hover:t-border-gray-400 dark:peer-hover:t-border-gray-500": !e.disabled && !r.checked,
        "peer-hover:t-bg-primary dark:peer-hover:bg-primary": !e.disabled && r.checked,
        "peer-focus-visible:t-border-gray-400 dark:t-peer-focus-visible:border-primary-400 peer-focus-visible:t-ring-2 peer-focus-visible:t-ring-primary/20 dark:t-peer-focus-visible:ring-primary-300/20":!e.disabled,
        "t-cursor-default t-opacity-60": e.disabled
      },
      "t-transition-colors","t-duration-200"
    ]
  }),
    input: {
    class: ["t-peer", "t-w-full ", "t-h-full", "t-absolute", "t-top-0 t-left-0", "t-z-10", "t-p-0", "t-m-0", "t-opacity-0", "t-rounded-md", "t-outline-none", "t-border", "t-appareance-none", "t-cursor-pointer"]
  },
  icon: {
    class: ["t-leading-none", "t-w-4", "t-h-2.5", "t-text-white", "t-transition-all", "t-duration-200"]
  }
}


</script>
<template>
  <Checkbox
    v-if="!triState"
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :binary="true"
    :inputId="id"
    :pt="pt"
    unstyled
  />
  <TriStateCheckbox
    v-else
    unstyled
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :pt="pt"
    aria-label="Remember Me"
  />
</template>
