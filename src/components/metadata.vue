<template>
  <div>
    <!-- Collection-->
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
            {{ collection.collector && collection.collector.name ? collection.collector.name : '' }}
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

      <q-separator inset class="q-mt-md q-mb-sm" />
    </q-list>

    <!-- Manifest-->
    <q-list>
      <q-item>
        <q-item-section class="text-h6 caps">
          {{ labels.manifest }} {{ sequenceindex + 1 }} / {{ manifests.length }}
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Label:</q-item-label>
          <q-item-label>{{ title }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Year:</q-item-label>
          <q-item-label>{{ date }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Editor:</q-item-label>
          <q-item-label>{{ editor }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Location:</q-item-label>
          <q-item-label>{{ location }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Origin:</q-item-label>
          <q-item-label>{{ origin }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-separator inset class="q-mt-md q-mb-sm" />

    <!-- Item-->
    <q-list>
      <q-item>
        <q-item-section class="text-h6 caps">
          {{ labels.item }} {{ itemindex + 1 }} / {{ itemcount }}
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label overline class="text-uppercase">Label:</q-item-label>
          <q-item-label>{{ itemlabel }}</q-item-label>
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
    itemlabel: String,
    labels: Object,
    language: String,
    manifests: Array,
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
};
</script>
