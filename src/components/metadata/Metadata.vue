<template>
  <div class="metadata-container q-pa-md q-pt-md">
    <!-- Collection-->
    <q-list
      v-if="config.meta.collection.all && Object.keys(collection).length"
      dense
      class="q-mb-lg"
    >
      <q-item class="no-padding">
        <q-item-section
          dense
        >
          <h3>{{ $t('Collection') }}</h3>
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mCollection, index) in metadataCollection"
        :key="index"
        dense
        class="q-mb-sm no-padding"
      >
        <q-item-section
          v-if="Object.keys(mCollection).length"
          class="q-mb-sm"
        >
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t(mCollection.id) }}
          </q-item-label>

          <ContentUrls :content="mCollection.data" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Manifest-->
    <q-list
      v-if="config.meta.manifest.all && itemcount"
      dense
      class="q-mb-lg"
    >
      <q-item class="no-padding">
        <q-item-section>
          <h3>{{ $t(labels.manifest) }} {{ sequenceIndex + 1 }} / {{ manifests.length }}</h3>
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mManifest, index) in metadataManifest"
        :key="index"
        class="q-mb-sm no-padding"
      >
        <q-item-section class="q-mb-sm">
          <q-item-label overline class="text-uppercase">
            {{ $t(mManifest.id) }}
          </q-item-label>

          <ContentUrls :content="mManifest.data" />
        </q-item-section>
      </q-item>

      <div v-if="manifests[sequenceIndex].metadata">
        <q-item
          v-for="(meta, idx) in manifests[sequenceIndex].metadata"
          :key="idx"
          class="q-mb-sm no-padding"
        >
          <q-item-section class="q-mb-sm no-padding">
            <MetadataItem :item="meta"/>
          </q-item-section>
        </q-item>
      </div>
    </q-list>

    <!-- Item-->
    <q-list
      v-if="config.meta.item.all"
      dense
      class="q-mb-lg"
    >
      <q-item class="no-padding">
        <q-item-section>
          <h3>{{ $t(labels.item) }} {{ itemIndex + 1 }} / {{ itemcount }}</h3>
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mItem, index) in metadataItem"
        :key="index"
        class="q-mb-xs no-padding"
      >
        <q-item-section
          v-if="Object.keys(mItem).length"
          class="q-mb-sm"
        >
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t(mItem.id) }}
          </q-item-label>

          <ContentUrls :content="mItem.data" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import ContentUrls from 'components/ContentUrls.vue';
import MetadataItem from 'components/metadata/MetadataItem';

export default {
  name: 'Metadata',
  components: {
    MetadataItem,
    ContentUrls,
  },
  computed: {
    config() {
      return this.$store.getters['config/config'];
    },
    item() {
      return this.$store.getters['contents/item'];
    },
    labels() {
      return this.config.labels;
    },
    collection() {
      return this.$store.getters['contents/collection'];
    },
    manifests() {
      return this.$store.getters['contents/manifests'];
    },
    itemcount() {
      return this.manifests[this.sequenceIndex]?.sequence.length ?? 0;
    },
    sequenceIndex() {
      return this.$store.getters['contents/selectedSequenceIndex'];
    },
    itemIndex() {
      return this.$store.getters['contents/selectedItemIndex'];
    },
    metadataCollection() {
      const mappings = {
        main: 'Title',
        sub: 'Subtitle',
      };

      return [
        ...this.collection.title
          .filter((collection) => collection)
          .map((collectionTitle) => ({
            id: mappings[collectionTitle.type] || 'Title',
            data: collectionTitle.title,
          })),
        { id: 'Collector', data: this.collection?.collector?.name },
        { id: 'Description', data: this.collection?.description },
      ].filter((collection) => collection.data);
    },
    metadataItem() {
      return [
        { id: 'Label', data: this.item.n },
        { id: 'Language', data: this.item.lang?.join(',') },
        { id: 'imageLicense', data: this.item.image?.license?.id },
        { id: 'imageNotes', data: this.item.image?.license?.notes },
      ].filter((item) => item.data);
    },
    metadataManifest() {
      return [
        { id: 'Label', data: this.manifests[this.sequenceIndex].label },
        ...(this.manifests[this.sequenceIndex].license || []).map((manifest) => ({
          id: 'License',
          data: manifest.id,
        })),
      ];
    },
    manifestsMetadata() {
      return this.manifests[this.sequenceIndex]?.metadata || [];
    },
  },
};
</script>

<style lang="scss" scoped>
.q-list {
  .q-item__label {
    color: $dark;
  }

  &--dark {
    .q-item__label {
      color: $light;
    }
  }
}
</style>
