<template>
  <div :class="css['nav-arrows']">
    <button
      :class="[ css['nav-arrow'], css['nav-arrow--left'] ]"
      :title="titleprev"
      v-html="previous()"
      :disabled="itemindex <= 0"
      @click="
        --itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
    </button>

    <button
      :class="[ css['nav-arrow'], css['nav-arrow--right'] ]"
      :title="titlenext"
      v-html="next()"
      :disabled="itemindex >= itemurls.length - 1"
      @click="
        ++itemindex;
        sequenceindex = computedsequenceindex;
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
  name: 'Navbar',
  mixins: [Navigation],
  data() {
    return {
      css: cssmap,
    };
  },
  methods: {
    previous() {
      return `${this.vectors['arrow-alt-left']}<span aria-hidden="true">${this.captionprev}</span>`;
    },
    next() {
      return `<span aria-hidden="true">${this.captionnext}</span>${this.vectors['arrow-alt-right']}`;
    },
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
