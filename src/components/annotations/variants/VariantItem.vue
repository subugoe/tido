<template>
  <div
    class="t-items-center t-flex t-mb-1 t-relative"
    :class="[
      't-py-2 t-px-2 -t-mx-2 t-mb-1 t-space-x-2 t-rounded-md',
      { 'hover:t-bg-gray-200 dark:hover:t-bg-gray-600 t-cursor-pointer': !isActive },
      { 't-bg-gray-300 dark:t-bg-gray-600 active': isActive}]"
    :data-annotation-id="annotation.id"
    @click="handleClick"
  >
    <div class="t-w-1/3 t-flex">
      <div
        class="t-relative t-truncate t-w-7/8 t-rounded-3xl t-box-border t-px-2 t-py-1 t-text-xs t-flex-grow-0 t-font-semibold"
        :style="{
          'background': colors[witnessColor]['100'],
          'color': colors[witnessColor]['600']
        }"
        :title = witness
      >
        {{ witness ?? '-' }}
      </div>
    </div>

    <span
      class="t-w-7/12"
      v-html="entry"
    />
  </div> 
  <hr class="t-slate-200 t-my-[6px] t-rounded-none" v-if="showSeparator" data-cy="variant-sep-line"/>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import colors from "tailwindcss/colors";

const entry = computed(() => props.annotation.body.value.entry)
const witness= computed(() => props.annotation.body.value.witness)

export interface Props {
  annotation: Annotation,
  isActive: boolean,
  toggle: (annotation: Annotation) => void,
  witnessColor: string
  showSeparator: boolean
}

const props = withDefaults(defineProps<Props>(), {
  annotation: () => <Annotation>{},
  isActive: () => true,
  toggle: () => null,
  showSeparator: () => false,
})

const emit = defineEmits(['select', 'unselect', 'show-details'])

function handleClick() {
  if (props.isActive) {
    emit('unselect')
  } else {
    emit('select')
  }
}
</script>
