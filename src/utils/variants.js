import { useAnnotationsStore } from "@/stores/annotations";
import { getItemColorBasedOnIndex } from '@/utils/color';


export function allocateWitnessColorInVariantItem() {
    const annotationStore = useAnnotationsStore()
    const colors = {}
    if (!annotationStore.witnesses) return
    if (annotationStore.witnesses.length === 0) return;
  
    annotationStore.witnesses.forEach((witness, i) => {
      colors[witness.idno] = getItemColorBasedOnIndex(i)
    })
    annotationStore.setVariantItemsColors(colors)
}