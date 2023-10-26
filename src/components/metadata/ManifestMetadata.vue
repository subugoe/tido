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
    <q-item class="no-padding">
      <q-item-section class="q-mb-sm">
        <Actor :data="actor"></Actor>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'ManifestMetadata',
}
</script>

<script setup>
import MetadataItem from '@/components/metadata/MetadataItem.vue';
import Actor from '@/components/metadata/Actor.vue';

import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const manifest = computed(() => store.getters['contents/manifest'] );
const manifests = computed(() => store.getters['contents/manifests']);
const manifestHasItems = computed(() => manifest.value?.sequence.length > 0);
const number = computed(() => manifests.value !== null ? manifests.value.findIndex(({ id }) => id === manifest.value.id) + 1 : 1);
const total = computed(() => manifests.value !== null ? manifests.value.length : 1);
const labels = computed(() => store.getters['config/config'].labels);
const metadata = computed(() => {
  if (!manifest.value) return [];
  return [
    { key: 'label', value: manifest.value.label },
    ...(manifest.value.license || []).map((manifest) => ({
      key: 'License',
      value: manifest.id,
    })),
    ...(manifest.value.metadata || []),
  ];
});
const actor = computed(() => manifest.value?.actor );
</script>

<style scoped>

</style>
