<template>
  <div v-for="(variant, i) in annotation.body.value" :key="i"  class="t-items-center t-flex t-mb-1">
        <div class="t-relative  t-rounded-3xl t-box-border t-w-75 t-h-8 t-border-2 t-p-[2px]" :style="{'border-color': getItemColorBasedOnIndex(i)}">
          <span v-if="variant.witness" v-html="variant.witness" class="t-text-sm"/>
          <span v-else class="t-text-sm"> - </span>
        </div>
        <span v-html="variant.entry" class="t-absolute t-right-[50%]"/>
  </div>
</template>



<script setup lang="ts">
import { getItemColorBasedOnIndex } from '@/utils/color';


export interface Props {
  annotation: Annotation
}

const props = withDefaults(defineProps<Props>(), {
  annotation: () => <Annotation>{},
})

</script>



<style scoped>

</style>