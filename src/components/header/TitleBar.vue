<template>
  <div class="flex column justify-center">
    <template v-if="collectionTitle || manifestTitle">
      <template v-if="collectionTitle">
        <h1 v-if="collectionTitle" class="text-h3 q-mt-sm q-mb-none text-bold" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
          {{ collectionTitle }}
        </h1>
        <h2 v-if="manifestTitle" class="text-h4 q-mt-sm q-mb-md" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
          <span>{{ manifestTitle }}</span>
          <q-icon
            class="q-px-sm"
            size="xs"
            :color="$q.dark.isActive ? 'white' : 'grey-7'"
            name="bi-chevron-right"
          />
          <span>{{ $t('Sheet') }} {{ item.n }}</span>
        </h2>
      </template>
      <template v-else>
        <h1 class="text-h3 q-mt-sm q-mb-xl" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
          <span>{{ manifestTitle }}</span>
          <q-icon
            class="q-px-sm"
            size="xs"
            :color="$q.dark.isActive ? 'white' : 'grey-7'"
            name="bi-chevron-right"
          />
          <span>{{ $t('Sheet') }} {{ item.n }}</span>
        </h1>
      </template>
    </template>
    <h1 v-else class="text-h3 text-bold q-mb-xl q-mt-sm" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
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
