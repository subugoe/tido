<template>
  <section class="panel-boxs">
    <div class="panels">
      <Panelsdraggable
        handle=".only-bedrag"
        v-model="panels"
        @change="$root.$emit('panels-position', panels)"
        >
        <div class="p-c" v-for="(panel, idx) in panels" v-show="panel.show" :key="`pa${idx}`">
          <div
            class="effected"
            @dragleave.prevent="dragHighlightComponent($event, false)"
            @dragover.prevent="dragHighlightComponent($event)"
            @drop="receivingComponent($event)"
            :unique-index="idx"
            :class="$q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-1 text-black'"
            >
            <div>
              <header>
                <input
                  class="hidden-textinput"
                  type="text"
                  :class="$q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-1 text-black'"
                  :value="panel.panel_label"
                  @input="(e) => handlePanelLabel(e, idx)"
                />
              </header>
              <q-separator />

              <div class="components-list">
                <template v-if="panel.connector.length">
                  <div v-for="(comp,i) in panel.connector" :key="`pi${i}`"
                    draggable="true"
                    v-text="comp.label"
                    :class="$q.dark.isActive ? 'bg-black text-white' : 'bg-grey-1 text-black'"
                    @dragstart="dragged = comp.id; draggedPanelIdx = idx"
                    @dragend="dragged = null; draggedPanelIdx = null"
                  />
                </template>
              </div>

              <div class="actions">
                <q-btn
                  class="only-bedrag"
                  color="blue"
                  round
                  size="xs"
                  title="Drag and drop the panels to reorder."
                  :icon="fasArrowsAlt"
                />
              </div>
            </div>
          </div>
        </div>
        <q-btn v-if="panels.length < 4"
          color="secondary"
          flat
          size="large"
          slot="footer"
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
  data: () => ({
    dragged: null,
    draggedPanelIdx: null,
    panels: [],
  }),
  props: { data: Array },
  mounted() {
    this.setpanels();
  },
  watch: {
    data() {
      this.setpanels();
    },
  },
  computed: {
    panelsEmptyConnectors() {
      let result = false;

      this.data.forEach((p) => {
        if (p.connector.length) result = true;
      });

      return result;
    },
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
      this.$root.$emit('update-panellabel', { v: e.target.value, index });
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
  created() {
    this.fasPlus = fasPlus;
    this.fasTrash = fasTrash;
    this.fasArrowsAlt = fasArrowsAlt;
  },
};
</script>

<style lang="scss" scoped>
  .panels {
    > * {
      column-gap: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }

    div.p-c {
      position: relative;
      > * {
        background-color: #eee;
        height: 300px;
        padding: 15px 10px;
      }
    }

    header {
      display: flex;
    }

    .components-list {
      > * {
        background-color: $light;
        border-radius: 5px;
        cursor: move;
        margin: 10px 0;
        padding: 10px;

        &:active, &:focus {
          // FIXME: Quasar color variables
          outline: 1px solid blue;
        }
      }
    }

    .actions {
      left: -10px;
      position: absolute;
      top: -10px;
    }
  }
</style>
