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
        :color="$q.dark.isActive ? 'grey-8' : 'accent'"
        :icon="type.icon"
        :label="type.label"
        :val="type.value"
        class="text-uppercase q-mr-lg q-mb-md"
        dense
        size="lg"
        toggle-order="tf"
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

      <q-scroll-area class="list-height">
        <q-list>
          <q-item
            v-for="(annotation, index) in items"
            :key="index"
            :active="annotation.selected"
            active-class="active-item"
            class="cursor-pointer q-py-xs q-mb-xs q-px-sm"
            clickable
            dense
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
      </q-scroll-area>
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
            :color="$q.dark.isActive ? 'grey-9' : 'white'"
            :text-color="$q.dark.isActive ? 'white' : 'primary'"
            :toggle-color="$q.dark.isActive ? 'grey-1' : 'accent'"
            :toggle-text-color="$q.dark.isActive ? 'black' : 'white'"
            class="custom-toggle"
            size="sm"
            spread
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
      return this.annotations.length && this.annotationids.length
        ? this.annotationids.filter((type) => this.typeModel.includes(type.contenttype))
        : [];
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
  },
  methods: {
    dynamicEvent(event, model) {
      this[event](model);
    },
    highlightEntity(id) {
      const entity = document.getElementById(id);

      if (entity !== null) {
        entity.style.borderBottom = entity.style.borderBottom ? '' : 'solid';
      }
    },
    // WIP: Toggle highlighting of annotation when clicking on appropriate text entity
    toggleHighlighting() {
      setTimeout(() => {
        if (this.annotationids.length) {
          // implicitly (just) cast annotationids to type array to ease the iteration
          const entities = this.annotationids.filter((entity) => entity);

          entities.forEach((entity) => {
            const id = document.getElementById(entity.id);

            if (id !== null) {
              id.onclick = this.$root.$emit('toggle-annotation-highlighting', entity.id);
            }
          });
        }
      }, 1500);
    },
    highlight(model) {
      if (this.annotationids.length && Array.isArray(this.typeModel) && this.typeModel.length) {
        this.typeModel.forEach((type) => {
          const idsByType = this.annotationids.filter((entity) => entity.contenttype === type);

          idsByType.forEach((typeId) => {
            const e = document.getElementById(typeId.id);
            if (e !== null) {
              e.style.borderBottom = !model ? '' : 'solid';
            }
          });
        });
      }
    },
    highlightMode(model) {
      this.annotationids.forEach((entity) => {
        if (model === 1) {
          entity.selected = true;
        } else entity.selected = false;
      });

      this.highlight(model);
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

.list-height {
  height: 27vh;
}
</style>
