<template>
  <div>
    <h1
      v-if="collectionTitle"
      class="text-h3 text-bold text-uppercase q-mb-none q-mt-xs"
      :class="$q.dark.isActive ? 'text-light' : 'text-dark'"
    >
      {{ collectionTitle }}
    </h1>

    <h2
      class="text-h4 text-bold text-uppercase  q-mt-none q-mb-none"
      :class="$q.dark.isActive ? 'text-light' : 'text-dark'"
    >
      <span>{{ manifestTitle }}</span>

      <q-icon
        class="q-pb-xs q-pl-sm q-pr-sm"
        size="xs"
        :color="$q.dark.isActive ? 'white' : 'accent'"
        :name="fasChevronRight"
      />

      <span>{{ $t('Sheet') }} {{ item.n }}</span>
    </h2>
  </div>
</template>

<script>
import { fasChevronRight } from '@quasar/extras/fontawesome-v5';

export default {
  name: 'Titlebar',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    manifestTitle() {
      return this.manifests[this.sequenceIndex]?.label;
    },
    collectionTitle() {
      return this.$store.getters['contents/collectionTitle'];
    },
    sequenceIndex() {
      return this.$store.getters['contents/selectedSequenceIndex'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
  },
  created() {
    this.fasChevronRight = fasChevronRight;
  },
};
</script>
