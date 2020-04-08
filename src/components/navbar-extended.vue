<template>
  <div :class="css['nav-arrows']">
    <button
      :class="[ css['nav-arrow'], css['nav-arrow--left'], 'btn-width' ]"
      :disabled="sequenceindex <= 0"
      title="Previous Manifest"
      v-html="`${vectors['skip-back']}`"
      @click="
        --sequenceindex;
        itemindex = firstiteminsequence;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
    </button>

    <button
      :class="[ css['nav-arrow'], css['nav-arrow--left'], 'btn-width' ]"
      :disabled="itemindex <= 0"
      title="Previous Item"
      v-html="`${vectors['arrow-alt-left']}`"
      @click="
        --itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
    </button>

    <button>
      <input
        :class="[ css['nav-arrow'], 'btn-width' ]"
        style="text-align: center;"
        title="Enter Page"
        type="text"
        size="2"
        v-model.number="itemindex"
        @keyup.enter="
          sequenceindex = computedsequenceindex;
          updateItem(itemurls[itemindex]);
          updateMetadata(sequenceindex);
          updateTreeNodes(sequenceindex);"
        />
    </button>

    <button
      :class="[ css['nav-arrow'], css['nav-arrow--right'], 'btn-width' ]"
      :disabled="itemindex >= itemurls.length - 1"
      title="Next Item"
      v-html="`${vectors['arrow-alt-right']}`"
      @click="
        ++itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
    </button>

    <button
      :class="[ css['nav-arrow'], css['nav-arrow--right'], 'btn-width' ]"
      :disabled="sequenceindex >= manifests.length - 1"
      title="Next Manifest"
      v-html="`${vectors['skip-forward']}`"
      @click="
        ++sequenceindex;
        itemindex = firstiteminsequence;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
    </button>
  </div>
</template>

<script>
import Navigation, { cssmap } from '@/mixins/navigation';

export default {
  name: 'NavbarExtended',
  mixins: [Navigation],
  data() {
    return {
      css: cssmap,
    };
  },
};
</script>

<style scoped lang="css">
.btn-width {
  width: 60px;
}
</style>
