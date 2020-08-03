export default {
  props: {
    config: Object,
    itemurls: Array,
    manifests: Array,
  },
  data() {
    return {
      itemindex: 0,
      sequenceindex: 0,
      tab: '',
    };
  },
  methods: {
    toggleSheet(itemIndex) {
      if (this.tab !== 'contents') {
        const link = this.itemurls[itemIndex];
        window.location.hash = `selectedItem-${link}`;

        const tree = document.getElementsByClassName('view-tree')[0];
        tree.scrollBy(0, -80);
      }

      this.sequenceindex = this.computedsequenceindex;
      this.updateItem(this.itemurls[itemIndex], this.sequenceindex);
      this.updateSequenceIndex(this.sequenceindex);
    },
    updateItem() {
      this.$root.$emit('update-item', this.itemurls[this.itemindex], this.sequenceindex);
    },
    updateSequenceIndex() {
      this.$root.$emit('update-sequence-index', this.sequenceindex);
    },
  },
  computed: {
    captionnext() {
      const lastindexes = this.lastiteminsequence;

      return this.sequenceindex < this.sequencecount - 1
      && lastindexes[this.sequenceindex] === this.itemindex
        ? `Next ${this.config.labels.manifest}`
        : `Next ${this.config.labels.item}`;
    },
    captionprev() {
      return this.sequenceindex > 0 && this.firstiteminsequence === this.itemindex
        ? `Prev ${this.config.labels.manifest}`
        : `Prev ${this.config.labels.item}`;
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
    firstiteminsequence() {
      const itemcount = this.itemspersequence;

      let itemidx = 0;
      for (let ctr = 0; ctr < this.sequenceindex; ctr += 1) {
        itemidx += itemcount[ctr];
      }
      return itemidx;
    },
    itemspersequence() {
      const itemcount = [];

      for (let ctr = 0; ctr < this.sequencecount; ctr += 1) {
        itemcount[ctr] = this.manifests[ctr].sequence.length;
      }
      return itemcount;
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
  },
  mounted() {
    this.$root.$on('update-tab', (tab) => {
      this.tab = tab;
    });

    this.$root.$on('update-item-index', (index) => {
      this.itemindex = index;
    });

    this.$root.$on('update-sequence-index', (index) => {
      this.sequenceindex = index;
    });
  },
};
