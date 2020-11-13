<template>
  <div class="scroll-panel">
    <!-- Collection-->
    <q-list v-if="Object.keys(collection).length && config.meta.collection.all">
      <q-item>
        <q-item-section class="text-h6 caps">
          {{ $t('Collection') }}
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.collection.title">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t('Title') }}:
          </q-item-label>
          <q-item-label>
            {{ collection.title ? collection.title[0].title : '' }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.collection.collector">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t('Collector') }}:
          </q-item-label>
          <q-item-label>
            {{ collection.collector && collection.collector.name ? collection.collector.name : '' }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.collection.description">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t('Description') }}:
          </q-item-label>
          <q-item-label>
            {{ collection.description }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator
        v-if="showSeparator(config.meta.collection.all)"
        inset
        class="q-mt-md q-mb-sm"
      />
    </q-list>

    <!-- Manifest-->
    <q-list v-if="config.meta.manifest.all">
      <q-item>
        <q-item-section class="text-h6 caps">
          {{ $t(labels.manifest) }} {{ sequenceindex + 1 }} / {{ manifests.length }}
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.manifest.label">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            Label:
          </q-item-label>
          <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.manifest.creation">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t('Year') }}:
          </q-item-label>
          <q-item-label>{{ date }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.manifest.editor">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t('Editor') }}:
          </q-item-label>
          <q-item-label>{{ editor }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.manifest.location">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t('Location') }}:
          </q-item-label>
          <q-item-label>{{ location }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.manifest.origin">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t('Origin') }}:
          </q-item-label>
          <q-item-label>{{ origin }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator
      v-if="showSeparator(config.meta.manifest.all)"
      inset
      class="q-mt-md q-mb-sm"
    />

    <!-- Item-->
    <q-list v-if="config.meta.item.all">
      <q-item>
        <q-item-section class="text-h6 caps">
          {{ $t(labels.item) }} {{ itemindex + 1 }} / {{ itemcount }}
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.item.label">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            Label:
          </q-item-label>
          <q-item-label>{{ itemlabel }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="config.meta.item.language">
        <q-item-section>
          <q-item-label
            overline
            class="text-uppercase"
          >
            {{ $t('Language') }}:
          </q-item-label>
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
    config: {
      type: Object,
      default: () => {},
    },
    collection: {
      type: Object,
      default: () => {},
    },
    itemlabel: {
      type: String,
      default: () => '',
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
      sequenceindex: 0,
    };
  },
  computed: {
    date() {
      return this.manifests[this.sequenceindex]['x-date'];
    },
    editor() {
      let editors = '';

      Object.values(this.manifests[this.sequenceindex]['x-editor']).forEach((ed) => {
        editors += `${ed.name}, `;
      });
      return editors.slice(0, -2);
    },
    itemcount() {
      return this.manifests[this.sequenceindex].sequence.length;
    },
    location() {
      return this.manifests[this.sequenceindex]['x-location'];
    },
    origin() {
      return this.manifests[this.sequenceindex]['x-origin'];
    },
    title() {
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
    showSeparator(showme) {
      return showme === true;
    },
  },
};
</script>
