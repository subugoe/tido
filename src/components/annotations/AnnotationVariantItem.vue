<template>
    <div v-for="(variant, i) in annotation.body.value" :key="i"  class="t-items-center t-flex">
          <span v-if="variant.witness" v-html="variant.witness" class="t-mr-7"/>
          <span v-else  class="t-mr-7"> - </span>
          <span v-html="variant.entry"/>
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