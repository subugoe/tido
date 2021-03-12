<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm scroll-panel"
  >
    <!-- Data type Toggles -->
    <div class="text-uppercase">
      <q-toolbar>
        <q-toolbar-title>
          Show / hide data types
        </q-toolbar-title>
      </q-toolbar>

      <q-toggle
        v-model="dataTypes.model"
        :icon="mdiAccount"
        label="Names"
        size="lg"
        val="Person"
      />
      <q-toggle
        v-model="dataTypes.model"
        :icon="mdiMapMarker"
        label="Places"
        size="lg"
        val="Place"
      />
      <q-toggle
        v-model="dataTypes.model"
        :icon="mdiComment"
        label="Comments"
        size="lg"
        val="Comment"
      />
    </div>

    <!-- List of Anotations -->
    <div
      v-if="items.length"
      class="q-mt-lg"
    >
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          List of annotations
          <q-chip
            :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
            square
          >
            {{ items.length }}
          </q-chip>
        </q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item
          v-for="(annotation, index) in items"
          :key="index"
          @click="dataTypes.selected = !dataTypes.selected"
        >
          <q-item-section avatar>
            <q-icon :name="dataTypes.icons[annotation.contenttype]" />
          </q-item-section>

          <q-item-section>
            <q-item-label
              :class="['text-uppercase', dataTypes.selected ? highlight : '']"
              overline
              @click="highlightEntity(annotation.id, annotation.contenttype)"
            >
              {{ annotation.text }} ({{ annotation.comment }})
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Modifiers -->
    <div class="absolute-bottom">
      <div
        v-for="(modifier, index) in modifiers"
        :key="index"
        class="q-pa-md"
      >
        <div v-if="items.length > modifier.limit">
          <span class="text-uppercase">{{ modifier.label }}</span>

          <span class="float-right">
            <q-btn-toggle
              v-model="modifier.model"
              :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent text-white'"
              :options="modifier.options"
              size="md"
              @click="dynamicEvent(modifier.event, modifier.model)"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mdiAccount, mdiMapMarker, mdiComment } from '@quasar/extras/mdi-v5';

export default {
  name: 'Annotations',
  props: {
    annotationids: {
      type: Array,
      default: () => [],
    },
    annotations: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      highlight: {
        active: true,
      },
      dataTypes: {
        icons: {
          Comment: mdiComment,
          Person: mdiAccount,
          Place: mdiMapMarker,
        },
        model: [],
        options: [
          { label: 'Names', icon: mdiAccount, value: 'Person' },
          { label: 'Places', icon: mdiMapMarker, value: 'Place' },
          { label: 'Comments', icon: mdiComment, value: 'Comment' },
        ],
        selected: false,
      },
      modifiers: [
        {
          event: 'highlightingMode',
          label: 'Highlight',
          limit: 0,
          model: 0,
          options: [
            { label: 'All', value: 1 }, { label: 'None', value: 0 },
          ],
        },
        {
          event: 'sortByOrder',
          label: 'Sorting order',
          limit: 1,
          model: 'sequence',
          options: [
            { label: 'Alphabetic', value: 'alpha' }, { label: 'Appearance', value: 'sequence' },
          ],
        },
        {
          event: 'sortByDirection',
          label: 'Sorting direction',
          limit: 1,
          model: 'asc',
          options: [
            { label: 'Ascending', value: 'asc' }, { label: 'Descending', value: 'desc' },
          ],
        },
      ],
    };
  },
  computed: {
    items() {
      return Object.values(this.annotationids).filter((type) => this.dataTypes.model.includes(type.contenttype));
    },
  },
  created() {
    this.mdiAccount = mdiAccount;
    this.mdiMapMarker = mdiMapMarker;
    this.mdiComment = mdiComment;
  },
  mounted() {
    if (this.config.annotationmode === true) {
      this.dataTypes.model = ['Person', 'Place', 'Comment'];
      this.modifiers[0].model = 1;
      this.highlightingMode(this.modifiers[0].model);
    }
  },
  methods: {
    dynamicEvent(event, model) {
      this[event](model);
    },
    highlightEntity(id, type) {
      this.$root.$emit('toggle-entity-highlighting', id, type);
    },
    highlightingMode(model) {
      this.$root.$emit('toggle-highlighting-mode', model, this.dataTypes.model);
    },
    sortByOrder(model) {
      return model === 'alpha'
        ? this.items.sort((x, y) => x.text.localeCompare(y.text))
        : this.items.reverse();
    },
    sortByDirection(model) {
      return model === 'desc' && this.modifiers[2].model !== 'desc'
        ? this.items.reverse()
        : this.items;
    },
  },
};
</script>
