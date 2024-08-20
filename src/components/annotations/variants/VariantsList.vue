<template>
  <div class="annotations-list t-overflow-auto">
    <div
      v-for="annotation in annotations"
      :key="annotation.id"
    >
      <VariantItem
        :annotation="annotation"
        :is-active="isActive(annotation)"
        :toggle="toggle"
        @select="addAnnotation(annotation.id)"
        @unselect="removeAnnotation(annotation.id)"
        @show-details="openDetailsDialog"
      />
    </div>
  </div>
  <BaseDialog
    v-model="variantsDetailsDialogOpen"
    :title="$t('selected_variants')"
  >
    <ActiveVariantsDetails />
  </BaseDialog>
</template>


<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import VariantItem from "@/components/annotations/variants/VariantItem.vue";
import {useAnnotationsStore} from "@/stores/annotations";
import BaseDialog from "@/components/base/BaseDialog.vue";
import ActiveVariantsDetails from "@/components/annotations/variants/ActiveVariantsDetails.vue";
import { getItemColorBasedOnIndex } from '@/utils/color';


export interface Props {
  annotations: Annotation[],
  types: {name: string, icon: string, annotationType: string}[]
}

const annotationStore = useAnnotationsStore();
const variantsDetailsDialogOpen = ref(false);

const props = withDefaults(defineProps<Props>(), {
  annotations: () => <Annotation[]> [],
})

const activeAnnotations = computed<ActiveAnnotation>(() => annotationStore.activeAnnotations);

onMounted(() => {
  allocateWitnessColorInVariantItem()
})

function allocateWitnessColorInVariantItem() {
  const colors = props.annotations.reduce((acc, cur: Annotation, i) => {
    const witness = cur.body.value.witness
    if (!acc[witness]) {
      acc[witness] = getItemColorBasedOnIndex(i)
    }
    return acc
  }, {})
  annotationStore.setVariantItemsColors(colors)
}

function isActive(annotation: Annotation): boolean {
  return !!activeAnnotations.value[annotation.id];
}

function addAnnotation(id: string) {
  annotationStore.addActiveAnnotation(id);
}

function removeAnnotation(id: string) {
  annotationStore.removeActiveAnnotation(id);
}
function toggle({ id }) {
  const exists = !!activeAnnotations.value[id];
  if (exists) {
    removeAnnotation(id);
  } else {
    addAnnotation(id);
  }
}

function openDetailsDialog() {
  variantsDetailsDialogOpen.value = true;
}

</script>
