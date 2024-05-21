<template>
  <div class="t-flex t-flex-col t-justify-center">
    <template v-if="collectionTitle || manifestTitle">
      <template v-if="collectionTitle">
        <h1 v-if="collectionTitle" class="t-text-2xl t-font-bold">
          {{ collectionTitle }}
        </h1>
        <h2 v-if="manifestTitle" class="t-text-xl t-mt-2 t-mb-6">
          <span>{{ manifestTitle }}</span>
          <BaseIcon
            v-if="item"
            class="t-px-2 text-gray-500 dark:text-gray-300"
            name="chevronRight"
          />
          <span v-if="item">{{ labels.item }} {{ item.n }}</span>
        </h2>
      </template>
      <template v-else>
        <h1 class="t-text-2xl t-font-bold t-mt-2 t-mb-4">
          <span>{{ manifestTitle }}</span>
          <BaseIcon
            v-if="item"
            class="t-px-2 text-gray-500 dark:text-gray-300"
            name="chevronRight"
          />
          <span v-if="item">{{ labels.item }} {{ item.n }}</span>
        </h1>
      </template>
    </template>
    <h1 v-else class="t-text-2xl t-font-bold t-mb-4 t-mt-2">
      TIDO Viewer
    </h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import BaseIcon from '@/components/base/BaseIcon.vue';


export interface Props {
  item: Item
}

const props = withDefaults(defineProps<Props>(), {
  item: () => <Item>{}
})

const store = useStore();

const collectionTitle = computed<string | null>(() => store.getters['contents/collectionTitle']);
const manifestTitle = computed<string | undefined>(() => store.getters['contents/manifest']?.label);
const labels = computed<Labels>(() => store.getters['config/config'].labels || {
  manifest: 'manifest',
  item: 'item',
});
</script>