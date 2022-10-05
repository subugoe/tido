export default {
  data() {
    return {
      tab: '',
    };
  },
  methods: {
    toggleSheet(itemIndex) {
      const link = this.itemUrls[itemIndex];
      this.navigate(link);
    },
    navigate(url) {
      const isSameQueryUrl = this.$route.query.item === url;
      if (isSameQueryUrl) {
        return;
      }
      console.log('navigate', url);

      this.$store.dispatch('config/resetInitialized');
      this.$router.push({ query: { ...this.$route.query, item: url } });
    },
  },
  computed: {
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    item() {
      return this.$store.getters['contents/item'];
    },
    itemindex() {
      return this.$store.getters['contents/selectedItemIndex'];
    },
    itemUrls() {
      return this.$store.getters['contents/itemUrls'];
    },
    sequenceindex() {
      return this.$store.getters['contents/selectedSequenceIndex'];
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
          : lastindexes[seqidx - 1] + this.manifests[seqidx].sequence.length;
      }

      return lastindexes;
    },

    sequencecount() {
      return this.manifests.length;
    },
    config() {
      return this.$store.getters['config/config'];
    },
    labels() {
      return this.config.labels || {};
    },
  },
};
