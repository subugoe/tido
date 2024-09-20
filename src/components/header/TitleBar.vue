<template>
  <div class="t-flex t-flex-col t-justify-center">
    <template v-if="collectionTitle || manifestTitle">
      <template v-if="collectionTitle">
        <h1
          v-if="collectionTitle"
          class="sm:t-text-xl md:t-text-2xl t-font-bold"
        >
          {{ collectionTitle }}
        </h1>
        <h2
          v-if="manifestTitle"
          class="t-flex t-items-center t-flex-wrap t-text-xl t-mt-2 t-mb-6"
        >
          <span>{{ manifestTitle }}</span>
          <BaseIcon
            v-if="item"
            class="t-px-2 text-gray-500 dark:text-gray-300"
            name="chevronRight"
          />
          <span v-if="item">{{ $t('item') }} {{ item.n }}</span>
        </h2>
      </template>
      <template v-else>
        <h1 class="t-align-middle sm:t-text-xl md:t-text-2xl t-font-bold t-mt-2 t-mb-4">
          <span class="t-align-middle">{{ manifestTitle }}</span>
          <BaseIcon
            v-if="item"
            class="t-inline-flex t-align-middle t-px-2 text-gray-500 dark:text-gray-300"
            name="chevronRight"
          />
          <span
            v-if="item"
            class="t-align-middle"
          >{{ $t('item') }} {{ item.n }}</span>
        </h1>
      </template>
    </template>
    <h1
      v-else
      class="sm:t-text-xl md:t-text-2xl t-font-bold t-mb-4 t-mt-2"
    >
      TIDO Viewer
    </h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useContentsStore } from '@/stores/contents'
import BaseIcon from '@/components/base/BaseIcon.vue';
import { useI18n } from 'vue-i18n';
import { areNavButtonsLabelsInConfig } from '@/utils/translations';

export interface Props {
  item: Item
}

withDefaults(defineProps<Props>(), {
  item: () => <Item>{}
})

const configStore = useConfigStore()
const contentStore = useContentsStore()
const { t } = useI18n();


const collectionTitle = computed<string | null>(() => contentStore.collectionTitle);
const manifestTitle = computed<string | undefined>(() => contentStore.manifest?.label  );

function getPageLabel(config): string {
  return ''
  //return areNavButtonsLabelsInConfig(config) ? t('sheet') : t('item')

}
</script>
