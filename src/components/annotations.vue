<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm"
  >
    <!-- Data type Toggles -->
    <div>
      <h3 class="text-body1 q-mb-sm text-weight-medium text-uppercase">
        Show/hide data types
      </h3>

      <q-toggle
        v-for="(type, index) in types"
        :key="index"
        v-model="typeModel"
        :icon="type.icon"
        :label="type.label"
        :val="type.value"
        :color="$q.dark.isActive ? 'grey-8' : 'accent'"
        size="lg"
        dense
        toggle-order="tf"
        class="text-uppercase q-mr-lg q-mb-md asdf"
      />
    </div>

    <!-- List of Annotations -->
    <div
      v-if="items.length"
      class="q-pt-sm q-pb-xs"
    >
      <h3 class="text-body1 q-mb-sm q-mt-none text-weight-medium text-uppercase">
        List of Annotations ({{ items.length }})
      </h3>
      <q-list>
        <q-item
          v-for="(annotation, index) in items"
          :key="index"
          class="cursor-pointer q-py-xs q-mb-xs q-px-sm"
          active-class="active-item"
          clickable
          dense
          :active="annotation.selected"
          @click="annotation.selected = !annotation.selected; highlightEntity(annotation.id)"
        >
          <q-item-section avatar>
            <q-icon :name="icons[annotation.contenttype]" />
          </q-item-section>

          <q-item-section>
            <q-item-label
              class="text-uppercase"
              overline
            >
              <div class="q-mb-xs text-body1">
                {{ annotation.text }}
              </div>
              <div>
                ({{ annotation.comment }})
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Modifiers -->
    <div v-if="items.length">
      <h3 class="text-body1 q-mb-md text-weight-medium text-uppercase">
        Options
      </h3>
      <div
        v-for="(modifier, index) in modifiers"
        :key="index"
        class="q-pb-md"
      >
        <div
          v-if="items.length > modifier.limit"
          class="column"
        >
          <span class="col q-pb-xs text-uppercase text-weight-regular">
            {{ modifier.label }}
          </span>

          <q-btn-toggle
            v-model="modifier.model"
            :options="modifier.options"
            class="custom-toggle"
            :color="$q.dark.isActive ? 'grey-9' : 'white'"
            size="sm"
            spread
            :text-color="$q.dark.isActive ? 'white' : 'primary'"
            :toggle-color="$q.dark.isActive ? 'grey-1' : 'accent'"
            :toggle-text-color="$q.dark.isActive ? 'black' : 'white'"
            unelevated
            @click="dynamicEvent(modifier.event, modifier.model)"
          />
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
        'Editorial Comment': mdiComment,
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
        { icon: mdiComment, label: 'Comments', value: 'Editorial Comment' },
      ],
    };
  },
  computed: {
    items() {
      return this.annotationids.filter((type) => this.typeModel.includes(type.contenttype));
    },
  },
  created() {
    if (this.config.annotationmode) {
      // show all Annotations at start
      this.typeModel = ['Person', 'Place', 'Editorial Comment'];
      // set the appropriate model: 1 === 'All'
      this.modifiers[0].model = 1;
      // emit the state (corresponding listener to be found in in @components/content.vue)
      this.highlightMode(1);
    }
  },
  mounted() {
    this.$root.$on('update-item', () => {
      // TODO: Update computed property (items) on item update
    });

    this.$root.$on('toggle-annotation-highlighting', (id) => {
      // eslint-disable-next-line no-console
      console.log(id);
    });
  },
  methods: {
    dynamicEvent(event, model) {
      this[event](model);
    },
    highlightEntity(id) {
      this.$root.$emit('toggle-entity-highlighting', id);
    },
    highlightMode(model) {
      this.annotationids.forEach((entity) => {
        if (model === 1) {
          entity.selected = true;
        } else entity.selected = false;
      });

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

<style lang="css" scoped>
.active-item {
  background-color: #d3d3d3;
  color: #000;
}

@media (prefers-color-scheme: dark) {
  .active-item {
    background-color: grey-10;
  }

  .active-item .q-item__label {
    color: #000;
  }
}

.custom-toggle {
  border: 1px solid #ababab;
}

/* .asdf .q-toggle__inner .q-toggle__track {
  background-color: #abecab !important;
  border: 5px solid #000000;
} */
</style>
