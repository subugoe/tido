<template>
  <div class="panel-content panel__meta">
    <!-- Collection-->
    <q-list
      v-if="Object.keys(collection).length"
      dense
    >
      <q-item class="no-padding">
        <q-item-section
          class="text-h6 caps"
          dense
        >
          Collection
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
            class="text-uppercase"
            overline
          >
            {{ mCollection.id }}
          </q-item-label>

          <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
          <q-item-label v-html="mCollection.data" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Manifest-->
    <q-list
      v-if="itemcount"
      dense
    >
      <q-item class="no-padding">
        <q-item-section class="text-h6 caps">
          {{ labels.manifest }} {{ sequenceindex + 1 }} / {{ manifests.length }}
        </q-item-section>
      </q-item>

      <q-item
        v-for="(mManifest, index) in metadataManifest"
        :key="index"
        class="q-mb-xs no-padding"
      >
        <q-item-section class="q-mb-xs">
          <q-item-label
            class="text-uppercase"
            overline
          >
            {{ mManifest.id }}
          </q-item-label>

          <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
          <q-item-label v-html="mManifest.data" />
        </q-item-section>
      </q-item>

      <div v-if="manifests[sequenceindex].metadata">
        <q-item
          v-for="(meta, idx) in manifestsMetadata"
          :key="idx"
          class="q-mb-xs no-padding"
        >
          <q-item-section class="q-mb-xs no-padding">
            <q-item-label
              class="text-uppercase"
              overline
            >
              {{ meta.key }}
            </q-item-label>

            <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
            <q-item-label v-html="meta.value" />
          </q-item-section>
        </q-item>
      </div>
    </q-list>

    <!-- Item-->
    <q-list dense>
      <q-item class="no-padding">
        <q-item-section class="text-h6 caps">
          {{ labels.item }} {{ itemindex + 1 }} / {{ itemcount }}
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
            class="text-uppercase"
            overline
          >
            {{ mItem.id }}
          </q-item-label>

          <!-- eslint-disable -- https://eslint.vuejs.org/rules/no-v-html.html -->
          <q-item-label v-html="mItem.data" />
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
      ];
      const collectionDescription = this.getMetadataLinks(this.collection.description);
      const collectorName = this.getMetadataLinks(this.collection.collector.name);

      if (this.collection.collector) {
        metadata.push({ id: 'Collector', data: collectorName });
      }

      if (this.collection.description) {
        metadata.push({ id: 'Description', data: collectionDescription });
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
        const imageLicenseId = this.getMetadataLinks(this.item.image.license.id);
        const imageLicenseNotes = this.getMetadataLinks(this.item.image.license.notes);

        metadata.push(
          { id: 'Image License', data: imageLicenseId },
          { id: 'Image Notes', data: imageLicenseNotes },
        );
      }

      return metadata;
    },
    metadataManifest() {
      const manifestLabel = this.getMetadataLinks(this.manifests[this.sequenceindex].label);
      const metadata = [];

      metadata.push(
        { id: 'Label', data: manifestLabel },
      );

      if (Array.isArray(this.manifests[this.sequenceindex].license)) {
        const manifestLicenseNotes = this.getMetadataLinks(this.manifests[this.sequenceindex].license[0].id);

        metadata.push(
          { id: 'License', data: manifestLicenseNotes },
        );
      }

      return metadata;
    },
    manifestsMetadata() {
      const metadata = [];
      const metadataValue = this.getMetadataLinks(this.manifests[this.sequenceindex].metadata[0].value);

      if (Array.isArray(this.manifests[this.sequenceindex].metadata)) {
        metadata.push(
          { key: this.manifests[this.sequenceindex].metadata[0].key, value: metadataValue },
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
    getMetadataLinks(metadataLinks) {
      const regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
      const urls = metadataLinks.match(regex);

      if (urls) {
        urls.forEach((url) => {
          const parts = url.split('/');

          metadataLinks = metadataLinks.replace(url,
            `<a
              href="${url}"
              rel='noopener noreferrer'
              style="text-decoration: none;"
              target="_blank"
              title="${parts[parts.length - 1]} - open in a new tab or window"
            >
              <span>${parts[parts.length - 1]}</span>
              <svg  viewBox="0 0 512 512" height="10" width="10">
                <path
                  fill="currentColor"
                  d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"
                />
              </svg>
            </a>`);
        });
      }

      return metadataLinks;
    },
  },
};
</script>

<style lang="scss" scoped>
.panel__meta {
  padding: 8px;
}
</style>
