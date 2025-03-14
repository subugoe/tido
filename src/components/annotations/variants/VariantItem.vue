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
    <div class="t-w-1/3 t-flex t-flex-wrap t-gap-0.5">
      <div
        v-for="witnessIdno in witnessesIdnos"
        :key="witnessIdno"
        class="t-relative t-rounded-3xl t-box-border t-px-2 t-py-1 t-text-xs t-flex-grow-0 t-font-semibold"
        :style="{
          'background': colors[getWitnessColor(witnessIdno)]['100'],
          'color': colors[getWitnessColor(witnessIdno)]['600']
        }"
        @mouseover="showWitnessTooltip($event, witnessIdno)"
        @mouseout="hideWitnessTooltip($event)"
      >
        <span class="t-pointer-events-none">{{ getWitnessIdnoAlt(witnessIdno) }}</span>
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
const witnessesIdnos = computed(() => props.annotation.body.value.witnesses)

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

function showWitnessTooltip(event: MouseEvent, idno: string) {
  const { target } = event;
  const tooltipEl = document.createElement('div');
  tooltipEl.classList.add('witness-tooltip', 't-absolute' ,'t-z-50', 't-rounded-3xl', 't-box-border', 't-px-2', 't-py-1',
    't-text-xs', 't-font-semibold', 't-max-w-[300px]', 't-truncate', '-t-top-[28px]', 't-left-1/2', '-t-translate-x-1/2', 't-border', 't-text-nowrap');
  tooltipEl.style.background = colors[getWitnessColor(idno)]['100'];
  tooltipEl.style.color = colors[getWitnessColor(idno)]['600'];
  tooltipEl.style.borderColor = colors[getWitnessColor(idno)]['600'];
  tooltipEl.innerHTML = getWitnessTitle(idno);

  target.appendChild(tooltipEl);
}

function hideWitnessTooltip(event: MouseEvent) {
  const { target } = event;
  target.querySelector('.witness-tooltip').remove();
}

function getWitnessIdnoAlt(idno: string) {
  return annotationStore.witnessesMap[idno].idnoAlt ?? '-';
}

function getWitnessTitle(idno: string) {
  return annotationStore.witnessesMap[idno].title ?? '-';
}

</script>
