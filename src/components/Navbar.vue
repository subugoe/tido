<template>
  <div>
    <q-btn
      v-if="manifest"
      :disable="!hasPrev"
      unelevated
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
      size="xs"
      padding="xs"
      class="q-px-sm q-mr-sm previous-item"
      @click="prev"
    >
      <q-icon
        :name="fasArrowLeft"
        size="16px"
        class="q-pr-xs"
      />
      {{ prevButtonLabel }}
    </q-btn>

    <q-btn
      v-if="manifest"
      unelevated
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
      :disable="!hasNext"
      size="xs"
      padding="xs"
      class="q-px-sm next-item"
      @click="next"
    >
      {{ nextButtonLabel }}
      <q-icon
        :name="fasArrowRight"
        size="16px"
        class="q-pl-xs"
      />
    </q-btn>
  </div>
</template>

<script>
import {
  fasArrowRight,
  fasArrowLeft,
  fasCheck,
} from '@quasar/extras/fontawesome-v5';

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
        const prevManifestIndex = this.manifests.findIndex(({ id }) => id === this.manifest.id) - 1;
        if (prevManifestIndex < 0) return false;
      }

      return true;
    },
    hasNext() {
      const nextIndex = this.itemIndex + 1;
      if (nextIndex > this.manifest.sequence.length - 1) {
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
      return this.$store.getters['config/config'].labels || {};
    },
  },
  created() {
    this.fasArrowRight = fasArrowRight;
    this.fasArrowLeft = fasArrowLeft;
    this.fasCheck = fasCheck;
  },
  methods: {
    prev(event) {
      const prevIndex = this.itemIndex - 1;
      let itemUrl = '';

      if (prevIndex < 0) {
        // If the index is lower than 0, we will load the prev manifest's last item
        const prevManifestIndex = this.manifests.findIndex(({ id }) => id === this.manifest.id) - 1;
        if (prevManifestIndex < 0) return;

        const prevManifest = this.manifests[prevManifestIndex];
        this.$store.commit('contents/setManifest', prevManifest);
        itemUrl = prevManifest.sequence[prevManifest.sequence.length -1].id;

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
        itemUrl = nextManifest.sequence[0].id;
      } else {
        itemUrl = this.manifest.sequence[nextIndex].id;
      }
      this.$store.dispatch('contents/initItem', itemUrl);
    }
  }
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
