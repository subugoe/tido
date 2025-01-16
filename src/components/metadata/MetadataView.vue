<template>
  <div class="metadata-view t-overflow-auto t-break-all t-px-4 t-pt-4">
    <component
      v-for="(documentType, i) in orderDocumentsMetadata"
      :is="resolveComponent(documentType)"
      :key="i"
    >
    </component>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import { resolveComponent } from 'vue'

import { getMetadataView } from '@/utils/metadata'

defineProps({
  options: Object,
})

const configStore = useConfigStore()

const config = computed(() => configStore.config)

const metadataView = computed(() => getMetadataView(config.value.panels))

const userDocumentsOrder = computed(
  () => metadataView.value.connector.options.documentsOrder
)

let orderDocumentsMetadata = computed(() =>
  getOrderDocuments(userDocumentsOrder.value)
)

function getOrderDocuments(userOrderDocuments) {
  let orderDocumentsMetadata = []

  if (!userOrderDocuments || userOrderDocuments.length === 0)
    return ['CollectionMetadata', 'ManifestMetadata', 'ItemMetadata']

  for (let i = 0; i < userOrderDocuments.length; i++) {
    const document = userOrderDocuments[i].toLowerCase()

    if (document.includes('collection'))
      orderDocumentsMetadata.push('CollectionMetadata')
    if (document.includes('manifest'))
      orderDocumentsMetadata.push('ManifestMetadata')
    if (document.includes('item')) orderDocumentsMetadata.push('ItemMetadata')
  }

  return orderDocumentsMetadata
}
</script>
