<template>
  <section>
    <div class="panels__wrap">
      <Panelsdraggable
        v-model="panels"
        handle=".only-bedrag"
        @change="$root.$emit('panels-position', panels)"
      >
        <div
          v-for="(panel, idx) in panels"
          v-show="panel.show"
          :key="`pa${idx}`"
          class="panels"
        >
          <div
            class="effected"
            :unique-index="idx"
            :class="$q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-1 text-black'"
            @dragleave.prevent="dragHighlightComponent($event, false)"
            @dragover.prevent="dragHighlightComponent($event)"
            @drop="receivingComponent($event)"
          >
            <div>
              <div class="panel__header">
                <input
                  class="panel-textinput text-uppercase"
                  :class="$q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-1 text-black'"
                  type="text"
                  :value="panel.panel_label"
                  @input="(e) => handlePanelLabel(e, idx)"
                >
              </div>
              <q-separator />

              <div class="components-list">
                <template v-if="panel.connector.length">
                  <div
                    v-for="(comp,i) in panel.connector"
                    :key="`pi${i}`"
                    draggable="true"
                    :class="$q.dark.isActive ? 'bg-black text-white' : 'bg-grey-1 text-black'"
                    @dragstart="dragged = comp.id; draggedPanelIdx = idx"
                    @dragend="dragged = null; draggedPanelIdx = null"
                    v-text="comp.label"
                  />
                </template>
              </div>

              <div class="actions">
                <q-btn
                  class="only-bedrag panel-boxes__handle bg-accent text-white"
                  round
                  flat
                  size="xs"
                  title="Drag and drop the panels to reorder."
                  :icon="fasArrowsAlt"
                />
              </div>
            </div>
          </div>
        </div>
        <q-btn
          v-if="panels.length < 4"
          slot="footer"
          color="$grey-4"
          flat
          size="large"
          :icon="fasPlus"
          @click="addPanel"
        />
      </Panelsdraggable>
    </div>
  </section>
</template>

<script>
import Panelsdraggable from 'vuedraggable';
import { fasPlus, fasTrash, fasArrowsAlt } from '@quasar/extras/fontawesome-v5';

export default {
  components: {
    Panelsdraggable,
  },
  props: {
    data: Array,
  },
  data: () => ({
    dragged: null,
    draggedPanelIdx: null,
    panels: [],
  }),
  computed: {
    panelsEmptyConnectors() {
      let result = false;

      this.data.forEach((p) => {
        if (p.connector.length) result = true;
      });

      return result;
    },
  },
  watch: {
    data() {
      this.setpanels();
    },
  },
  mounted() {
    this.setpanels();
  },
  created() {
    this.fasPlus = fasPlus;
    this.fasTrash = fasTrash;
    this.fasArrowsAlt = fasArrowsAlt;
  },
  methods: {
    addPanel() {
      this.$root.$emit('add-panel');
    },
    dragHighlightComponent(event, isEnter = true) {
      const element = event.target.classList.contains('effected');
      const outline = isEnter && element ? '1px solid grey' : '';

      event.target.style.outline = outline;
    },
    handlePanelLabel(e, index) {
      this.$root.$emit('update-panellabel', {
        v: e.target.value,
        index,
      });
    },
    receivingComponent(e) {
      const element = e.target;
      const targetElID = element.getAttribute('unique-index');

      this.dragHighlightComponent(e, false);

      if (!this.dragged) return;
      if (!element.classList.contains('effected')) return;

      this.$root.$emit('handle-connector', {
        from: this.draggedPanelIdx,
        idC: this.dragged,
        to: targetElID,
      });
    },
    setpanels() {
      this.panels = this.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.panels__wrap {
  > * {
    column-gap: 24px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .components-list > * {
    background-color: $light;
    border-radius: 2px;
    cursor: move;
    margin: 8px 0;
    padding: 8px;
  }

  .actions {
    left: -8px;
    position: absolute;
    top: -8px;
  }
}

.panels {
  position: relative;

  > * {
    height: 240px;
    padding: 24px 8px;
  }
}

.panel__header {
  display: flex;
}
</style>
