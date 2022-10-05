<template>
  <div>
    <q-btn
      unelevated
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
      :disable="!hasPrev"
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
      unelevated
      :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
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
      return this.$store.getters['contents/manifests'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    item() {
      return this.$store.getters['contents/item'];
    },
    itemUrls() {
      return this.$store.getters['contents/itemUrls'];
    },
    itemIndex() {
      return this.manifest.sequence.findIndex(({ id }) => id === this.item.id)
    },
    hasPrev() {

    },
    hasNext() {

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
    prev() {
      const prevIndex = this.itemIndex - 1;
      let itemUrl = '';
      if (prevIndex < 0) {
        const manifestIndex = this.manifests.findIndex(({ id }) => id === this.manifest.id);
        if (manifestIndex < 1) return;

        const prevManifest = this.manifests[manifestIndex - 1];
        this.$store.commit('contents/setManifest', prevManifest);

        itemUrl = prevManifest.sequence[prevManifest.sequence.length -1].id;

      } else {
        itemUrl = this.manifest.sequence[prevIndex].id;
      }
      this.$store.dispatch('contents/initItem', itemUrl);
    },
    next() {

    }
  },
  created() {
    this.fasArrowRight = fasArrowRight;
    this.fasArrowLeft = fasArrowLeft;
    this.fasCheck = fasCheck;
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
