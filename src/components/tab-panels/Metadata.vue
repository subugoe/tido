<template>
  <div class="scroll-panel">
    <Metadata v-if="manifests.length"
      :collection="collection"
      :config="config"
      :itemlabel="itemlabel"
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
    config: Object,
    itemlabel: String,
    language: String,
    manifests: Array,
  },
  components: {
    Metadata,
  },
};
</script>
<style lang="sass" scoped>
  @import '../../css/responsive-heights.sass'

  .scroll-panel
    -ms-overflow-style: none
    overflow: auto
    scrollbar-width: none
    @include makeResponsiveHeight()

  .scroll-panel::-webkit-scrollbar
    display: none
</style>
