<template>
  <div class="scroll-panel">
    <Metadata v-if="manifests.length"
      :collection="collection"
      :itemlabel="itemlabel"
      :labels="labels"
      :language="language"
      :manifests="manifests"
    />
  </div>
</template>

<script>
import Metadata from '@/components/metadata.vue';

export default {
  props: {
    collection: Object,
    itemlabel: String,
    labels: Object,
    language: String,
    manifests: Array,
  },
  components: {
    Metadata,
  },
};
</script>
