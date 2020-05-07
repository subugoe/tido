<template>
  <div>
    <q-list v-if="Object.keys(collection).length">
      <q-item>
        <q-item-section class="text-h6 caps">Collection</q-item-section>
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
        <q-item-section class="text-h6 caps">
          {{ config.manifestlabel }} {{ sequenceindex + 1 }} / {{ manifests.length }}
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Label:</q-item-label>
          <q-item-label>{{ manifesttitle }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator inset class="q-mt-md q-mb-sm" />

    <q-list>
      <q-item>
        <q-item-section class="text-h6 caps">
          {{ config.itemlabel }} {{ itemindex + 1 }} / {{ itemcount }}
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Label:</q-item-label>
          <q-item-label>{{ pagelabel }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Language:</q-item-label>
          <q-item-label>{{ language }}</q-item-label>
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
    config: Object,
    language: String,
    manifests: Array,
    pagelabel: String,
  },
  data() {
    return {
      itemindex: 0,
      sequenceindex: 0,
    };
  },
  computed: {
    manifesttitle() {
      return this.manifests[this.sequenceindex].label;
    },
    itemcount() {
      return this.manifests[this.sequenceindex].sequence.length;
    },
  },
  mounted() {
    this.$root.$on('update-sequence-index', (index) => {
      this.sequenceindex = index;
    });

    this.$root.$on('update-item', (url) => {
      this.manifests[this.sequenceindex].sequence.forEach((item, index) => {
        if (item.id === url) {
          this.itemindex = index;
        }
      });
    });
  },
};
</script>

<style scoped>
.caps {
  font-variant: small-caps;
}
</style>
