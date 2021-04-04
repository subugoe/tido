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
              toggleHighlightList(annotation);
              toggleHighlightText(annotation, 'list');
            "
          >
            <q-avatar
              class="q-mr-sm"
              size="md"
            >
              <q-icon :name="icons[annotation.contenttype]" />
            </q-avatar>

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
      <Notification :message="messages.user" />
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
            @click="dynamicEvent(opt.event, opt.model, true)"
          />
        </div>
      </div>
    </div>
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
    Object.entries(this.config.annotations.icons).forEach(([k, v]) => {
      this.icons[k] = Icons[v];
    });

    this.types = this.config.annotations.types;
  },
  mounted() {
    this.init();
  },
  methods: {
    getIcon(type) {
      const span = document.createElement('q-icon');
      span.setAttribute('name', this.icons[type]);
      // const span = document.createElement('span');

      return span;
    },
    // bind dynamic events / models to the options
    dynamicEvent(event, model, state = false) {
      this[event](model, state);
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
        filteredAnnotations.forEach((annotation) => this.toggleHighlightText(annotation, 'type'));
      }
      // get the current state for the next comparison
      this.lastTypeState = this.typeModel;
    },
    // highlights either all (true) or none (false)
    highlightMode() {
      this.items.forEach((annotation) => {
        annotation.selected = this.options[0].model;

        this.toggleHighlightText(annotation);
      });
    },
    init() {
      // check whether to start with all annotations highlighted or none
      this.options[0].model = this.config.annotations.show;
      // verify content types and populate typeModel accordingly
      this.typeModel = this.config.annotations.show
        ? this.availableTypes
        : [];
      // wait for the annotations to load
      setTimeout(() => {
        this.highlightMode();
        this.registerToggles();
      }, 2000);
    },
    // Toggle highlighting of annotation/s when clicking on the appropriate text entity
    registerToggles() {
      let current = [];

      if (!this.config.annotations.show) {
        const types = this.availableTypes;

        current = this.annotations.filter((type) => types.includes(type.contenttype) && type.text !== false);
      } else current = this.items;

      current.forEach((annotation) => {
        const entity = document.getElementById(annotation.id);

        if (entity !== null) {
          entity.style.borderBottom = this.config.annotations.show
            ? '2px solid'
            : '';

          entity.style.cursor = 'pointer';
          entity.style.paddingBottom = '4px';

          entity.onclick = () => {
            if (!this.typeModel.includes(annotation.contenttype)) {
              this.typeModel.push(annotation.contenttype);
            }
            this.toggleHighlightList(annotation);
            this.toggleHighlightText(annotation, 'text');
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
    // de/highlights annotation/s individually (Annotation list)
    toggleHighlightList(annotation) {
      annotation.selected = !annotation.selected;
      // set the button state (All | None)
      this.options[0].model = this.selectedAll;
    },
    toggleHighlightText(annotation, caller = '') {
      const entity = document.getElementById(annotation.id);

      if (entity !== null) {
        const icon = this.getIcon(annotation.contenttype);
        // eslint-disable-next-line no-console
        console.log(icon);

        switch (caller) {
          case 'list':
          case 'text':
            entity.style.borderBottom = entity.style.borderBottom
              ? ''
              : '2px solid';

            if (entity.style.borderBottom) {
              entity.appendChild(icon);
            } else entity.removeChild(entity.lastChild);

            break;
          case 'type':
            if (this.options[0].model) {
              entity.style.borderBottom = entity.style.borderBottom
                ? ''
                : '2px solid';

              if (entity.style.borderBottom) {
                entity.appendChild(icon);
              } else {
                entity.removeChild(entity.lastChild);
              }
            } else {
              entity.style.borderBottom = '';
              entity.removeChild(entity.lastChild);
            }
            break;
          default:
            entity.style.borderBottom = this.options[0].model
              ? '2px solid'
              : '';

            entity.style.borderBottom = this.options[0].model
              ? entity.appendChild(icon)
              : entity.removeChild(entity.lastChild);

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

.custom-toggle {
  border: 1px solid #ababab;
}

.list-height {
  height: 27vh;
}
</style>
