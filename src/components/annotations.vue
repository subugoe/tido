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
        :disabled="typeDisabled"
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
              toggleHighlighting(annotation.id, annotation.contenttype);"
          >
            <q-item-section avatar>
              <q-icon :name="icons.sets[annotation.contenttype]" />
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
      <Notification message="Toggle at least one data type to show annotations" />
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
    <Notification message="No annotations available" />
  </div>
</template>

<script>
import Notification from '@/components/notification.vue';
import { fasComment, fasMapMarker, fasUser } from '@quasar/extras/fontawesome-v5';

require('../../node_modules/@quasar/extras/fontawesome-v5/fontawesome-v5.css');

export default {
  name: 'Annotations',
  components: {
    Notification,
  },
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
        classes: {
          'Editorial Comment': 'fa-comment',
          Person: 'fa-user-alt',
          Place: 'fa-map-marker-alt',
        },
        sets: {
          'Editorial Comment': fasComment,
          Person: fasUser,
          Place: fasMapMarker,
        },
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
      lastTypeState: [],
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
      // filter all items that have been selected
      const selection = this.items.filter((item) => item.selected === true);

      return selection.length === this.items.length;
    },
    typeDisabled() {
      // filter all unique annotation (data) types of the current item
      const availableTypes = [];
      this.annotations.forEach((annotation) => {
        if (!availableTypes.includes(annotation.contenttype)) availableTypes.push(annotation.contenttype);
      });
      // FIXME
      // return this.typeModel.filter((type) => !availableTypes.includes(type));
      return false;
    },
  },
  watch: {
    // called on item update
    annotations() {
      this.highlightMode();
      this.registerHandler();
    },
    // called on data type update / toggling
    typeModel() {
      this.highlightDiff();
    },
  },
  mounted() {
    this.options[0].model = this.config.annotations.show;
    // check whether to start with all annotations highlighted or none
    this.typeModel = this.config.annotations.show
      ? this.config.annotations.types
      : [];
    // wait for the annotations to load
    setTimeout(() => {
      this.highlightMode();
      this.registerHandler();
    }, 2000);
  },
  methods: {
    dynamicEvent(event, model) {
      this[event](model);
    },
    highlightDiff() {
      let delta = [];
      let filteredAnnotations = [];

      // compare the last type state with the current typeModel according to user selection
      if (this.lastTypeState !== this.typeModel) {
        delta = this.typeModel.filter((type) => !this.lastTypeState.includes(type)).concat(this.lastTypeState.filter((type) => !this.typeModel.includes(type)));
        // filter all annotations that match delta
        delta.forEach((type) => {
          filteredAnnotations = this.annotations.filter((annotation) => type === annotation.contenttype);
        });
        // toggle the highlighting of the appropriate (delta-) type de/selected
        filteredAnnotations.forEach((annotation) => this.toggleHighlighting(annotation.id, annotation.contenttype));
      }
      // get current state for the next comparison
      this.lastTypeState = this.typeModel;
    },
    // highlights either all (true) or none (false)
    highlightMode() {
      const mode = this.options[0].model;

      this.items.forEach((annotation) => {
        // de/highlights the annotations in the list
        annotation.selected = mode;

        const entity = document.getElementById(annotation.id);
        // de/highlights the text entities
        if (entity !== null) {
          entity.style.borderBottom = mode ? 'solid' : '';
          entity.style.cursor = 'pointer';

          if (mode) {
            entity.classList.add('fas', this.icons.classes[annotation.contenttype]);
          } else entity.classList.remove('fas', this.icons.classes[annotation.contenttype]);
        }
      });
      // set button state
      this.options[0].model = this.selectedAll;
    },
    // Toggle highlighting of annotation/s when clicking on appropriate text entity
    registerHandler() {
      this.items.forEach((annotation) => {
        const entity = document.getElementById(annotation.id);

        if (entity !== null) {
          entity.style.cursor = 'pointer';

          entity.onclick = () => {
            annotation.selected = !annotation.selected;

            this.options[0].model = this.selectedAll;

            this.toggleHighlighting(annotation.id, annotation.contenttype);
          };
        }
      });
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
    toggleHighlighting(id, type) {
      const entity = document.getElementById(id);

      if (entity !== null) {
        entity.style.borderBottom = entity.style.borderBottom ? '' : 'solid';

        entity.classList.toggle('fas');
        entity.classList.toggle(this.icons.classes[type]);
      }
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
