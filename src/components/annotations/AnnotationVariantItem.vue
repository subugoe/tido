<template>
    <div v-for="(variant, i) in annotation.body.value" :key="i"  class="t-items-center t-flex t-justify-around">
          <span v-if="variant.witness" v-html="variant.witness" class=""/>
          <span v-else class="" > - </span>
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