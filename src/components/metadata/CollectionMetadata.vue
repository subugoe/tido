<template>
  <div v-if="metadata.length > 0" class="collection-metadata t-mb-7">
    <h3 class="t-text-xl t-font-semibold t-mb-2">
      {{ $t('collection') }}
    </h3>
    <div v-for="(meta, idx) in metadata" :key="idx" class="t-mb-4">
      <MetadataItem :item="meta" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useContentsStore } from '@/stores/contents'
import { useConfigStore } from '@/stores/config'
import MetadataItem from '@/components/metadata/MetadataItem.vue'
import { orderMetadataItems } from '@/utils/metadata'

import { getMetadataView } from '@/utils/metadata'

const contentStore = useContentsStore()

function getCollectorsName(collection: Collection): string | null {
  if (!collection) return null
  if (collection.collector.length === 0) return null
  if (collection.collector.length === 1) return collection.collector[0].name

  return collection.collector.map((collector) => collector.name).join(', ')
}

const collection = computed<Collection>(() => contentStore.collection)

const metadata = computed(() => {
  let collectionOrderMetadata = getMetadataView(useConfigStore().config.panels)
    .connector.options.orderCollectionMetadata

  let collectionOrderMetadataLower
  if (collectionOrderMetadata?.length > 0) {
    collectionOrderMetadataLower = collectionOrderMetadata.map((word) =>
      word.toLowerCase()
    )
  }

  if (!collection.value) return []

  const mappings = {
    main: 'title',
    sub: 'subtitle',
  }

  const collectorsName: string | null = getCollectorsName(collection.value)
  const { description } = collection.value
  const collectionTitle: Title[] = collection.value.title

  const defaultMetadata = [
    ...collectionTitle
      .filter((c) => c)
      .map((title) => ({
        key: mappings[title.type] || 'title',
        value: title.title,
      })),
    ...(collectorsName ? [{ key: 'collector', value: collectorsName }] : []),
    ...(description ? [{ key: 'description', value: description }] : []),
  ]

  let orderedMetadata = []
  if (collectionOrderMetadataLower?.length > 0) {
    orderedMetadata = orderMetadataItems(
      collectionOrderMetadataLower,
      defaultMetadata
    )
    return orderedMetadata
  }

  return defaultMetadata
})
</script>
