<template>
    <div v-for="(variant, i) in annotation.body.value" :key="i"  class="t-items-center t-flex t-justify-around t-mb-1">
          <div class="t-rounded t-box-border t-w-150 t-h-8 t-border-2 t-p-1 t-bg-zinc-200">
            <span v-if="variant.witness" v-html="variant.witness"/>
            <span v-else  > - </span>
          </div>
          <span v-html="variant.entry" class=""/>
    </div>
</template>



<script setup lang="ts">

export interface Props {
  annotation: Annotation
}

const props = withDefaults(defineProps<Props>(), {
  annotation: () => <Annotation>{},
})

</script>



<style scoped>

</style>