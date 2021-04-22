<template>
  <div
    v-if="annotations.length"
    class="panel q-ma-sm"
  >
    <!-- Data type Toggles -->
    <div>
      <h3 class="text-body1 q-mt-none q-mb-md text-weight-medium text-uppercase">
        Show/hide data types
      </h3>

      <q-toggle
        v-for="(type, index) in types"
        :key="index"
        v-model="typeModel"
        :color="$q.dark.isActive ? 'grey-8' : 'accent'"
        :disable="typeDisabled(type['content-type'])"
        :icon="icons[type['content-type']]"
        :label="type.label"
        :val="type['content-type']"
        class="text-uppercase q-mr-lg q-mb-md"
        dense
        size="lg"
        toggle-order="tf"
      />
    </div>

    <!-- List of Annotations -->
    <div
      v-if="items.length"
      class="q-pt-sm q-pb-xs annotation-list panel-content"
    >
      <h3 class="text-body1 q-mb-md q-mt-none text-weight-medium text-uppercase">
        List of Annotations ({{ items.length }})
      </h3>

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
            toggleListHighlighting(annotation);
            toggleTextHighlighting(annotation, 'list');
          "
        >
          <q-avatar
            class="q-mr-sm"
            size="md"
          >
            <q-icon :name="icons[annotation.contenttype]" />
          </q-avatar>

          <q-item-section>
            <q-item-label overline>
              <div class="text-body1">
                {{ annotation.description }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div v-else>
      <Notification :message="messages.user" />
    </div>

    <!-- Options -->
    <q-expansion-item
      v-if="items.length"
      header-class="text-body1 q-mb-md text-weight-medium text-uppercase"
      label="Options"
    >
      <div
        class="q-mb-sm"
      >
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
              @click="dynamicEvent(opt.event, opt.model, true)"
            />
          </div>
        </div>
      </div>
    </q-expansion-item>
  </div>

  <div v-else>
    <Notification :message="messages.none" />
  </div>
</template>

<script>
import * as Icons from '@quasar/extras/fontawesome-v5';
import Notification from '@/components/notification.vue';

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
      icons: {},
      messages: {
        none: 'No annotations available',
        user: 'Toggle at least one data type to show annotations',
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
          event: 'sortingOrder',
          label: 'Sorting order',
          limit: 1,
          model: 'sequence',
          options: [
            { label: 'Alphabetic', value: 'alpha' }, { label: 'Appearance', value: 'sequence' },
          ],
        },
        {
          event: 'sortingDirection',
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
      types: [],
    };
  },
  computed: {
    availableTypes() {
      // filter all unique annotation (data) types of the current item
      const availableTypes = [];
      this.annotations.forEach((annotation) => {
        if (!availableTypes.includes(annotation.contenttype)) availableTypes.push(annotation.contenttype);
      });

      return availableTypes;
    },
    items() {
      if (!this.annotations.length) {
        return [];
      }
      // filter all annotation types that have been selected (typeModel)
      let filteredAnnotations = this.annotations.filter((type) => this.typeModel.includes(type.contenttype) && type.text !== false);

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
      // if all the items cuurently shown have been selected, toggle the button state (All)
      return selection.length === this.items.length;
    },
  },
  watch: {
    // called on item update
    annotations() {
      this.init();
    },
    // called on data type update / toggling
    typeModel() {
      this.highlightDiff();
    },
  },
  created() {
    this.types = this.config.annotations.types;

    this.createIcons();
  },
  methods: {
    // append icons to the text entities
    addIcons() {
      this.annotations.forEach((annotation) => {
        const entity = document.getElementById(annotation.id);

        if (entity !== null) {
          const currentIcon = this.types.filter((type) => type['content-type'] === annotation.contenttype)[0].icon;
          entity.prepend(this.createSVG(currentIcon));
          entity.classList.toggle('annotation');
          entity.onclick = () => {
            entity.classList.toggle('annotation-disabled');
            annotation.selected = !annotation.selected;
          };
        }
      });
    },
    // create SVGs for the data type toggles and the list alike
    createIcons() {
      this.types.forEach((type) => {
        this.icons[type['content-type']] = Icons[type.icon]
          ? Icons[type.icon]
          : Icons.fasTimes; // fallback if icon doesn't exist
      });
    },
    // create SVGs for the text entities
    createSVG(name) {
      const [path, viewbox] = Icons[name].split('|');

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('class', 'q-icon q-ml-sm');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('role', 'presentation');
      svg.setAttribute('viewBox', viewbox);

      const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      newPath.setAttribute('d', path);
      svg.appendChild(newPath);

      return svg;
    },
    // bind dynamic events / models to the options
    dynamicEvent(event, model, state = false) {
      this[event](model, state);
    },
    // de/highlights all text entities matching the type toggle de/selected
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
        filteredAnnotations.forEach((annotation) => this.toggleTextHighlighting(annotation, 'type'));
      }
      // get the current state for the next comparison
      this.lastTypeState = this.typeModel;
    },
    // highlights either all (true) or none (false)
    highlightMode() {
      this.items.forEach((annotation) => {
        annotation.selected = this.options[0].model;

        this.toggleTextHighlighting(annotation);
      });
    },
    init() {
      const highlight = this.config.annotations.show;
      // check whether to start with all annotations highlighted or none
      this.options[0].model = highlight;

      // verify content types and populate typeModel accordingly
      // used at top toggles
      this.typeModel = highlight
        ? this.availableTypes
        : [];

      if (highlight) {
        // todo: when highlight false no icons will be set
        this.addIcons();
      }

      this.highlightMode();
      this.registerToggles();
    },
    // Toggle highlighting of annotation/s when clicking on the appropriate text entity
    registerToggles() {
      let current = this.items;

      if (!this.config.annotations.show) {
        const types = this.availableTypes;

        current = this.annotations.filter((annotation) => types.includes(annotation.contenttype) && annotation.text !== false);
      }
      return current;
    },
    sortingDirection() {
      return this.items;
    },
    sortingOrder(order) {
      return order === 'alpha'
        ? this.items.sort((x, y) => x.text.localeCompare(y.text))
        : this.items.sort((x, y) => x.id.localeCompare(y.id));
    },
    // de/highlights annotation/s individually (Annotation list)
    toggleListHighlighting(annotation) {
      annotation.selected = !annotation.selected;
      // set the button state (All | None)
      this.options[0].model = this.selectedAll;
    },
    toggleTextHighlighting(annotation, caller = '') {
      const entity = document.getElementById(annotation.id);

      if (entity !== null) {
        switch (caller) {
          case 'list':
          case 'text':
            entity.classList.toggle('annotation-disabled');
            break;
          case 'type':
            annotation.selected = this.options[0].model;
            break;
          default:
            annotation.selected = this.options[0].model; // annotation-list
            if (!this.options[0].model) {
              entity.classList.add('annotation-disabled');
            } else {
              entity.classList.remove('annotation-disabled');
            }
            break;
        }
      }
    },
    typeDisabled(type) {
      return !this.availableTypes.includes(type);
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

.annotation-list {
  flex-grow: 1;
}

.custom-toggle {
  border: 1px solid #ababab;
}

.panel-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  overflow-x: hidden;
  padding: 8px;
}

.q-expansion-item--expanded {
  bottom: 0;
  background: lightgray;
  color: black;
  position: sticky;
}
</style>
