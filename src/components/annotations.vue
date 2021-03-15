<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm"
  >
    <!-- Data type Toggles -->
    <div class="text-uppercase">
      <q-toolbar>
        <q-toolbar-title>
          Show / hide data types
        </q-toolbar-title>
      </q-toolbar>

      <q-toggle
        v-for="(type, index) in types"
        :key="index"
        v-model="typeModel"
        :icon="type.icon"
        :label="type.label"
        size="lg"
        :val="type.value"
      />
    </div>

    <!-- List of Annotations -->
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
          :active="false"
          class="cursor-pointer"
        >
          <q-item-section avatar>
            <q-icon :name="icons[annotation.contenttype]" />
          </q-item-section>

          <q-item-section>
            <q-item-label
              class="text-uppercase"
              overline
              @click="highlightEntity(annotation.id, annotation.contenttype)"
            >
              {{ annotation.text }} ({{ annotation.comment }})
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- <div
        v-for="(annotation, index) in items"
        :key="index"
      >
        <q-btn
          flat
          padding="sm"
          :icon="icons[annotation.contenttype]"
          :label="annotation.text"
          @click="highlightEntity(annotation.id, annotation.contenttype)"
        >
          <span class="q-pl-md">({{ annotation.comment }})</span>
        </q-btn>
      </div> -->
    </div>

    <!-- Modifiers -->
    <div>
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
      icons: {
        Comment: mdiComment,
        Person: mdiAccount,
        Place: mdiMapMarker,
      },
      modifiers: [
        {
          event: 'highlightMode',
          label: 'Highlight',
          limit: 0,
          model: 0,
          options: [
            { label: 'All', value: 1 }, { label: 'None', value: 0 },
          ],
        },
        {
          event: 'sortOrder',
          label: 'Sorting order',
          limit: 1,
          model: 'sequence',
          options: [
            { label: 'Alphabetic', value: 'alpha' }, { label: 'Appearance', value: 'sequence' },
          ],
        },
        {
          event: 'sortDirection',
          label: 'Sorting direction',
          limit: 1,
          model: 'asc',
          options: [
            { label: 'Ascending', value: 'asc' }, { label: 'Descending', value: 'desc' },
          ],
        },
      ],
      typeModel: [],
      types: [
        { icon: mdiAccount, label: 'Names', value: 'Person' },
        { icon: mdiMapMarker, label: 'Places', value: 'Place' },
        { icon: mdiComment, label: 'Comments', value: 'Comment' },
      ],
    };
  },
  computed: {
    items() {
      return Object.values(this.annotationids).filter((type) => this.typeModel.includes(type.contenttype));
    },
  },
  created() {
    if (this.config.annotationmode === true) {
      // show all Annotations at start
      this.typeModel = ['Person', 'Place', 'Comment'];
      // set the appropriate model: 1 === 'All'
      this.modifiers[0].model = 1;
      // emit the state (orresponding listener to be found in in @components/content.vue)
      this.highlightMode(this.modifiers[0].model);
    }
  },
  mounted() {
    this.$root.$on('update-item', () => {
      // TODO: Update computed property (items) on item update
    });
  },
  methods: {
    dynamicEvent(event, model) {
      this[event](model);
    },
    highlightEntity(id, type) {
      this.$root.$emit('toggle-entity-highlighting', id, type);
    },
    highlightMode(model) {
      this.$root.$emit('toggle-highlight-mode', model, this.typeModel);
    },
    sortDirection() {
      return this.items.reverse();
    },
    sortOrder(model) {
      return model === 'alpha'
        ? this.items.sort((x, y) => x.text.localeCompare(y.text))
        : this.items.sort((x, y) => x.id.localeCompare(y.id));
    },
  },
};
</script>
