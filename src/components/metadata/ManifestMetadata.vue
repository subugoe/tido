<template>
  <q-list v-if="manifestHasItems" dense class="q-mb-lg">
    <q-item class="no-padding">
      <q-item-section>
        <h3>{{ $t(labels.manifest) }} {{ number }} / {{ manifests.length }}</h3>
      </q-item-section>
    </q-item>

    <q-item
      v-for="(metadataItem, index) in metadata"
      :key="index"
      class="q-mb-sm no-padding"
    >
      <q-item-section class="q-mb-sm">
        <q-item-label overline class="text-uppercase">
          {{ $t(metadataItem.id) }}
        </q-item-label>

        <ContentUrls :content="metadataItem.data" />
      </q-item-section>
    </q-item>

    <div v-if="manifest.metadata">
      <q-item
        v-for="(meta, idx) in manifest.metadata"
        :key="idx"
        class="q-mb-sm no-padding"
      >
        <q-item-section class="q-mb-sm no-padding">
          <MetadataItem :item="meta"/>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script>
import ContentUrls from "components/ContentUrls.vue";
import MetadataItem from "components/metadata/MetadataItem.vue";

export default {
  name: 'ManifestMetadata',
  components: {
    ContentUrls,
    MetadataItem
  },
  computed: {
    manifest() {
      return this.$store.getters['contents/manifest'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    manifestHasItems() {
      return this.manifest?.sequence.length > 0;
    },
    number() {
      return this.manifests.findIndex(({ id }) => id === this.manifest.id) + 1;
    },
    labels() {
      return this.$store.getters['config/config'].labels;
    },
    metadata() {
      return [
        { id: 'Label', data: this.manifest.label },
        ...(this.manifest.license || []).map((manifest) => ({
          id: 'License',
          data: manifest.id,
        })),
      ];
    },
  }
};
</script>

<style scoped>

</style>
