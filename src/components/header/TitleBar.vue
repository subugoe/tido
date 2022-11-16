<template>
  <div>
    <h1 v-if="collectionTitle" class="t-h3 text-bold q-mb-sm" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
      {{ collectionTitle }}
    </h1>
    <h2 v-if="manifestTitle" class="t-h4 q-mt-none q-mb-md" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
      <span>{{ manifestTitle }}</span>
      <q-icon
        class="q-px-sm"
        size="xs"
        :color="$q.dark.isActive ? 'white' : 'grey-7'"
        name="bi-chevron-right"
      />
      <span>{{ $t('Sheet') }} {{ item.n }}</span>
    </h2>
    <h1 v-else class="t-h3 text-bold q-mt-xs" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
      TIDO Viewer
    </h1>
  </div>
</template>

<script>
import { icon } from '@/utils/icon';

export default {
  name: 'Titlebar',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    collectionTitle() {
      return this.$store.getters['contents/collectionTitle'];
    },
    manifestTitle() {
      return this.$store.getters['contents/manifest']?.label;
    },
  },
  methods: {
    icon(name) {
      return icon(name);
    },
  },
};
</script>
