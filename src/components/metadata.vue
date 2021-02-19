<template>
  <div class="scroll-panel">
    <!-- Collection-->
    <q-list v-if="config.meta.collection.all && Object.keys(collection).length">
      <q-item>
        <q-item-section class="text-h6 caps">
          Collection
        </q-item-section>
      </q-item>

      <q-item
        v-for="(itm, key) in mSpecs.collection"
        :key="key"
      >
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ key }}:
          </q-item-label>

          <q-item-label>
            {{ itm }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator
        v-if="showSeparator(config.meta.collection.all && (config.meta.manifest.all || config.meta.item.all))"
        class="q-mt-md q-mb-sm"
        inset
      />
    </q-list>

    <!-- Manifest-->
    <q-list v-if="config.meta.manifest.all">
      <q-item>
        <q-item-section class="text-h6 caps">
          {{ labels.manifest }} {{ sequenceindex + 1 }} / {{ manifests.length }}
        </q-item-section>
      </q-item>

      <q-item
        v-for="(itm, key) in mSpecs.manifest"
        :key="key"
      >
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ key }}:
          </q-item-label>

          <q-item-label>
            {{ itm }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <!--  this part renders the metadata object provided by the manifest object according to the generic API specs given:
            pls refer to https://subugoe.pages.gwdg.de/emo/text-api/page/specs/#manifest-object
      -->
      <div v-if="manifests[sequenceindex].metadata">
        <q-item
          v-for="(meta, idx) in manifests[sequenceindex].metadata"
          :key="idx"
        >
          <q-item-section>
            <q-item-label
              overline
              class="text-uppercase"
            >
              {{ meta.key }}:
            </q-item-label>

            <q-item-label>{{ meta.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <!--
          End of metadata object
      -->
    </q-list>

    <q-separator
      v-if="showSeparator(config.meta.manifest.all && config.meta.item.all)"
      inset
      class="q-mt-md q-mb-sm"
    />

    <!-- Item-->
    <q-list v-if="config.meta.item.all">
      <q-item>
        <q-item-section class="text-h6 caps">
          {{ labels.item }} {{ itemindex + 1 }} / {{ itemcount }}
        </q-item-section>
      </q-item>

      <q-item
        v-for="(itm, key) in mSpecs.item"
        :key="key"
      >
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ key }}:
          </q-item-label>

          <q-item-label>
            {{ itm }}
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
    language: {
      type: String,
      default: () => '',
    },
    manifests: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      itemindex: 0,
      mSpecs: {
        collection: {
          Collector: this.collection.collector.name,
          Description: this.collection.description,
          Title: this.collection.title[0].title,
        },
        manifest: {
          // Label: this.manifests[this.sequenceindex].label,
          // License: this.manifests[this.sequenceindex].license,
        },
        item: {
          // 'Image License': this.item.image.license.id,
          // 'Image Notes': this.item.image.license.notes,
          Label: this.item.n,
          Language: this.item.lang[0],
        },
      },
      sequenceindex: 0,
    };
  },
  computed: {
    itemcount() {
      return this.manifests[this.sequenceindex].sequence.length;
    },
    mLabel() {
      return this.manifests[this.sequenceindex].label;
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
