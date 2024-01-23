<template>
  <q-list v-if="manifestHasItems" dense class="t-mb-6">
    <q-item class="no-padding">
      <q-item-section>
        <h3>{{ $t(labels.manifest) }} {{ number }} / {{ total }}</h3>
      </q-item-section>
    </q-item>
    <q-item v-for="(meta, idx) in metadata" :key="idx" class="t-mb-2 no-padding">
      <q-item-section class="t-mb-2 no-padding">
        <MetadataItem :item="meta"/>
      </q-item-section>
    </q-item>
    <q-item class="no-padding">
      <q-item-section class="q-mb-2">
        <Actor :data="actor"></Actor>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import MetadataItem from '@/components/metadata/MetadataItem.vue';
import Actor from '@/components/metadata/Actor.vue';

const store = useStore();

const manifest = computed(() => store.getters['contents/manifest']);
const manifests = computed(() => store.getters['contents/manifests']);
const manifestHasItems = computed(() => manifest.value?.sequence.length > 0);
const number = computed(() => (manifests.value !== null ? manifests.value.findIndex(({ id }) => id === manifest.value.id) + 1 : 1));
const total = computed(() => (manifests.value !== null ? manifests.value.length : 1));
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
const actor = computed(() => manifest.value?.actor);
</script>

<style scoped>

</style>
