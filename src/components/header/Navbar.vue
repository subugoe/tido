<template>
  <div>
    <q-btn
      v-if="manifest"
      :disable="!hasPrev"
      unelevated
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'primary'"
      class="q-px-sm q-mr-sm previous-item"
      :icon="prevIcon"
      :label="prevButtonLabel"
      @click="prev"
      no-caps
      dense
    />

    <q-btn
      v-if="manifest"
      unelevated
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'primary'"
      :disable="!hasNext"
      class="q-px-sm next-item"
      :icon-right="nextIcon"
      :label="nextButtonLabel"
      @click="next"
      no-caps
      dense
    />
  </div>
</template>

<script>
import { biArrowLeft, biArrowRight } from '@quasar/extras/bootstrap-icons';

export default {
  name: 'Navbar',
  computed: {
    manifest() {
      return this.$store.getters['contents/manifest'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    item() {
      return this.$store.getters['contents/item'];
    },
    itemUrl() {
      return this.$store.getters['contents/itemUrl'];
    },
    itemIndex() {
      return this.manifest ? this.manifest.sequence.findIndex(({ id }) => id === this.itemUrl) : -1;
    },
    hasPrev() {
      const prevIndex = this.itemIndex - 1;
      if (prevIndex < 0) {
        if (this.manifests === null) return false;
        const prevManifestIndex = this.manifests.findIndex(({ id }) => id === this.manifest.id) - 1;
        if (prevManifestIndex < 0) return false;
      }

      return true;
    },
    hasNext() {
      const nextIndex = this.itemIndex + 1;
      if (nextIndex > this.manifest.sequence.length - 1) {
        if (this.manifests === null) return false;
        const nextManifestIndex = this.manifests.findIndex(({ id }) => id === this.manifest.id) + 1;
        if (nextManifestIndex > this.manifests.length - 1) return false;
      }
      return true;
    },
    nextButtonLabel() {
      return this.itemIndex === this.manifest.sequence.length - 1
        ? `${this.$t('next')} ${this.$t(this.labels.manifest)}`
        : `${this.$t('next')} ${this.$t(this.labels.item)}`;
    },

    prevButtonLabel() {
      return this.itemIndex === 0
        ? `${this.$t('prev')} ${this.$t(this.labels.manifest)}`
        : `${this.$t('prev')} ${this.$t(this.labels.item)}`;
    },
    labels() {
      return this.$store.getters['config/config'].labels || {
        manifest: 'manifest',
        item: 'item',
      };
    },
  },
  created() {
    this.prevIcon = biArrowLeft;
    this.nextIcon = biArrowRight;
  },
  methods: {
    prev() {
      const prevIndex = this.itemIndex - 1;
      let itemUrl = '';

      if (prevIndex < 0) {
        // If the index is lower than 0, we will load the prev manifest's last item
        const prevManifestIndex = this.manifests.findIndex(({ id }) => id === this.manifest.id) - 1;
        if (prevManifestIndex < 0) return;

        const prevManifest = this.manifests[prevManifestIndex];
        this.$store.commit('contents/setManifest', prevManifest);
        this.$store.dispatch('config/setDefaultActiveViews');
        itemUrl = prevManifest.sequence[prevManifest.sequence.length - 1].id;
      } else {
        // We load the previous item
        itemUrl = this.manifest.sequence[prevIndex].id;
      }
      this.$store.dispatch('contents/initItem', itemUrl);
    },
    next() {
      const nextIndex = this.itemIndex + 1;
      let itemUrl = '';

      if (nextIndex > this.manifest.sequence.length - 1) {
        const nextManifestIndex = this.manifests.findIndex(({ id }) => id === this.manifest.id) + 1;
        if (nextManifestIndex > this.manifests.length - 1) return;

        const nextManifest = this.manifests[nextManifestIndex];
        this.$store.commit('contents/setManifest', nextManifest);
        this.$store.dispatch('config/setDefaultActiveViews');
        itemUrl = nextManifest.sequence[0].id;
      } else {
        itemUrl = this.manifest.sequence[nextIndex].id;
      }
      this.$store.dispatch('contents/initItem', itemUrl);
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  font-size: 12px !important;
}

.q-input {
  width: 100%;
  @media (min-width: 600px) {
    margin-right: 8px;
    width: 160px;
  }
}
</style>
