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
    <span
      class="t-w-2/3"
      v-html="entry"
    />
    <div class="t-w-1/3 t-flex t-flex-wrap t-space-x-0.5">
      <template v-if="witnesses.length > 1">
        <div
          v-for="witness in witnesses"
          :key="witness"
          class="t-relative t-rounded-full t-p-2 t-font-semibold"
          :style="{
            'background': colors[getWitnessColor(witness)]['500'],
          }"
          :title="witness"
          @mouseover="showWitnessTooltip($event, witness)"
          @mouseout="hideWitnessTooltip($event)"
        />
      </template>
      <div
        v-else-if="witnesses.length === 1"
        class="t-relative t-truncate t-rounded-3xl t-box-border t-px-2 t-py-1 t-text-xs t-flex-grow-0 t-font-semibold"
        :style="{
          'background': colors[getWitnessColor(witnesses[0])]['100'],
          'color': colors[getWitnessColor(witnesses[0])]['600']
        }"
      >
        {{ witnesses[0] ?? '-' }}
      </div>
    </div>
  </div>
  <hr
    v-if="showSeparator"
    class="t-slate-200 t-my-[6px] t-rounded-none"
    data-cy="variant-sep-line"
  >
</template>

<script setup lang="ts">
import { computed } from 'vue';
import colors from "tailwindcss/colors";
import {useAnnotationsStore} from "@/stores/annotations";

const annotationStore = useAnnotationsStore();

const entry = computed(() => props.annotation.body.value.entry)
const witnesses = computed(() => props.annotation.body.value.witnesses)

export interface Props {
  annotation: Annotation,
  isActive: boolean,
  toggle: (annotation: Annotation) => void,
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

function getWitnessColor(witness: string) {
  return annotationStore.variantItemsColors[witness];
}

function showWitnessTooltip(event: MouseEvent, witness: string) {
  const { target } = event;
  const tooltipEl = document.createElement('div');
  tooltipEl.classList.add('t-absolute' ,'t-z-50', 't-rounded-3xl', 't-box-border', 't-px-2', 't-py-1', 't-text-xs', 't-font-semibold', '-t-top-[28px]', 't-left-1/2', '-t-translate-x-1/2', 't-border');
  tooltipEl.style.background = colors[getWitnessColor(witness)]['100'];
  tooltipEl.style.color = colors[getWitnessColor(witness)]['600'];
  tooltipEl.style.borderColor = colors[getWitnessColor(witness)]['600'];
  tooltipEl.innerHTML = witness;

  target.appendChild(tooltipEl);
}

function hideWitnessTooltip(event: MouseEvent) {
  const { target } = event;
  target.innerHTML = '';
}
</script>
