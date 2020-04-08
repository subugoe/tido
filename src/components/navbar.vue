<template>
  <div :class="css['nav-arrows']">
    <button
      :class="[ css['nav-arrow'], css['nav-arrow--left'] ]"
      :title="titleprev"
      :disabled="itemindex <= 0"
      @click="
        --itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
      <img height="24" width="24" src="~assets/icons/arrow-alt-left--normal.svg" />
      <span aria-hidden="true">{{ captionprev }}</span>
    </button>

    <button
      :class="[ css['nav-arrow'], css['nav-arrow--right'] ]"
      :title="titlenext"
      :disabled="itemindex >= itemurls.length - 1"
      @click="
        ++itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
      <span aria-hidden="true">{{ captionnext }}</span>
      <img height="24" width="24" src="~assets/icons/arrow-alt-right--normal.svg" />
    </button>
  </div>
</template>

<script>
import Navigation, { cssmap } from '@/mixins/navigation';

export default {
  name: 'Navbar',
  mixins: [Navigation],
  data() {
    return {
      css: cssmap,
    };
  },
  computed: {
    captionprev() {
      return this.sequenceindex > 0 && this.firstiteminsequence === this.itemindex
        ? 'Prev Manifest'
        : 'Prev Item';
    },
    captionnext() {
      const lastindexes = this.lastiteminsequence;

      return this.sequenceindex < this.sequencecount - 1
        && lastindexes[this.sequenceindex] === this.itemindex
        ? 'Next Manifest'
        : 'Next Item';
    },
    lastiteminsequence() {
      const lastindexes = [];

      for (let seqidx = 0; seqidx < this.sequencecount; seqidx += 1) {
        lastindexes[seqidx] = seqidx === 0
          ? this.manifests[seqidx].sequence.length - 1
          : lastindexes[(seqidx - 1)] + this.manifests[seqidx].sequence.length;
      }
      return lastindexes;
    },
  },
};
</script>
