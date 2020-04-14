export default {
  props: {
    itemurls: Array,
    manifests: Array,
  },
  data() {
    return {
      itemindex: 0,
      sequenceindex: 0,
    };
  },
  methods: {
    updateItem() {
      this.$root.$emit('update-item', this.itemurls[this.itemindex]);
    },
    updateMetadata() {
      this.$root.$emit('update-metadata', this.sequenceindex);
    },
    updateTreeNodes() {
      this.$root.$emit('update-tree-nodes', this.sequenceindex);
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
    sequencecount() {
      return this.manifests.length;
    },
    itemspersequence() {
      const itemcount = [];

      for (let ctr = 0; ctr < this.sequencecount; ctr += 1) {
        itemcount[ctr] = this.manifests[ctr].sequence.length;
      }
      return itemcount;
    },
    firstiteminsequence() {
      const itemcount = this.itemspersequence;

      let itemidx = 0;
      for (let ctr = 0; ctr < this.sequenceindex; ctr += 1) {
        itemidx += itemcount[ctr];
      }
      return itemidx;
    },
    computedsequenceindex() {
      const itemcount = this.itemspersequence;

      let itemidx = 0;
      let sequenceidx = 0;

      for (let ctr = 0; ctr < this.sequencecount; ctr += 1) {
        itemidx += itemcount[ctr];

        if (itemidx <= this.itemindex) {
          sequenceidx += 1;
        }
      }
      return sequenceidx;
    },
    titleprev() {
      return this.itemindex <= 0 ? '' : 'Previous';
    },
    titlenext() {
      return this.itemindex >= this.itemurls.length - 1 ? '' : 'Next';
    },
  },
  mounted() {
    this.$root.$on('update-item-index', (index) => {
      this.itemindex = index;
    });
    this.$root.$on('update-sequence-index', (index) => {
      this.sequenceindex = index;
    });
  },
};
