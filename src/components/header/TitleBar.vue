<template>
  <div class="flex column justify-center">
    <template v-if="collectionTitle || manifestTitle">
      <template v-if="collectionTitle">
        <h1 v-if="collectionTitle" class="text-h1 q-mt-sm q-mb-none text-bold" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
          {{ collectionTitle }}
        </h1>
        <h2 v-if="manifestTitle" class="text-h2 q-mt-sm q-mb-lg" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
          <span>{{ manifestTitle }}</span>
          <q-icon
            v-if="item"
            class="q-px-sm"
            size="xs"
            :color="$q.dark.isActive ? 'white' : 'grey-7'"
            :name="arrowIcon"
          />
          <span v-if="item">{{ t('Sheet') }} {{ item.n }}</span>
        </h2>
      </template>
      <template v-else>
        <h1 class="text-h1 text-bold q-mt-sm q-mb-md" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
          <span>{{ manifestTitle }}</span>
          <q-icon
            v-if="item"
            class="q-px-sm"
            size="xs"
            :color="$q.dark.isActive ? 'white' : 'grey-7'"
            :name="arrowIcon"
          />
          <span v-if="item">{{ t('Sheet') }} {{ item.n }}</span>
        </h1>
      </template>
    </template>
    <h1 v-else class="text-h1 text-bold q-mb-md q-mt-sm" :class="$q.dark.isActive ? 'text-light' : 'text-dark'">
      TIDO Viewer
    </h1>
  </div>
</template>

<script setup>
import { biChevronRight } from '@quasar/extras/bootstrap-icons';
import { computed, onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
});

const arrowIcon = ref(null);

const collectionTitle = computed(() => store.getters['contents/collectionTitle']);
const manifestTitle = computed(() => store.getters['contents/manifest']?.label);

onBeforeMount(() => {
  arrowIcon.value = biChevronRight;
});

</script>
