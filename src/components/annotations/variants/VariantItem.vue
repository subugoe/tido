<template>
  <div
    class="t-items-center t-flex t-mb-1 t-relative"
    :class="[
      't-py-1 t-px-2 t-mb-1 t-space-x-2 t-rounded-md',
      { 'hover:t-bg-gray-200 dark:hover:t-bg-gray-600 t-cursor-pointer': !isActive },
      { 't-bg-gray-300 dark:t-bg-gray-600 active': isActive}]"
    :data-annotation-id="annotation.id"
    @click="handleClick"
  >
    <div class="t-w-4/12 t-flex">
      <div
        class="t-relative t-rounded-3xl t-box-border t-border-2 t-px-2 t-py-1 t-text-xs t-flex-grow-0"
        :style="{'border-color': getWitnessColor(witness)}"
      >
        {{ witness ?? '-' }}
      </div>
    </div>

    <span
      class="t-w-7/12"
      v-html="entry"
    />
    <BaseButton
      :text="$t('details')"
      size="tiny"
      @click="handleDetailsClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAnnotationsStore } from '@/stores/annotations';
import BaseButton from "@/components/base/BaseButton.vue";


const entry = computed(() => props.annotation.body.value.entry)
const witness = computed(() => props.annotation.body.value.witness)

const annotationStore = useAnnotationsStore();

export interface Props {
  annotation: Annotation,
  isActive: boolean,
  toggle: (annotation: Annotation) => void,
}

const props = withDefaults(defineProps<Props>(), {
  annotation: () => <Annotation>{},
  isActive: () => true,
  toggle: () => null,
})

const emit = defineEmits(['select', 'unselect', 'show-details'])

function handleClick() {
  if (props.isActive) {
    emit('unselect')
  } else {
    emit('select')
  }
}

function handleDetailsClick(event: Event) {
  event.preventDefault()
  emit('show-details')
}

function getWitnessColor(witness: string) {
  return annotationStore.variantItemsColors[witness];
}
</script>
