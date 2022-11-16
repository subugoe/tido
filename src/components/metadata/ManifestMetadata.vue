<template>
  <q-list v-if="manifestHasItems" dense class="q-mb-lg">
    <q-item class="no-padding">
      <q-item-section>
        <h3>{{ $t(labels.manifest) }} {{ number }} / {{ total }}</h3>
      </q-item-section>
    </q-item>

    <q-item v-for="(meta, idx) in metadata" :key="idx" class="q-mb-sm no-padding">
      <q-item-section class="q-mb-sm no-padding">
        <MetadataItem :item="meta"/>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import MetadataItem from 'components/metadata/MetadataItem.vue';

export default {
  name: 'ManifestMetadata',
  components: {
    MetadataItem,
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
      return this.manifests !== null ? this.manifests.findIndex(({ id }) => id === this.manifest.id) + 1 : 1;
    },
    total() {
      return this.manifests !== null ? this.manifests.length : 1;
    },
    labels() {
      return this.$store.getters['config/config'].labels;
    },
    metadata() {
      if (!this.manifest) return [];
      return [
        { key: 'label', value: this.manifest.label },
        ...(this.manifest.license || []).map((manifest) => ({
          key: 'License',
          value: manifest.id,
        })),
        ...(this.manifest.metadata || []),
      ];
    },
  },
};
</script>

<style scoped>

</style>
