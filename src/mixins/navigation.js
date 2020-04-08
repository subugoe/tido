export default {
  props: {
    itemurls: Array,
    manifests: Array,
    vectors: Object,
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

export const cssmap = {
  'nav-arrows': 'sub-viewer-1__nav-arrows',
  'nav-arrow': 'sub-viewer-1__nav-arrow',
  'nav-arrow--left': 'sub-viewer-1__nav-arrow--left',
  'nav-arrow--right': 'sub-viewer-1__nav-arrow--right',
  description: 'objectlist-1__descr',
  fixed: 'objectlist-1--fixed',
  heading: 'objectlist-1__heading',
  item: 'objectlist-1__item',
  label: 'objectlist-1__label',
  metadata: 'objectlist-1',
};
