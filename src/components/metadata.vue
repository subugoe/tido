<template>
  <div class="item-content panel__meta">
    <!-- Collection-->
    <q-list v-if="config.meta.collection.all && Object.keys(collection).length">
      <q-item class="q-pa-none">
        <q-item-section class="text-h6 caps">
          Collection
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mCollection, index) in metadataCollection"
        :key="index"
        class="q-px-none"
      >
        <q-item-section v-if="Object.keys(mCollection).length">
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ mCollection.id }}
          </q-item-label>

          <q-item-label>
            {{ mCollection.data }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Manifest-->
    <q-list v-if="config.meta.manifest.all && itemcount">
      <q-item class="q-pa-none">
        <q-item-section class="text-h6 caps">
          {{ labels.manifest }} {{ sequenceindex + 1 }} / {{ manifests.length }}
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mManifest, index) in metadataManifest"
        :key="index"
        class="q-px-none"
      >
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ mManifest.id }}
          </q-item-label>

          <q-item-label>
            {{ mManifest.data }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <div v-if="manifests[sequenceindex].metadata">
        <q-item
          v-for="(meta, idx) in manifests[sequenceindex].metadata"
          :key="idx"
          class="q-px-none"
        >
          <q-item-section>
            <q-item-label
              overline
              class="text-uppercase"
            >
              {{ meta.key }}
            </q-item-label>

            <q-item-label>{{ meta.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>

    <!-- Item-->
    <q-list v-if="config.meta.item.all">
      <q-item class="q-pa-none">
        <q-item-section class="text-h6 caps">
          {{ labels.item }} {{ itemindex + 1 }} / {{ itemcount }}
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mItem, index) in metadataItem"
        :key="index"
        class="q-px-none"
      >
        <q-item-section v-if="Object.keys(mItem).length">
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ mItem.id }}
          </q-item-label>

          <q-item-label>
            {{ mItem.data }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>

export default {
  name: 'Metadata',
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    collection: {
      type: Object,
      default: () => {},
    },
    item: {
      type: Object,
      default: () => {},
    },
    labels: {
      type: Object,
      default: () => {},
    },
    manifests: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      itemindex: 0,
      sequenceindex: 0,
    };
  },
  computed: {
    itemcount() {
      return this.manifests[this.sequenceindex].sequence.length;
    },
    metadataCollection() {
      const metadata = [
        { id: 'Title', data: this.collection.title[0].title },
        { id: 'Collector', data: this.collection.collector.name },
      ];

      if (this.collection.description) {
        metadata.push({ id: 'Description', data: this.collection.description });
      }
      return metadata;
    },
    metadataItem() {
      const metadata = [];

      if (this.item.n) {
        metadata.push(
          { id: 'Label', data: this.item.n },
        );
      }
      if (this.item.lang) {
        metadata.push(
          { id: 'Language', data: this.item.lang[0] },
        );
      }
      if (this.item.image && this.item.image.license) {
        metadata.push(
          { id: 'Image License', data: this.item.image.license.id },
          { id: 'Image Notes', data: this.item.image.license.notes },
        );
      }

      return metadata;
    },
    metadataManifest() {
      const metadata = [];

      metadata.push(
        { id: 'Label', data: this.manifests[this.sequenceindex].label },
      );

      if (Array.isArray(this.manifests[this.sequenceindex].license)) {
        metadata.push(
          { id: 'License', data: this.manifests[this.sequenceindex].license[0].id },
        );
      }

      return metadata;
    },
  },
  mounted() {
    this.$root.$on('update-sequence-index', (index) => {
      this.sequenceindex = index;
    });

    this.$root.$on('update-item', (url, seqindex = null) => {
      if (seqindex !== null) {
        this.sequenceindex = seqindex;
      }
      this.manifests[this.sequenceindex].sequence.forEach((item, index) => {
        if (item.id === url) {
          this.itemindex = index;
        }
      });
    });
  },
  methods: {
    showSeparator(condition) {
      return condition === true;
    },
  },
};
</script>

<style lang="scss" scoped>
.panel__meta {
  padding: 8px;
}
</style>
