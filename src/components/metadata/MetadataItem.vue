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
    <CopyCitation
      v-if="showCopyCitation(item.key, configStore.config)"
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
import { computed } from "vue";
import MetadataLink from "@/components/metadata/MetadataLink.vue";
import MetadataValue from "@/components/metadata/MetadataValue.vue";
import CopyCitation from "@/components/metadata/CopyCitation.vue";
import { useConfigStore } from "@/stores/config";

const props = defineProps<{
  item: Metadata;
}>();

const label = computed<string>(() => props.item?.key || "other");
const childItems = computed<Metadata>(() => props.item?.metadata || []);
const configStore = useConfigStore();

function isLink(): boolean {
  const regex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  const matches =
    typeof props.item?.key === "string" ? props.item?.key?.match(regex) : null;

  return matches !== null;
}

function getMetadataView(panels) {
  let metadataView
  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i]
    const viewsPanel = panel.views

    if (!viewsPanel || viewsPanel.length === 0) continue

    metadataView = viewsPanel.filter((view) => view.connector.id === 2)

    if (metadataView.length > 0) return metadataView[0]
  }

  return null
}

function showCopyCitation(key, config) {
  if (!config.panels || config.panels.length === false) return false
  const metadataView = getMetadataView(config.panels);
  // when we retrieve each MetadataItem, we want to know whether we are in the row of the citation
  if (metadataView.connector.options.citationKey) {
    return metadataView.connector.options.citationKey === key;
  }
  return false;
}
</script>

<style scoped>
.nested-metadata {
  margin-left: 8px;
  margin-top: 2.5px;
}
</style>
