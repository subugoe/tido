<template>
  <div class="q-gutter-sm">
    <q-btn
      unelevated
      color="black"
      :disabled="itemindex <= 0"
      @click="
        --itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
      <q-icon
        :name="fasArrowLeft"
        size="24px"
        class="q-pr-sm"
        />
      {{ captionprev }}
    </q-btn>
    <q-btn
      unelevated
      color="black"
      :disabled="itemindex >= itemurls.length - 1"
      @click="
        ++itemindex;
        sequenceindex = computedsequenceindex;
        updateItem(itemurls[itemindex]);
        updateMetadata(sequenceindex);
        updateTreeNodes(sequenceindex);"
      >
      {{ captionnext }}
      <q-icon
        :name="fasArrowRight"
        size="24px"
        class="q-pl-sm"
        />
    </q-btn>
  </div>
</template>

<script>
import Navigation, { cssmap } from '@/mixins/navigation';
import { fasArrowRight, fasArrowLeft } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Navbar',
  mixins: [Navigation],
  data() {
    return {
      css: cssmap,
    };
  },
  created() {
    this.fasArrowRight = fasArrowRight;
    this.fasArrowLeft = fasArrowLeft;
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
