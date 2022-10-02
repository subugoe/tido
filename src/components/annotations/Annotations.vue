<template>

</template>

<script>
import AnnotationsToggles from "components/annotations/AnnotationsToggles";
import AnnotationsList from "components/annotations/AnnotationsList";
import AnnotationsOptions from "components/annotations/AnnotationsOptions";
import Loading from "components/Loading";
import Notification from "components/Notification";

export default {
  name: "Annotations",
  components: {
    AnnotationsToggles,
    AnnotationsList,
    AnnotationsOptions,
    Loading,
    Notification,
  },
  props: {
    url: String,
    types: Array
  },
  mounted() {
    console.log('mounted')
  }
}
</script>

<style scoped>

</style>
