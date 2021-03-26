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
              toggleHighlighting(annotation.id);"
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
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>

    <div v-else>
      <q-card
        bordered
        flat
      >
        <q-card-section class="text-center">
          <q-icon
            :name="fasInfoCircle"
            class="q-pr-sm"
            color="red-9"
            size="sm"
          />
          <span class="text-body1 text-uppercase vertical-middle">Please note</span>
        </q-card-section>

        <q-separator inset />

        <q-card-section class="text-body2 text-center text-uppercase">
          Toggle at least one data type to <span class="text-no-wrap">show annotations</span>.
        </q-card-section>
      </q-card>
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

  <div v-else>
    <span class="row justify-center text-h6 text-center text-uppercase">
      No annotations available
    </span>
  </div>
</template>

<script>
import {
  fasComment,
  fasInfoCircle,
  fasMapMarker,
  fasUser,
} from '@quasar/extras/fontawesome-v5';

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
        'Editorial Comment': fasComment,
        Person: fasUser,
        Place: fasMapMarker,
      },
      options: [
        {
          event: 'highlightMode',
          label: 'Highlight',
          limit: 0,
          model: null,
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
        { icon: fasUser, label: 'Names', value: 'Person' },
        { icon: fasMapMarker, label: 'Places', value: 'Place' },
        { icon: fasComment, label: 'Comments', value: 'Editorial Comment' },
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

      return numberSelected.length === this.items.length;
    },
  },
  watch: {
    annotations() {
      this.highlightMode(this.options[0].model);
      this.registerHandler();
    },
  },
  created() {
    this.fasInfoCircle = fasInfoCircle;
  },
  mounted() {
    if (this.config.annotationmode) {
      // show all Annotations at start
      this.typeModel = ['Person', 'Place', 'Editorial Comment'];
      // set the highlight mode to true ('All')
      this.options[0].model = true;
      // wait for the *annotations* to load and highlight all text entities
      setTimeout(() => {
        this.highlightMode(this.config.annotationmode);
        this.registerHandler();
      }, 2000);
    }
  },
  methods: {
    dynamicEvent(event, model) {
      this[event](model);
    },
    // highlights either all (true) or none (false)
    highlightMode(mode) {
      this.items.forEach((annotation) => {
        // de/highlights the annotations in the list
        annotation.selected = mode;

        const element = document.getElementById(annotation.id);

        if (element !== null) {
          // de/highlights the annotations in the text panel
          element.style.borderBottom = mode ? 'solid' : '';
          element.style.cursor = 'pointer';
        }
      });

      this.options[0].model = this.selectedAll;
    },
    // Toggle highlighting of annotation/s when clicking on appropriate text entity
    registerHandler() {
      if (this.items.length) {
        this.items.forEach((annotation) => {
          const entity = document.getElementById(annotation.id);

          if (entity !== null) {
            entity.onclick = () => {
              annotation.selected = !annotation.selected;

              this.options[0].model = this.selectedAll;

              this.toggleHighlighting(annotation.id);
              this.toggleIcon(entity);
            };
          }
        });
      }
    },
    sortDirection() {
      return this.items;
    },
    sortOrder(order) {
      return order === 'alpha'
        ? this.items.sort((x, y) => x.text.localeCompare(y.text))
        : this.items.sort((x, y) => x.id.localeCompare(y.id));
    },
    // highlights annotation/s individually on click (text panel)
    toggleHighlighting(id) {
      const entity = document.getElementById(id);

      if (entity !== null) {
        entity.style.borderBottom = entity.style.borderBottom ? '' : 'solid';
        entity.style.cursor = 'pointer';
      }
    },
    toggleIcon(entity) {
      const span = document.createElement('span');
      span.classList.toggle('icon fas fa-user');
      entity.appendChild(span);
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

.icon::after {
  display: inline-block;
  font-family: 'Font Awesome 5 Free';
  font-style: normal;
  font-weight: 900;
}

.list-height {
  height: 27vh;
}
</style>
