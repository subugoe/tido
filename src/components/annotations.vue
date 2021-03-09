<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm scroll-panel"
  >
    <!-- Data type Toggles -->
    <div>
      <q-toolbar>
        <q-toolbar-title class="text-uppercase">
          Show / hide data types
        </q-toolbar-title>
      </q-toolbar>

      <q-btn-toggle
        v-model="entity.model"
        clearable
        spread
        :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
        :options="entity.options"
        @click="annotationType = entity.model"
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
        >
          <q-item-section avatar>
            <q-icon :name="entity.icons[annotation[1].contenttype]" />
          </q-item-section>

          <q-item-section>
            <q-item-label
              :class="[entity.selected ? 'highlight' : '']"
              overline
              class="text-uppercase"
              @click="$root.$emit('update-entity-id', annotation[0], annotation[1].contenttype)"
            >
              {{ annotation[1].text }} ( {{ annotation[1].comment }} )
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
              :color="$q.dark.isActive ? 'grey-1 text-grey-10' : 'accent'"
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
      type: Object,
      default: () => {},
    },
    annotations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      annotationType: '',
      entity: {
        icons: {
          Comment: mdiComment,
          Person: mdiAccount,
          Place: mdiMapMarker,
        },
        model: null,
        options: [
          { label: 'Names', icon: mdiAccount, value: 'Person' },
          { label: 'Places', icon: mdiMapMarker, value: 'Place' },
          { label: 'Comments', icon: mdiComment, value: 'Comment' },
        ],
        selected: false,
      },
      modifiers: [
        {
          event: 'highlight',
          label: 'Highlight',
          limit: 0,
          model: null,
          options: [
            { label: 'All', value: 1 }, { label: 'None', value: 0 },
          ],
        },
        {
          event: 'sortByOrder',
          label: 'Sorting order',
          limit: 1,
          model: null,
          options: [
            { label: 'Alphabetic', value: 'alpha' }, { label: 'Appearance', value: 'sequence' },
          ],
        },
        {
          event: 'sortByDirection',
          label: 'Sorting direction',
          limit: 1,
          model: null,
          options: [
            { label: 'Ascending', value: 'asc' }, { label: 'Descending', value: 'desc' },
          ],
        },
      ],
    };
  },
  computed: {
    items() {
      if (this.annotations.length) {
        return Object.entries(this.annotationids).filter((type) => this.annotationType === type[1].contenttype);
      }
      return [];
    },
  },
  created() {
    this.mdiAccount = mdiAccount;
    this.mdiMapMarker = mdiMapMarker;
    this.mdiComment = mdiComment;
  },
  methods: {
    dynamicEvent(event, model) {
      this[event](model);
    },
    highlight(model) {
      this.$root.$emit('update-highlighting', model, this.annotationType);
    },
    sortByOrder(model) {
      return model === 'alpha'
        ? this.items.sort((x, y) => x[1].text.localeCompare(y[1].text))
        : this.items;
    },
    sortByDirection(model) {
      return model === 'asc'
        ? this.items.sort((x, y) => x[1].text.localeCompare(y[1].text))
        : this.items.reverse();
    },
  },
};
</script>

<style lang="scss" scoped>
  .highlight {
    background-color: 'grey';
  }
</style>
