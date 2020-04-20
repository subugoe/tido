<template>
  <div>
    <q-list v-if="Object.keys(collection).length">
      <q-item>
        <q-item-section class="text-h6">Collection</q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Title:</q-item-label>
          <q-item-label>
            {{ collection.title ? collection.title[0].title : '' }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Collector:</q-item-label>
          <q-item-label>
            {{ collection.collector ? collection.collector.name : '' }}
            </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Description:</q-item-label>
          <q-item-label>
            {{ collection.description }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-separator inset class="q-mt-md q-mb-sm" />
    <q-list>
      <q-item>
        <q-item-section class="text-h6">
          Manuscript {{ sequenceindex + 1 }} / {{ manifests.length }}
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Label:</q-item-label>
          <q-item-label>{{ manifesttitle }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  name: 'Metadata',
  props: {
    collection: Object,
    manifests: Array,
  },
  data() {
    return {
      sequenceindex: 0,
    };
  },
  computed: {
    manifesttitle() {
      return this.manifests[this.sequenceindex].label;
    },
  },
  mounted() {
    this.$root.$on('update-metadata', (index) => {
      this.sequenceindex = index;
    });
  },
};
</script>
