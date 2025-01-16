<template>
  <div class="item-metadata t-mb-7">
    <h3 class="t-text-xl t-font-semibold t-mb-2">
      {{ $t(labels.item) }} {{ number }} / {{ total }}
    </h3>
    <div v-for="(meta, idx) in metadata" :key="idx" class="t-mb-4">
      <MetadataItem :item="meta" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useContentsStore } from '@/stores/contents'
import { orderMetadataItems } from '@/utils/metadata'

import MetadataItem from '@/components/metadata/MetadataItem.vue'
import { getMetadataView } from '@/utils/metadata'

const configStore = useConfigStore()
const contentStore = useContentsStore()

const item = computed<Item>(() => contentStore.item)
const itemUrl = computed<string>(() => contentStore.itemUrl)
const manifest = computed<Manifest>(() => contentStore.manifest)
const itemsCount = computed<number>(() => manifest.value?.sequence.length)
const labels = computed<Labels>(() => configStore.config.labels)
const number = computed<number>(() =>
  manifest.value
    ? manifest.value.sequence.findIndex(({ id }) => id === itemUrl.value) + 1
    : 1
)
const total = computed<number>(() => itemsCount.value ?? 1)

const metadata = computed(() => {
  let itemOrder = getMetadataView(useConfigStore().config.panels)
    .connector.options.itemOrder

  let defaultMetadata = [
    { key: 'label', value: item.value.n },
    { key: 'language', value: item.value?.lang?.join(',') },
    { key: 'image_license', value: item.value?.image?.license?.id },
    { key: 'image_notes', value: item.value?.image?.license?.notes },
  ].filter((i) => i.value)

  let orderedMetadata = []
  if (itemOrder?.length > 0) {
    orderedMetadata = orderMetadataItems(itemOrder, defaultMetadata)
    return orderedMetadata
  }
  return defaultMetadata
})
</script>
