<template>
  <div class="item-content panel__meta">
    <!-- Collection-->
    <q-list
      v-if="config.meta.collection.all && Object.keys(collection).length"
      dense
    >
      <q-item class="no-padding">
        <q-item-section
          dense
          class="text-h6 caps"
        >
          {{ $t('Collection') }}
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mCollection, index) in metadataCollection"
        :key="index"
        dense
        class="q-mb-xs no-padding"
      >
        <q-item-section
          v-if="Object.keys(mCollection).length"
          class="q-mb-xs"
        >
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t(mCollection.id) }}
          </q-item-label>

          <MetadataUrls :content="mCollection.data" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Manifest-->
    <q-list
      v-if="config.meta.manifest.all && itemcount"
      dense
    >
      <q-item class="no-padding">
        <q-item-section class="text-h6 caps">
          {{ $t(labels.manifest) }} {{ sequenceindex + 1 }} / {{ manifests.length }}
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mManifest, index) in metadataManifest"
        :key="index"
        class="q-mb-xs no-padding"
      >
        <q-item-section class="q-mb-xs">
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t(mManifest.id) }}
          </q-item-label>

          <MetadataUrls :content="mManifest.data" />
        </q-item-section>
      </q-item>

      <div v-if="manifests[sequenceindex].metadata">
        <q-item
          v-for="(meta, idx) in manifests[sequenceindex].metadata"
          :key="idx"
          class="q-mb-xs no-padding"
        >
          <q-item-section class="q-mb-xs no-padding">
            <q-item-label
              overline
              class="text-uppercase"
            >
              {{ $t(meta.key) }}
            </q-item-label>

            <MetadataUrls :content="meta.value" />
          </q-item-section>
        </q-item>
      </div>
    </q-list>

    <!-- Item-->
    <q-list
      v-if="config.meta.item.all"
      dense
    >
      <q-item class="no-padding">
        <q-item-section class="text-h6 caps">
          {{ $t(labels.item) }} {{ itemindex + 1 }} / {{ itemcount }}
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mItem, index) in metadataItem"
        :key="index"
        class="q-mb-xs no-padding"
      >
        <q-item-section
          v-if="Object.keys(mItem).length"
          class="q-mb-xs"
        >
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t(mItem.id) }}
          </q-item-label>

          <MetadataUrls :content="mItem.data" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import MetadataUrls from '@/components/urls.vue';

export default {
  name: 'Metadata',
  components: {
    MetadataUrls,
  },
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
      const mappings = {
        main: 'Title',
        sub: 'Subtitle',
      };

      return [
        ...this.collection.title.filter((collection) => collection).map((collectionTitle) => (
          { id: mappings[collectionTitle.type] || 'Title', data: collectionTitle.title }
        )),
        { id: 'Collector', data: this.collection?.collector?.name },
        { id: 'Description', data: this.collection?.description },
      ].filter((collection) => collection.data);
    },
    metadataItem() {
      return [
        { id: 'Label', data: this.item.n },
        { id: 'Language', data: this.item.lang.join(',') },
        { id: 'ImageLicense', data: this.item.image?.license?.id },
        { id: 'ImageNotes', data: this.item.image?.license?.notes },
      ].filter((item) => item.data);
    },
    metadataManifest() {
      return [
        { id: 'Label', data: this.manifests[this.sequenceindex].label },
        ...((this.manifests[this.sequenceindex].license || []).map((manifest) => (
          { id: 'License', data: manifest.id }
        ))),
      ];
    },
    manifestsMetadata() {
      return this.manifests[this.sequenceindex]?.metadata || [];
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
};
</script>

<style lang="scss" scoped>
.panel__meta {
  padding: 8px;
}
</style>
