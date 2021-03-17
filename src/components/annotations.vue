<template>
  <div
    v-if="annotations.length"
    class="q-ma-sm"
  >
    <!-- Data type Toggles -->
    <div class="text-uppercase">
      <q-toolbar class="q-pa-none">
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
        :val="type.value"
        color="accent"
        size="lg"
      />
    </div>

    <!-- List of Annotations -->
    <div
      v-if="items.length"
      class="q-mt-lg q-pb-lg"
    >
      <q-toolbar class="q-pl-none">
        <q-toolbar-title class="text-uppercase">
          List of annotations ({{ items.length }})
        </q-toolbar-title>
      </q-toolbar>

      <q-list>
        <q-item
          v-for="(annotation, index) in items"
          :key="index"
          class="cursor-pointer"
          active-class="active-item"
          clickable
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
    <div>
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
            color="white"
            no-caps
            size="md"
            spread
            style="border: 1px solid grey-5;"
            text-color="primary"
            toggle-color="accent"
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
  background-color: lightgrey;
}
.custom-toggle {
  border: 1px solid #ababab;
}
</style>
