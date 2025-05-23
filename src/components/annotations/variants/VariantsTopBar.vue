<script setup lang="ts">
import {useAnnotationsStore} from "@/stores/annotations";
import {computed, ref, watch} from "vue";
import colors from "tailwindcss/colors";
import BaseDialog from "@/components/base/BaseDialog.vue";
import ActiveVariantsDetails from "@/components/annotations/variants/ActiveVariantsDetails.vue";
import WitnessesDetails from "@/components/annotations/variants/WitnessesDetails.vue";
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import BaseCheckbox from "@/components/base/BaseCheckbox.vue";

const annotationsStore = useAnnotationsStore()

const witnesses = computed(() => annotationsStore.witnesses)
const amountActiveWitnesses = computed(() => Object.keys(annotationsStore.activeWitnessesIds).filter(key => !!(annotationsStore.activeWitnessesIds[key])).length)
const witnessesDetailsDialogOpen = ref(false);
const showWitnessesDropdown = ref(false);
const variantsDetailsDialogOpen = ref(false);

watch(witnesses, (value) => {
  let activeWitnessesIds = annotationsStore.activeWitnessesIds
  if(value?.length > 0) {
   value.forEach(witness => activeWitnessesIds[witness.idno] = true);
   annotationsStore.setActiveWitnessesIds(activeWitnessesIds)
  }
},
  { immediate: true }
)
function getWitnessColor(witness: string) {
  return annotationsStore.variantItemsColors[witness];
}
function toggleWitness(witness: Witness, isActive: boolean) {
  let activeWitnessesIds = annotationsStore.activeWitnessesIds
  activeWitnessesIds[witness.idno] = isActive
  annotationsStore.filterAnnotationsByWitnesses(Object.keys(activeWitnessesIds).filter(key => !!(activeWitnessesIds[key])))
  annotationsStore.setActiveWitnessesIds(activeWitnessesIds)
}
</script>

<template>
  <div
    v-show="annotationsStore.filteredAnnotations.length > 0"
    id="variants-top-bar"
    class="t-flex t-flex-col"
  >
    <h3 class="t-text-sm t-font-bold t-mb-2">
      {{ $t('witnesses') }}:
    </h3>
    <div class="t-flex t-items-center t-pb-4 t-border-b dark:t-border-b-gray-600">
      <BaseDropdown
        v-model="showWitnessesDropdown"
        :button-text="amountActiveWitnesses + ' ' + $t('witnesses_selected')"
        size="small"
        open-left
      >
        <div class="t-space-y-2">
          <div
            v-for="(witness, i) in witnesses"
            :key="i"
            class="t-flex t-flex-shrink-0 t-cursor-pointer t-space-x-2"
          >
            <BaseCheckbox
              :id="`witness-toggle-${i}`"
              :model-value="annotationsStore.activeWitnessesIds[witness.idno]"
              @update:model-value="toggleWitness(witness, $event)"
            />
            <label
              class="t-relative t-rounded-3xl t-box-border t-px-2 t-py-1 t-text-xs t-flex-grow-0
            t-font-semibold t-cursor-pointer t-truncate t-max-w-[300px]"
              :for="`witness-toggle-${i}`"
              :title="witness.title ?? '-'"
              :style="{
                'background': colors[getWitnessColor(witness.idno)]['100'],
                'color': colors[getWitnessColor(witness.idno)]['600']
              }"
            >{{ witness.idnoAlt ? `(${witness.idnoAlt}) ` : '' }}{{ witness.title ?? '-' }}</label>
          </div>
        </div>
      </BaseDropdown>
    </div>
    <div
      v-show="Object.keys(annotationsStore.activeAnnotations).length > 0"
      class="t-mt-4 t-flex t-items-center"
    >
      <span class="t-text-sm t-font-bold">{{ Object.keys(annotationsStore.activeAnnotations).length }} Variants selected</span>
    </div>
  </div>
  <BaseDialog
    v-model="witnessesDetailsDialogOpen"
    :title="$t('witnesses_details')"
  >
    <WitnessesDetails />
  </BaseDialog>
  <BaseDialog
    v-model="variantsDetailsDialogOpen"
    :title="$t('selected_variants')"
  >
    <ActiveVariantsDetails />
  </BaseDialog>
</template>
