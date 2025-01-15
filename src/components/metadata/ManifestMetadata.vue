<template>
  <div v-if="manifestHasItems" class="manifest-metadata t-mb-7">
    <h3 class="t-text-xl t-font-semibold t-mb-2">
      {{ $t(labels.manifest) }} {{ number }} / {{ total }}
    </h3>
    <div v-for="(meta, idx) in metadata" :key="idx" class="t-mb-4">
      <MetadataItem :item="meta" />
    </div>
    <Actor :data="actor" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useContentsStore } from '@/stores/contents'
import { orderMetadataItems } from '@/utils/metadata'

import { getMetadataView } from '@/utils/metadata'

import MetadataItem from '@/components/metadata/MetadataItem.vue'
import Actor from '@/components/metadata/Actor.vue'

const configStore = useConfigStore()
const contentStore = useContentsStore()

const manifest = computed<Manifest>(() => contentStore.manifest)
const manifests = computed<Manifest[]>(() => contentStore.manifests)
const manifestHasItems = computed<boolean>(
  () => manifest.value?.sequence.length > 0
)
const number = computed<number>(() =>
  manifests.value !== null
    ? manifests.value.findIndex(({ id }) => id === manifest.value.id) + 1
    : 1
)
const total = computed<number>(() =>
  manifests.value !== null ? manifests.value.length : 1
)
const labels = computed<Labels>(() => configStore.config.labels)
const metadata = computed(() => {
  if (!manifest.value) return []

  let manifestOrderMetadata = getMetadataView(useConfigStore().config.panels)
    .connector.options.orderManifestMetadata

  let defaultMetadata = [
    { key: 'Label', value: manifest.value.label },
    ...(manifest.value.license || []).map((license) => ({
      key: 'License',
      value: license.id,
    })),
    ...(manifest.value.metadata || []).map((metaItem) => ({
      key: metaItem.key,
      value: metaItem.value,
    })),
  ]

  let orderedMetadata = []
  if (manifestOrderMetadata?.length > 0) {
    orderedMetadata = orderMetadataItems(manifestOrderMetadata, defaultMetadata)
    return orderedMetadata
  }

  return defaultMetadata
})
const actor = computed<Actor[] | undefined>(() => manifest.value?.actor)
</script>
