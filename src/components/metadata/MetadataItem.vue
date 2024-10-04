<template>
  <div>
    <h4
      v-if="!isLink()"
      class="t-font-semibold t-text-sm t-text-gray-400"
    >
      {{ $t(label) }}
    </h4>
    <MetadataLink
      v-if="isLink()"
      :url="item.key"
      :text="item.value"
    />
    <MetadataValue
      v-else
      :value="item.value"
    />
    <Citation 
      v-if="isCitationRow(item.key) " 
      :value="item.value"
    />
    <MetadataItem
      v-for="(childItem, idx) in childItems"
      :key="idx"
      :item="childItem"
      class="nested-metadata"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MetadataLink from '@/components/metadata/MetadataLink.vue';
import MetadataValue from '@/components/metadata/MetadataValue.vue';
import Citation from '@/components/metadata/Citation.vue'
import { useConfigStore } from '@/stores/config';

const props = defineProps<{
  item: Metadata,
}>();

const label = computed<string>(() => props.item?.key || 'other');
const childItems = computed<Metadata>(() => props.item?.metadata || []);
const configStore = useConfigStore()


function isLink(): boolean {
  const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
  const matches = (typeof props.item?.key === 'string') ? props.item?.key?.match(regex) : null;

  return matches !== null;
}


function getMetadataView(panels) {
  let panelMetadata = panels.filter(panel => panel.label.toLowerCase() === 'metadata');
  let metadataView;
  if (panelMetadata.length > 0) {
    // when metadata is one separate panel
    metadataView = panelMetadata[0].views[0]
  }
  else {
    // when there is one panel containing content and metadata views
    panelMetadata = panels.filter(panel => panel.label.toLowerCase() === 'contents_and_metadata')[0]
    metadataView = panelMetadata.views.filter(view => view.label.toLowerCase() === 'metadata')[0]
  }
  return metadataView
}

function isCitationInConfig(config): boolean {
  const metadataView = getMetadataView(config.panels)
  if(metadataView.connector.options?.citation) {
    return metadataView.connector.options.citation
  }
  return false
}

function isCitationRow(key) {
  // when we retrieve each MetadataItem, we want to know whether we are in the row of the citation
  return key.toLowerCase().includes('cit') || key.toLowerCase().includes('zit')
}

</script>

<style scoped>

.nested-metadata {
  margin-left: 8px;
  margin-top: 2.5px;
}

</style>
