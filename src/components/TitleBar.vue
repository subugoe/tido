<template>
  <div>
    <h1 v-if="collectionTitle" class="text-h3 text-bold q-mb-sm" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
      {{ collectionTitle }}
    </h1>
    <h2 v-if="manifestTitle" class="text-h4 q-mt-none q-mb-md" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
      <span>{{ manifestTitle }}</span>
      <q-icon
        class="q-px-sm"
        size="xs"
        :color="$q.dark.isActive ? 'white' : 'grey-7'"
        :name="icon('fasChevronRight')"
      />
      <span>{{ $t('Sheet') }} {{ item.n }}</span>
    </h2>
    <h1 v-else class="text-h3 text-bold q-mt-xs" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
      TIDO Viewer
    </h1>
  </div>
</template>

<script>
import { fasChevronRight } from '@quasar/extras/fontawesome-v5';
import * as Icons from "@quasar/extras/fontawesome-v5";

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
  created() {
    this.fasChevronRight = fasChevronRight;
  },
  methods: {
    icon(name) {
      return Icons[name];
    }
  }
};
</script>
