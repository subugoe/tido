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
            @click="
              annotation.selected = !annotation.selected;
              options[0].model = selectedAll;
              highlightTextEntity(annotation.id);"
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
                  ({{ annotation.description }})
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>

    <div v-else>
      <h3 class="text-body1 q-mb-md text-weight-medium text-uppercase">
        Click on a data type to show the annotations
      </h3>
    </div>

    <!-- Options -->
    <div v-if="items.length">
      <h3 class="text-body1 q-mb-md text-weight-medium text-uppercase">
        Options
      </h3>

      <div
        v-for="(opt, index) in options"
        :key="index"
        class="q-pb-md"
      >
        <div
          v-if="items.length > opt.limit"
          class="column"
        >
          <span class="col q-pb-xs text-uppercase text-weight-regular">
            {{ opt.label }}
          </span>

          <q-btn-toggle
            v-model="opt.model"
            :color="$q.dark.isActive ? 'grey-9' : 'white'"
            :options="opt.options"
            :text-color="$q.dark.isActive ? 'white' : 'primary'"
            :toggle-color="$q.dark.isActive ? 'grey-1' : 'accent'"
            :toggle-text-color="$q.dark.isActive ? 'black' : 'white'"
            class="custom-toggle"
            size="sm"
            spread
            unelevated
            @click="dynamicEvent(opt.event, opt.model)"
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
      options: [
        {
          event: 'highlightMode',
          label: 'Highlight',
          limit: 0,
          model: false,
          options: [
            { label: 'All', value: true }, { label: 'None', value: false },
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
      if (!this.annotations.length) {
        return [];
      }
      // filter all annotation types that have been selected (typeModel)
      let filteredAnnotations = this.annotations.filter((type) => this.typeModel.includes(type.contenttype));

      // determine sorting order and direction
      const sortingOrder = this.options[1].model;
      const sortingDirection = this.options[2].model;

      // sort the matching IDs according to the sortingOrder given
      filteredAnnotations = sortingOrder === 'alpha'
        ? filteredAnnotations.sort((x, y) => x.text.localeCompare(y.text))
        : filteredAnnotations.sort((x, y) => x.id.localeCompare(y.id));

      // determine the sorting direction
      return sortingDirection === 'asc'
        ? filteredAnnotations
        : filteredAnnotations.reverse();
    },
    selectedAll() {
      const numberSelected = this.items.filter((item) => item.selected === true);

      return numberSelected === this.items.length;
    },
  },
  created() {
    if (this.config.annotationmode) {
      // show all Annotations at start
      this.typeModel = ['Person', 'Place', 'Editorial Comment'];
      // set the highlight mode to 'All'
      this.options[0].model = true;
      // wait for the *annotations* to load and highlight all text entities
      setTimeout(() => {
        this.highlightMode(true);
      }, 1500);
    }
  },
  mounted() {
    this.toggleHighlighting();

    this.$root.$on('update-item', () => {
      // eslint-disable-next-line no-console
      console.log('Types', this.typeModel, 'Mode', this.options[0].model, 'Order', this.options[1].model, 'Direction', this.options[2].model, 'Count', this.items.length);
    });
  },
  methods: {
    dynamicEvent(event, model) {
      this[event](model);
    },
    highlightTextEntity(id) {
      const entity = document.getElementById(id);

      if (entity !== null) {
        entity.style.borderBottom = entity.style.borderBottom ? '' : 'solid';
      }
    },
    // WIP: Toggle highlighting of annotation when clicking on appropriate text entity
    toggleHighlighting() {
      if (this.annotations.length) {
        this.annotations.forEach((annotation) => {
          const id = document.getElementById(annotation.id);

          if (id !== null) {
            id.onclick = this.highlightTextEntity(annotation.id);
          }
        });
      }
    },
    highlight(mode) {
      if (this.typeModel.length && this.items.length) {
        this.typeModel.forEach((type) => {
          const contentTypes = this.annotations.filter((annotation) => annotation.contenttype === type);

          if (contentTypes.length) {
            contentTypes.forEach((contentType) => {
              const textEntity = document.getElementById(contentType.id);
              if (textEntity !== null) {
                textEntity.style.borderBottom = !mode ? '' : 'solid';
              }
            });
          }
        });
      }
    },
    highlightMode(mode) {
      this.annotations.forEach((annotation) => {
        annotation.selected = mode;
      });

      this.highlight(mode);
    },
    sortDirection() {
      return this.items;
    },
    sortOrder(order) {
      return order === 'alpha'
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
