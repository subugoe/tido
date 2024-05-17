<script setup lang="ts">
import Checkbox from 'primevue/checkbox'
import TriStateCheckbox from 'primevue/tristatecheckbox'
import { getIcon } from '@/utils/icons';

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

const pt = {
  root: {
    class: ["t-relative", "t-inline-flex", "t-align-bottom", "t-w-[18px]", "t-h-[18px]", "t-cursor-pointer", "t-select-none"]
  },
  box: ({ props: e, context: r }) => ({
    class:[
      "t-flex","t-items-center","t-justify-center","t-w-[18px]","t-h-[18px]","t-border",
      { 't-rounded': !props.round },
      { 't-rounded-full': props.round },
      {
        "t-border-gray-300": !r.checked,
        "t-border-primary t-bg-primary hover:t-bg-primary-accent dark:t-border-primary dark:t-bg-primary": r.checked || props.modelValue === null
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
    class: ["t-peer", "t-w-full ", "t-h-full", "t-absolute", "t-top-0 t-left-0", "t-z-10", "t-p-0", "t-m-0", "t-opacity-0", "t-rounded-md", "t-outline-none", "t-border", "t-appearance-none", "t-cursor-pointer"]
  },
  icon: {
    class: ["t-leading-none", "t-w-4", "t-h-2.5", "t-text-white", "t-transition-all", "t-duration-200"]
  }
}

type AriaChecked = 'mixed' | 'true' | 'false'

function getAriaChecked(): AriaChecked {
  if (props.modelValue === null) return 'mixed';
  if (props.modelValue === true) return 'true';
  else return 'false';
}
</script>
<template>
  <Checkbox
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :binary="true"
    :inputId="id"
    :pt="pt"
    :aria-checked="getAriaChecked()"
    unstyled
  >
    <template #icon="slotProps">
      <i v-if="modelValue === null" v-html="getIcon('minus')" class="t-leading-none t-w-[18px] t-h-[18px] t-text-lg t-text-white t-transition-all t-flex t-items-center t-justify-center"></i>
      <i v-else-if="modelValue === true" v-html="getIcon('check')" class="t-leading-none t-w-[18px] t-h-[18px] t-scale-[1.45] t-text-white t-transition-all t-flex t-items-center t-justify-center"></i>
    </template>
  </Checkbox>
</template>
