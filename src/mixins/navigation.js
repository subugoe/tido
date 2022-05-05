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
      const isSameQueryUrl = this.$route.query.itemurl === url;
      if (isSameQueryUrl) {
        return;
      }
      this.$store.dispatch('config/resetInitialized');
      this.$router.push({ query: { ...this.$route.query, itemurl: url } });
    },
  },
  computed: {
    manifests() {
      return this.$store.getters['contents/manifests'];
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
    captionnext() {
      const lastindexes = this.lastiteminsequence;

      return this.sequenceindex < this.sequencecount - 1
        && lastindexes[this.sequenceindex] === this.itemindex
        ? `${this.$t('next')} ${this.$t(this.labels.manifest)}`
        : `${this.$t('next')} ${this.$t(this.labels.item)}`;
    },

    captionprev() {
      return this.sequenceindex > 0
        && this.firstiteminsequence === this.itemindex
        ? `${this.$t('prev')} ${this.$t(this.labels.manifest)}`
        : `${this.$t('prev')} ${this.$t(this.labels.item)}`;
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
